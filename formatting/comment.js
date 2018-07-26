const { superscript, escape } = require('./reddit');
const { episodeStr, formatStr, genreStr, sceneStr, similarityStr, statusStr } = require('./tidbits');

function createCommentText(source, info) {
  const tidbits = [
    episodeStr(source.isMovie, source.episode, info.anilistInfo.episodes),
    sceneStr(source.timestampInSeconds, info.anilistInfo.duration),
    similarityStr(source.similarity),
    formatStr(info.anilistInfo.format),
    statusStr(info.anilistInfo.status),
    genreStr(info.anilistInfo.genres),
  ];
  const tidbitStr = tidbits.filter(x => x).map(escape).join(' | ');
  return (
    `**${escape(info.anilistInfo.title.romaji || source.titleEnglish)}** - ([AL](${escape(info.anilistUrl)}), [KIT](${escape(info.kitsuUrl)}), [MAL](${escape(info.malUrl)}))

${superscript(tidbitStr)}

---
${superscript('*Dislike bots?* You can post the source yourself to make me go away. *Friend of bots?* Include the word !correct or !incorrect in your reply to train me. [Info](https://www.reddit.com/r/AnimeSourceBot/wiki/index)', 3)}`
  );
}

module.exports = { createCommentText };