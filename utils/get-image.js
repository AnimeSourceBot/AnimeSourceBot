const btoa = require('btoa');
const fetch = require('node-fetch');

const options = {
  method: 'GET',
  cache: 'default'
};

module.exports = function getImage(uri) {
  return fetch(uri, options)
    .then(response => response.arrayBuffer())
    .then(buffer => {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    });
};
