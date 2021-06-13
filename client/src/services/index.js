import axios from 'axios';

const webserverDomain = `//${document.location.host}`;
const apiDomain = webserverDomain.replace('9000', '9001');

export async function createMetaDataUri({
  name,
  description,
  artistDNA
}) {
  return axios.post(`${apiDomain}/create_metadata_uri`, {
    name,
    description,
    artistDNA
  }, {
    headers: {"Access-Control-Allow-Origin": "*"}
  });
}


export async function getAllTokens() {
  return axios.get(`${apiDomain}/cache/tokens/all`, {
    headers: {"Access-Control-Allow-Origin": "*"}
  });
}
