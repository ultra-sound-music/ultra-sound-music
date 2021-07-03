// don't run unless recreating test metadata, dependencies not listed in root package.json just saving here
// in case we want to use this later

require('dotenv').config()
const fs = require('fs')
const csv = require('csv-parser');
const fleekStorage = require('@fleekhq/fleek-storage-js')

const artistResults = [];
const bandResults = [];
const trackResults = []


const artists = fs.createReadStream('../files/artists.csv')
             .pipe(csv())
             .on('data', (data) => artistResults.push(data))

const readArtists = new Promise(function(resolve, reject){
  artists.on('end', () => resolve("success"))
  artists.on('error', (e)=> reject(e))
})


const bands = fs.createReadStream('../files/bands.csv')
             .pipe(csv())
             .on('data', (data) => bandResults.push(data))

const readBands = new Promise(function(resolve, reject){
    bands.on('end', () => resolve("success"))
    bands.on('error', (e)=> reject(e))
})

const tracks = fs.createReadStream('../files/tracks.csv')
             .pipe(csv())
             .on('data', (data) => trackResults.push(data))

const readTracks = new Promise(function(resolve, reject){
    tracks.on('end', () => resolve("success"))
    tracks.on('error', (e)=> reject(e))
})



const uploadObj = async(obj) => {
  const key = `${Date.now()}`
 
  const {publicUrl: metadataUri} = await fleekStorage.upload({
  apiKey: process.env.FLEEK_API_KEY,
  apiSecret: process.env.FLEEK_API_SECRET,
  key,
  data: JSON.stringify(obj)
});

console.log(metadataUri)
console.log(obj.name)

}


const createArtists = async() => {
    await readArtists;
    const artists = await Promise.all(artistResults.map(async(row) => {
      return uploadObj(row)
    }))
}


const createBands = async() => {
  await readBands;
  const bands = await Promise.all(bandResults.map(async(row) => {
    return uploadObj(row)
  }))
}

const createTracks = async() => {
  await readTracks;
  const tracks = await Promise.all(trackResults.map(async(row) => {
    return uploadObj(row)
  }))
}


createTracks()