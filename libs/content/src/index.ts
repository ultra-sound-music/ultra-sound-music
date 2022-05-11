import copy from './copy';
export { copy };

export const urls = Object.freeze({
  usmDocs: 'https://docs.ultrasoundmusic.xyz',
  usmBlog: 'https://mirror.xyz/ultrasoundmusic.eth',
  usmTwitter: 'https://twitter.com/usmproject',
  usmDiscord: 'https://discord.gg/5KB6GvjEk7',
  twitter: 'https://twitter.com'
});

export const routes = Object.freeze({
  home: '/',
  blog: '/blog'
});

export const team = Object.freeze([
  {
    name: 'Vijay Rudraraju',
    twitter: 'vijatsu',
    discord: 'vijay',
    blurb: 'Accomplished musician and engineer. Violinist.'
  },
  {
    name: 'Cameron Morris',
    twitter: '0xGambas',
    discord: '0xGambas',
    blurb:
      'Launched first NFT smart contract in 2018, 3x ETHGlobal hackathon winner, multichain enthusiast. Violinist.'
  },
  {
    name: 'Andres Maldonado',
    twitter: '0xChillDirector',
    discord: 'AGame',
    blurb:
      'A 90’s drummer turned designer, has designed and launched products for several Fortune 500 companies.'
  },
  {
    name: 'Gabriel Castillo',
    twitter: 'grend3lxc',
    discord: 'grend3lxc',
    blurb: 'Dreamer. Dev. Building in the music space since 2015.'
  }
]);

export const faq = Object.freeze([
  {
    q: 'What can I do with my Jam Bot?',
    a: 'Your Jam Bot is your entry point to the USM community and platform. Initially you can trade them, admire them, listen to their sounds and use them as your PFP. As the USM platform evolves you will be able to use your Jam Bot to collaborate with other virtual musicians and publish NFT music.'
  },
  {
    q: 'What are the future plans for USM? ',
    a: 'USM will continue to build out its platform and tools to enable the creation of composable music NFTs. The initial Jam Bot drop is just the beginning. In the future we will continue to drop more musicians, either via auction or bulk drops, and then start rolling out the ability to form a band with other musicians and publish NFT music. We envision a future ecosystem full of virtual musicians collaborating and publishing music.'
  },
  {
    q: 'How is USM Governed?',
    a: '100% of proceeds will go into the USM DAO which is to be managed by the founding members of USM. Over time, the founding team will work with the community to expand membership into the DAO.'
  },
  {
    q: 'How is USM Built?',
    a: `All USM NFT visual and musical traits are bespoke, made by USM team members and artists in the community. The NFTs are minted on the Solana blockchain.`
  }
]);
