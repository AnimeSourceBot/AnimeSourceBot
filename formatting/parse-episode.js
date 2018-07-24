const regexes = [
  /第(\d+)/,
  /\[(\d+)\]/,
  /#(\d+)/,
  /\b(OVA)\b/i,
  / (\d+) \b/,
  /\[(\d+)_(\d+)\]/,
  /\[(\d+)\((\d+)\)\]/,
  /\b(\d+)\b/,
];

function parseEpisodeFromFilename(str) {
  if(!str) return null;
  for (const regex of regexes) {
    const matches = str.match(regex);
    if (matches) {
      let ans = matches[1];
      for(let i = 2; i < matches.length; ++i) {
        // Some series may have two episode numbers, season and series.
        // We'll use the season number which would be the smallest one.
        ans = Math.min(ans, matches[i]);
      }
      const int = parseInt(ans);
      if (!isNaN(int)) return int;
      return ans;
    }
  }
  return null;
}

function parseEpisodeFromFilenames(fileNames) {
  const votes = new Map();
  for(const fileName of fileNames) {
    const episode = parseEpisodeFromFilename(fileName);
    const prev = votes.get(episode);
    if (prev) {
      votes.set(episode, prev + 1);
    } else {
      votes.set(episode, 1);
    }
  }
  votes.set(null, 0);
  let best = null;
  for(const [key, nVotes] of votes) {
    if(nVotes > votes.get(best)) {
      best = key;
    }
  }
  return best;
}

function parseEpisode(fileNameOrNames) {
  if (typeof fileNameOrNames === 'string') {
    return parseEpisodeFromFilename(fileNameOrNames);
  } else {
    return parseEpisodeFromFilenames(fileNameOrNames);
  }
}

module.exports = parseEpisode;