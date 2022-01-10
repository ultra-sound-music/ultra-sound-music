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
})

export const team = Object.freeze([
  {
    name: 'Vijay Rudraraju',
    twitter: 'vijatsu',
    discord: 'vijay',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    name: 'Cameron Morris',
    twitter: '0xGambas',
    discord: '0xGambas',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    name: 'Andres Maldonado',
    twitter: 'andres_mald',
    discord: 'AGame',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },  
  {
    name: 'Gabriel Castillo',
    twitter: 'grend3lxc',
    discord: 'grend3lxc',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
]);

export const faq = Object.freeze([
  {
    q: 'What is USM?',
    a: 'USM is a unique, collaborative platform for publishing fully generative music on the blockchain, and more.'
  },
  {
    q: 'Why USM?',
    a: 'I mean, who doesn’t want to be a virtual rockstar?'
  },
  {
    q: `What's up with the name?`,
    a: 'Ultra Sound Music is a play on the Ethereum Ultra Sound Money meme. If money can be ultra sound by providing the utmost in individual expression and freedom, then surely, music can do the same.'
  },  
  {
    q: `What's the Roadmap?`,
    a: `We're currently working on launching unique NFT characters with generative visual and sound traits.  These characters will be the cornerstone on the USM platform.  Everything else is TBD.`
  }
])