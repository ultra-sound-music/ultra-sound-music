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
  spark: number;
  swagger: number;
  fame: number;
  melodicStyle: string;
  rhythmicStyle: string;
  energy: number;
}

export interface JamBot {
  id: string;
  name: string;
  performerCredit: string;
  instrument: string;
  bio: string;
  image: string;
  auditionAudioUrl: string;
  traits: JamBotTraits;
}

export const jamBots: JamBot[] = [
  {
    id: 'jambot-placeholder-violin',
    name: 'Rosewire',
    performerCredit: 'Alisa Rose — violin',
    instrument: 'violin',
    bio: 'Lead melodic voice with vibrato and a little edge — the neon top line of the band. Reads as the hook, not background texture.',
    image: heroJambot1,
    auditionAudioUrl: violinAudio,
    traits: {
      spark: 65,
      swagger: 80,
      fame: 75,
      melodicStyle: 'lyrical',
      rhythmicStyle: 'flowing',
      energy: 70
    }
  },
  {
    id: 'jambot-placeholder-mandolin',
    name: 'Tremolux',
    performerCredit: 'Tristan Scroggins — mandolin',
    instrument: 'mandolin',
    bio: 'Rhythmic pulse and arpeggiated texture — tremolo and pluck detail that gives the groove its motion and surprise.',
    image: heroJambot2,
    auditionAudioUrl: mandolinAudio,
    traits: {
      spark: 85,
      swagger: 60,
      fame: 45,
      melodicStyle: 'arpeggiated',
      rhythmicStyle: 'syncopated',
      energy: 80
    }
  },
  {
    id: 'jambot-placeholder-bassoon',
    name: 'Lowreed',
    performerCredit: 'Sebastian Chaves — bassoon',
    instrument: 'bassoon',
    bio: 'Low, sustained, driving root/drone bed — the gritty engine-room low end that holds the whole band down.',
    image: heroJambot3,
    auditionAudioUrl: bassoonAudio,
    traits: {
      spark: 35,
      swagger: 50,
      fame: 20,
      melodicStyle: 'droning',
      rhythmicStyle: 'sustained',
      energy: 40
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
