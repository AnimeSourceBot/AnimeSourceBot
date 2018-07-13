const anilist = require('./anilist');
const kitsu = require('./kitsu');

async function aggregateInfo(anilistId) {
  const anilistInfo = await anilist.queryAnilistById(anilistId);
  const kitsuInfo = await kitsu.queryKitsuByText(anilistInfo.title.native);
  return {
    anilistInfo,
    kitsuInfo,
    anilistUrl: `https://anilist.co/anime/${anilistId}`,
    kitsuUrl: `https://kitsu.io/anime/${kitsuInfo.attributes.slug}`,
    malUrl: `https://myanimelist.net/anime/${anilistInfo.idMal}`
  };
}

module.exports = aggregateInfo;