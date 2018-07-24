const { secondsToHHMMSS, timestamp } = require('./time');

function formatStr(format) {
  const dict = {
    'TV': 'TV',
    'TV_SHORT': 'TV Short',
    'MOVIE': 'Movie',
    'SPECIAL': 'Special',
    'OVA': 'OVA',
    'ONA': 'ONA',
    'MUSIC': 'Music',
    'MANGA': 'Manga',
    'NOVEL': 'Novel',
    'ONE_SHOT': 'One-shot',
  };
  const text = dict[format];
  if (text) {
    return `Format: ${text}`;
  } else {
    return null;
  }
}

function statusStr(status) {
  const dict = {
    'FINISHED': 'Finished',
    'RELEASING': 'Releasing',
    'NOT_YET_RELEASED': 'Not yet released',
    'CANCELLED': 'Cancelled',
  };
  const text = dict[status];
  if (text) {
    return `Status: ${text}`;
  } else {
    return null;
  }
}

function episodeStr(isMovie, episode, episodes) {
  if (!isMovie) {
    if (episode && (!episodes || episode > episodes)) {
      return `Episode: ${episode}/??`;
    }
    if (!episode) {
      return `Episode: ?/${episodes}`;
    }
    return `Episode: ${episode}/${episodes}`;
  }
  return null;
}

function sceneStr(timestampInSeconds, durationInMinutes) {
  if (!timestampInSeconds) {
    return null;
  }
  if(!durationInMinutes) {
    return `Scene: ${secondsToHHMMSS(timestampInSeconds)}`;
  } else {
    return `Scene: ${timestamp(timestampInSeconds, durationInMinutes * 60)}`;
  }
}

function genreStr(genres) {
  if(genres && genres.length > 0) {
    return `Genres: ${genres.join(', ')}`;
  }
  return null;
}

function similarityStr(match) {
  if (!match) throw `match missing`;
  return `Similarity: ${Math.round(100 * match)}%`
}

module.exports = { formatStr, statusStr, episodeStr, sceneStr, genreStr, similarityStr };