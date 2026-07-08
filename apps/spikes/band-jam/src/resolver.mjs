// Artist-aware resolver: turns a JamIntent + reference data (sound manifest,
// sonic identities, artist traits) into a JamRecipe, per data-model.md's "Band
// jam mechanism contract". The trait-to-arrangement mapping below is
// spike-local (blocker-decisions.md flags it as undecided) — see
// apps/spikes/band-jam/README.md ("Artist-aware resolver") for the full rule list
// and rationale, including which knobs are audibly real vs. currently inert
// given the tile-based renderer's limits (no time-stretch/pitch-shift, no
// per-note control).
import { makeRng } from './synth.mjs';
import { ENGINE_VERSION } from './engine-version.mjs';

// Deterministic string hash (FNV-1a, 32-bit) so each resolver decision that
// needs randomness gets its own independently-seeded PRNG stream — adding or
// removing one rule can't silently shift an unrelated rule's draw.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function subSeed(seed, artistId, purpose) {
  return fnv1a(`${seed}:${artistId}:${purpose}`);
}

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const clamp = (lo, hi, x) => Math.max(lo, Math.min(hi, x));
const round4 = (x) => +x.toFixed(4);

// R6 — pattern label, cosmetic/provenance only (jam.mjs never reads track.patternId).
const PATTERN_BY_RHYTHMIC_STYLE = {
  sustained: 'sustain-root-per-bar',
  flowing: 'melodic-phrase',
  syncopated: 'tremolo-arp-16ths'
};

// R7 — mix effects base reverb per Band vibe (loosely grounded in the mood words).
const VIBE_BASE_REVERB = { driving: 0.12, neon: 0.2, gritty: 0.1 };

export function resolveJam(intent, { soundManifest, sonicIdentities, artistTraits }) {
  const log = [];

  // R0 — fail-closed validation. The hand-rolled schema validator only checks
  // required/enum, not numeric bounds or array length, so the resolver must.
  if (
    !Array.isArray(intent.memberIds) ||
    intent.memberIds.length < 2 ||
    intent.memberIds.length > 6
  ) {
    throw new Error(
      `intent.memberIds must have 2-6 members, got ${intent.memberIds && intent.memberIds.length}`
    );
  }
  if (typeof intent.intensity !== 'number' || intent.intensity < 0 || intent.intensity > 100) {
    throw new Error(`intent.intensity must be in [0,100], got ${intent.intensity}`);
  }

  const traitsById = Object.fromEntries(artistTraits.artists.map((a) => [a.artistId, a]));
  const identityById = Object.fromEntries(
    sonicIdentities.identities.map((i) => [i.sonicIdentityId, i])
  );

  const members = intent.memberIds.map((artistId) => {
    const traits = traitsById[artistId];
    if (!traits) throw new Error(`no ArtistTraits entry for "${artistId}"`);
    const candidates = soundManifest.sounds.filter(
      (s) => s.sourceBot === artistId && s.role === 'signature'
    );
    if (candidates.length === 0) throw new Error(`no signature sound for "${artistId}"`);
    // R1 — sound selection: exactly one candidate today; sorted by id so this
    // stays deterministic once an Artist can have multiple signature sounds.
    const sound = [...candidates].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))[0];
    const identity = identityById[sound.sonicIdentityId];
    if (!identity || identity.artistId !== artistId) {
      throw new Error(
        `sound "${sound.id}" sonicIdentityId "${sound.sonicIdentityId}" does not resolve to a SonicIdentity for "${artistId}"`
      );
    }
    return { artistId, traits, sound };
  });

  // R4 — tempo bucket (Energy): computed + logged, but the applied tempo stays
  // clamped to the shared native bpm — see README for why (avoids the loop's
  // baked-in chord progression drifting off the bar grid).
  const bpms = new Set(members.map((m) => m.sound.bpm));
  if (bpms.size > 1) {
    log.push(
      `  warning: lineup mixes bpms [${[...bpms].join(
        ', '
      )}]; using the lowest, no time-stretch tooling exists`
    );
  }
  const sharedBpm = Math.min(...bpms);
  const energyMax = Math.max(...members.map((m) => m.traits.energy));
  const bucket = energyMax < 34 ? 'low' : energyMax <= 66 ? 'mid' : 'high';
  const tempoRangeLo = Math.max(...members.map((m) => m.sound.tempoRange[0]));
  const tempoRangeHi = Math.min(...members.map((m) => m.sound.tempoRange[1]));
  const desiredTempo =
    bucket === 'low' ? tempoRangeLo : bucket === 'high' ? tempoRangeHi : sharedBpm;
  log.push(
    `  tempo: energyMax=${energyMax} -> bucket=${bucket}, desiredTempo=${desiredTempo} ` +
      `(logged only; applying native bpm=${sharedBpm} — no time-stretch tooling exists)`
  );

  // R5 — key center: shared value when uniform (always true today; renderJam
  // never actually reads recipe.keyCenter, so there's no tiebreak to invent
  // for a divergent lineup yet).
  const keyCenters = new Set(members.map((m) => m.sound.keyCenter));
  if (keyCenters.size > 1) {
    log.push(
      `  warning: lineup mixes key centers [${[...keyCenters].join(
        ', '
      )}]; recipe.keyCenter is not consumed by the renderer today`
    );
  }
  const keyCenter = members[0].sound.keyCenter;

  // R8 — bars (Intensity -> arrangement length), multiples of the placeholder's 4-bar phrase.
  const bars = intent.intensity < 34 ? 8 : intent.intensity <= 66 ? 12 : 16;

  // R7 — mix effects (Band vibe + intensity -> effect amounts).
  const reverbSend = round4(
    clamp01(VIBE_BASE_REVERB[intent.vibe] + (1 - intent.intensity / 100) * 0.15)
  );
  const masterGain = round4(0.95 + (intent.intensity / 100) * 0.25);

  const n = members.length;
  const spread = 0.35;
  const tracks = members.map((m, i) => {
    // R2 — mix prominence (gain): Swagger dominates ("the Artist's performance
    // style"); Fame and the Band's own Intensity dial nudge it. Every member
    // is always audible (floor 0.5) — see README for why nothing is silently
    // excluded from the mix.
    const prominence = clamp01(
      (0.6 * m.traits.swagger + 0.25 * m.traits.fame + 0.15 * intent.intensity) / 100
    );
    const gain = round4(0.5 + prominence * 0.5);

    // R3 — pan: even spread across the lineup in declaration order, plus a
    // small independently-seeded per-artist jitter.
    const basePan = n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1);
    const jitterRng = makeRng(subSeed(intent.seed, m.artistId, 'pan'));
    const pan = round4(clamp(-1, 1, basePan + (jitterRng() - 0.5) * 0.16));

    // R6 — pattern label: cosmetic/provenance only.
    const patternId = PATTERN_BY_RHYTHMIC_STYLE[m.traits.rhythmicStyle];

    log.push(
      `  track ${m.artistId}: swagger=${m.traits.swagger} fame=${m.traits.fame} energy=${m.traits.energy} ` +
        `-> gain=${gain}, pan=${pan}, pattern=${patternId} (rhythmicStyle=${m.traits.rhythmicStyle})`
    );

    return {
      performerArtistId: m.artistId,
      soundId: m.sound.id,
      sonicIdentityId: m.sound.sonicIdentityId,
      role: 'signature',
      patternId,
      gain,
      pan
    };
  });

  // R9 — sourceHashes, generated from the selected sounds, not hand-typed.
  const sourceHashes = Object.fromEntries(members.map((m) => [m.sound.id, m.sound.sourceHash]));

  // R10 — engineVersion: stamp from the resolver's own engine; warn (not
  // throw) on a mismatched intent, mirroring jam.mjs's existing recipe/render
  // version-mismatch precedent.
  if (intent.engineVersion !== ENGINE_VERSION) {
    log.push(`  warning: intent.engineVersion ${intent.engineVersion} != engine ${ENGINE_VERSION}`);
  }

  // R11 — sourceComponentId: never set in v1; nothing to select from yet
  // (no placeholder sound has a sourceBundle).

  const recipe = {
    bandId: intent.bandId,
    memberIds: intent.memberIds,
    seed: intent.seed,
    tempo: sharedBpm,
    keyCenter,
    bars,
    tracks,
    mix: { masterGain, reverbSend },
    engineVersion: ENGINE_VERSION,
    sourceHashes
  };

  return { recipe, log };
}
