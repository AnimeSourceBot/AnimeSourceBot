const rp = require('request-promise');

async function queryKitsuByText(text) {
  if(!text) throw "Expected text";
  const uri = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURI(text)}`;
  return rp.get(uri)
    .then(JSON.parse)
    .then(response => response.data[0]);
}

module.exports = { queryKitsuByText };
