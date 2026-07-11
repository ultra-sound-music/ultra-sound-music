// asset-ingest CLI: turns one recorded session (raw WAVs + a hand-written
// session.json, see schema/intake-session.ts) into a validated
// SoundManifestEntry + SonicIdentity.SourceSession, and upserts both into
// band-jam's manifests. See `apps/spikes/asset-ingest/README.md` and
// `.agents/plans/04-product-validation.md` (item 0) for the design.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, extname } from 'node:path';

import { validate, assertValid } from './validate-intake.mjs';
import { hashAndStat } from './audio-stats.mjs';
import { LocalStubUploader } from './uploader.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const BAND_JAM = resolve(ROOT, '..', 'band-jam');

function loadJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function argVal(flag, def) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : def;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function beatsPerBar(meter) {
  const n = parseInt(String(meter).split('/')[0], 10);
  if (!Number.isFinite(n) || n <= 0) fail(`cannot parse beats-per-bar from meter "${meter}"`);
  return n;
}

function defaultSoundId(sonicIdentityId) {
  return sonicIdentityId.replace(/^sonic-identity-/, '') + '-signature';
}

function upsertById(list, item, key = 'id') {
  const i = list.findIndex((x) => x[key] === item[key]);
  if (i >= 0) list[i] = item;
  else list.push(item);
}

function main() {
  const sessionArg = argVal('--session', null);
  if (!sessionArg) {
    fail(
      'usage: node src/ingest.mjs --session <path/to/session.json> [--dry-run] ' +
        '[--manifest-out <path>] [--identities-file <path>]'
    );
  }
  const dryRun = hasFlag('--dry-run');
  const manifestOutPath = resolve(
    argVal('--manifest-out', join(BAND_JAM, 'manifests', 'sound-manifest.json'))
  );
  const identitiesPath = resolve(
    argVal('--identities-file', join(BAND_JAM, 'manifests', 'sonic-identities.json'))
  );

  const sessionAbsPath = resolve(sessionArg);
  if (!existsSync(sessionAbsPath)) fail(`session file not found: ${sessionAbsPath}`);
  const sessionDir = dirname(sessionAbsPath);
  const session = loadJson(sessionAbsPath);

  const sessionSchema = loadJson(join(ROOT, 'schema', 'intake-session.schema.json'));
  assertValid(session, sessionSchema, 'session');

  if (!existsSync(identitiesPath)) {
    fail(
      `identities file not found: ${identitiesPath}\n` +
        'This tool ingests recordings for known Artists only — register the SonicIdentity first.'
    );
  }
  const identities = loadJson(identitiesPath);
  const identity = identities.identities.find((i) => i.sonicIdentityId === session.sonicIdentityId);
  if (!identity) {
    fail(
      `sonicIdentityId "${session.sonicIdentityId}" not found in ${identitiesPath} — ` +
        'this tool ingests recordings for known Artists only.'
    );
  }

  const soundId = session.id || defaultSoundId(session.sonicIdentityId);
  const uploader = new LocalStubUploader(join(ROOT, 'canonical-store'));

  function ingestFile(relFile) {
    const absPath = resolve(sessionDir, relFile);
    if (!existsSync(absPath)) fail(`referenced file not found: ${absPath}`);
    const buf = readFileSync(absPath);
    const stat = hashAndStat(absPath);
    const ext = extname(absPath).slice(1) || 'wav';
    const { canonicalUri, storedPath } = uploader.upload(buf, 'audio/wav', { extension: ext });
    // jam.mjs resolves playbackUri against its own project root (`assetBase: ROOT`
    // at the renderJam call site), not against wherever the manifest file lives
    // — mirror that convention here regardless of --manifest-out's target.
    const playbackUri = relative(BAND_JAM, storedPath);
    return { ...stat, canonicalUri, playbackUri };
  }

  // --- hero: locked to the session's shared bpm/tempoRange/keyCenter/meter ---
  const heroStat = ingestFile(session.hero.file);
  const heroBeats = session.hero.bars * beatsPerBar(session.meter);
  const loopStart = session.hero.loopPoints?.[0] ?? 0;
  const loopEnd = session.hero.loopPoints?.[1] ?? heroStat.numFrames;

  // --- excerpt: only the fields SourceBundle.auditionExcerpt needs ---
  const excerptStat = ingestFile(session.excerpt.file);

  // --- slices: may depart from the session-level tempo/key per-slice ---
  const sliceStats = session.slices.map((slice) => ingestFile(slice.file));
  const sliceEntries = session.slices.map((slice, index) => {
    const stat = sliceStats[index];
    const meter = slice.meter ?? session.meter;
    return {
      componentId: slice.componentId || `${session.sessionId}-slice-${index + 1}`,
      kind: slice.kind,
      bpm: slice.bpm ?? session.bpm,
      tempoRange: slice.tempoRange ?? session.tempoRange,
      meter,
      bars: slice.bars,
      keyCenter: slice.keyCenter ?? session.keyCenter,
      loopPoints: [0, stat.numFrames],
      durationSeconds: stat.durationSeconds,
      beats: slice.bars * beatsPerBar(meter),
      loudness: stat.loudness,
      peak: stat.peak,
      tags: slice.tags,
      sourceHash: stat.sourceHash,
      canonicalUri: stat.canonicalUri,
      playbackUri: stat.playbackUri
    };
  });

  const soundEntry = {
    id: soundId,
    sourceBot: identity.artistId,
    sonicIdentityId: session.sonicIdentityId,
    sourceProfileMatchStatus: 'match',
    role: 'signature',
    bpm: session.bpm,
    tempoRange: session.tempoRange,
    meter: session.meter,
    bars: session.hero.bars,
    keyCenter: session.keyCenter,
    loopPoints: [loopStart, loopEnd],
    durationSeconds: heroStat.durationSeconds,
    beats: heroBeats,
    loudness: heroStat.loudness,
    peak: heroStat.peak,
    tags: session.hero.tags,
    credit: session.credit,
    rights: session.rights,
    sourceHash: heroStat.sourceHash,
    canonicalUri: heroStat.canonicalUri,
    playbackUri: heroStat.playbackUri,
    sourceBundle: {
      auditionExcerpt: {
        durationSeconds: excerptStat.durationSeconds,
        sourceHash: excerptStat.sourceHash,
        canonicalUri: excerptStat.canonicalUri,
        playbackUri: excerptStat.playbackUri
      },
      components: sliceEntries
    }
  };

  const sourceSession = {
    sessionId: session.sessionId,
    ...(session.date ? { date: session.date } : {}),
    ...(session.location ? { location: session.location } : {}),
    ...(session.notes ? { notes: session.notes } : {}),
    sourceFileHashes: [
      heroStat.sourceHash,
      excerptStat.sourceHash,
      ...sliceEntries.map((s) => s.sourceHash)
    ]
  };

  // --- validate the assembled entry/session before touching anything on disk ---
  const manifestSchema = loadJson(join(BAND_JAM, 'schema', 'sound-manifest.schema.json'));
  assertValid(soundEntry, manifestSchema.properties.sounds.items, `sound "${soundId}"`);

  const identitySchema = loadJson(join(BAND_JAM, 'schema', 'sonic-identity.schema.json'));
  const sessionSchemaItem =
    identitySchema.properties.identities.items.properties.sourceSessions.items;
  assertValid(sourceSession, sessionSchemaItem, `sourceSession "${session.sessionId}"`);

  if (dryRun) {
    console.log('--dry-run: nothing written. Computed:');
    console.log(JSON.stringify({ soundEntry, sourceSession }, null, 2));
    return;
  }

  // --- build both mutated artifacts in memory first (load-existing, never
  // blind-overwrite either file) ---
  const manifest = existsSync(manifestOutPath)
    ? loadJson(manifestOutPath)
    : { drop: identities.drop, schemaVersion: '0.1.0', sounds: [] };
  upsertById(manifest.sounds, soundEntry, 'id');
  upsertById(identity.sourceSessions, sourceSession, 'sessionId');

  // --- validate both before writing either, so a failure here can never leave
  // the manifest and identities registry in an inconsistent half-written state ---
  assertValid(manifest, manifestSchema, 'manifest');
  assertValid(identities, identitySchema, 'identities');

  writeJson(manifestOutPath, manifest);
  writeJson(identitiesPath, identities);

  const stereoSliceCount = sliceStats.filter((s) => s.numChannels > 1).length;
  console.log(
    `  ingested "${soundId}" (session ${session.sessionId}; ` +
      `hero=${heroStat.numChannels}ch, excerpt=${excerptStat.numChannels}ch, ` +
      `${stereoSliceCount}/${sliceStats.length} slices stereo)`
  );
  console.log(`  wrote ${manifestOutPath}`);
  console.log(`  wrote ${identitiesPath}`);
}

main();
