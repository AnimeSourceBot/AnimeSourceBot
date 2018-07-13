const rp = require('request-promise');

const queryUrl = 'https://graphql.anilist.co';

function getQueryBodyForId(id) {
  return {
    query: (`
      query ($id: Int!) { 
        Page { 
          media(id: $id) { 
            id 
            idMal 
            title { 
              romaji english native 
            } 
            type 
            status 
            format 
            episodes 
            chapters 
            duration 
            season 
            source 
            genres 
          } 
        }
      }`
    ),
    variables: { 'id': id },
  };
}

async function queryAnilistById(id) {
  const response = await rp.post({
    uri: queryUrl,
    body: getQueryBodyForId(id),
    json: true,
  });
  return response.data.Page.media[0];
}

module.exports = { queryAnilistById };
