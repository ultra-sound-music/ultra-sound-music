// Placeholder drop-gallery + demo-Band content.
//
// These are the only 3 Jam Bots with real art/audio/traits today (the repo holds only 3 hero
// images, and only these 3 have placeholder signature audio + trait manifests — see
// apps/spikes/band-jam/manifests/). The full drop is specified as 10 (spec/jam-bots-drop.md);
// this gallery deliberately ships a 3-bot subset rather than fabricating art/audio for 7 bots
// nobody has authored yet. Swap in real assets / extend to 10 by editing this file only.

import heroJambot1 from '@usm/assets/img/hero_jambot1.png';
import heroJambot2 from '@usm/assets/img/hero_jambot2.png';
import heroJambot3 from '@usm/assets/img/hero_jambot3.png';
import violinAudio from '@usm/assets/audio/violin-signature.wav';
import mandolinAudio from '@usm/assets/audio/mandolin-signature.wav';
import bassoonAudio from '@usm/assets/audio/bassoon-signature.wav';
import demoBandAudio from '@usm/assets/audio/demo-band-neon-static.mp3';

export interface JamBotTraits {
  sanity: number;
  swagger: number;
  fame: number;
  energy: number;
  rhythm: number;
  melody: number;
}

export type JamBotTraitKey = keyof JamBotTraits;

export interface JamBotTraitDefinition {
  label: string;
  lowPole: string;
  highPole: string;
  descriptors: [string, string, string];
}

export interface JamBotTraitDisplay extends JamBotTraitDefinition {
  key: JamBotTraitKey;
  value: number;
  descriptor: string;
}

export const jamBotTraitOrder: JamBotTraitKey[] = [
  'sanity',
  'swagger',
  'fame',
  'energy',
  'rhythm',
  'melody'
];

export const jamBotTraitDefinitions: Record<JamBotTraitKey, JamBotTraitDefinition> = {
  sanity: {
    label: 'Sanity',
    lowPole: 'Controlled',
    highPole: 'Chaotic',
    descriptors: ['controlled', 'balanced', 'chaotic']
  },
  swagger: {
    label: 'Swagger',
    lowPole: 'Humble',
    highPole: 'Flamboyant',
    descriptors: ['humble', 'self-possessed', 'flamboyant']
  },
  fame: {
    label: 'Fame',
    lowPole: 'Cult',
    highPole: 'Superstar',
    descriptors: ['cult', 'breakout', 'superstar']
  },
  energy: {
    label: 'Energy',
    lowPole: 'Calm',
    highPole: 'Explosive',
    descriptors: ['calm', 'charged', 'explosive']
  },
  rhythm: {
    label: 'Rhythm',
    lowPole: 'Flowing',
    highPole: 'Groove-driven',
    descriptors: ['flowing', 'pulsed', 'groove-driven']
  },
  melody: {
    label: 'Melody',
    lowPole: 'Minimal',
    highPole: 'Lyrical',
    descriptors: ['minimal', 'motif-led', 'lyrical']
  }
};

export interface JamBot {
  id: string;
  name: string;
  performerCredit: string;
  instrument: string;
  image: string;
  auditionAudioUrl: string;
  traits: JamBotTraits;
}

function descriptorIndex(value: number) {
  if (value < 34) return 0;
  if (value > 66) return 2;
  return 1;
}

export function getTraitDescriptor(key: JamBotTraitKey, value: number) {
  return jamBotTraitDefinitions[key].descriptors[descriptorIndex(value)];
}

export function getJamBotTraitDisplays(traits: JamBotTraits): JamBotTraitDisplay[] {
  return jamBotTraitOrder.map((key) => {
    const definition = jamBotTraitDefinitions[key];
    const value = traits[key];

    return {
      key,
      value,
      ...definition,
      descriptor: getTraitDescriptor(key, value)
    };
  });
}

export function getJamBotStyleTags(traits: JamBotTraits) {
  return (['energy', 'rhythm', 'melody'] as JamBotTraitKey[]).map((key) => {
    const definition = jamBotTraitDefinitions[key];
    return `${getTraitDescriptor(key, traits[key])} ${definition.label.toLowerCase()}`;
  });
}

export function getJamBotBio(bot: JamBot, styleTags: string[] = getJamBotStyleTags(bot.traits)) {
  const { traits } = bot;
  const musicalProfile = styleTags.join(', ');
  const characterProfile = (['sanity', 'swagger', 'fame'] as JamBotTraitKey[])
    .map((key) => getTraitDescriptor(key, traits[key]))
    .join(', ');

  return `${bot.instrument} voice shaped by ${musicalProfile}; character reads ${characterProfile}.`;
}

export const jamBots: JamBot[] = [
  {
    id: 'jambot-placeholder-violin',
    name: 'Rosewire',
    performerCredit: 'Alisa Rose — violin',
    instrument: 'violin',
    image: heroJambot1,
    auditionAudioUrl: violinAudio,
    traits: {
      sanity: 65,
      swagger: 80,
      fame: 75,
      energy: 70,
      rhythm: 35,
      melody: 80
    }
  },
  {
    id: 'jambot-placeholder-mandolin',
    name: 'Tremolux',
    performerCredit: 'Tristan Scroggins — mandolin',
    instrument: 'mandolin',
    image: heroJambot2,
    auditionAudioUrl: mandolinAudio,
    traits: {
      sanity: 85,
      swagger: 60,
      fame: 45,
      energy: 80,
      rhythm: 85,
      melody: 60
    }
  },
  {
    id: 'jambot-placeholder-bassoon',
    name: 'Lowreed',
    performerCredit: 'Sebastian Chaves — bassoon',
    instrument: 'bassoon',
    image: heroJambot3,
    auditionAudioUrl: bassoonAudio,
    traits: {
      sanity: 35,
      swagger: 50,
      fame: 20,
      energy: 40,
      rhythm: 25,
      melody: 20
    }
  }
];

export interface DemoBand {
  id: string;
  name: string;
  blurb: string;
  memberIds: string[];
  jamAudioUrl: string;
}

export const demoBands: DemoBand[] = [
  {
    id: 'neon-static',
    name: 'Neon Static',
    blurb:
      'The official demo Band: Rosewire, Tremolux, and Lowreed jamming together — driving, neon, gritty. This is what forming a Band with friends sounds like.',
    memberIds: jamBots.map((bot) => bot.id),
    jamAudioUrl: demoBandAudio
  }
];

export function getJamBot(id: string): JamBot | undefined {
  return jamBots.find((bot) => bot.id === id);
}

export function getDemoBand(id: string): DemoBand | undefined {
  return demoBands.find((band) => band.id === id);
}
