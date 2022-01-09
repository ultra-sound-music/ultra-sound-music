import copy from './copy';
export { copy };

export const urls = Object.freeze({
  usmTwitter: 'https://twitter.com/usmproject',
  usmDiscord: 'https://discord.gg/5KB6GvjEk7',
  twitter: 'https://twitter.com'
});

export const team = Object.freeze([
  {
    name: 'Vijay Rudraraju',
    twitter: '@vijatsu',
    discord: '@vijay',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    name: 'Cameron Morris',
    twitter: '@0xGambas',
    discord: '@0xGambas',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    name: 'Andres Maldonado',
    twitter: '@andres_mald',
    discord: '@AGame',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },  
  {
    name: 'Gabriel Castillo',
    twitter: '@grend3lxc',
    discord: '@grend3lxc',
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
]);

export const faq = Object.freeze([
  {
    q: copy.lipsum_10w,
    a: copy.lipsum_50w
  },
  {
    q: copy.lipsum_10w,
    a: copy.lipsum_50w
  },
  {
    q: copy.lipsum_10w,
    a: copy.lipsum_50w
  },
  {
    q: copy.lipsum_10w,
    a: copy.lipsum_50w
  }  
])