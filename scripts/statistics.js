const Snoowrap = require('snoowrap');
require('dotenv').config();

const fetchCount = 100;  // how many comments to fetch per one request
const fetchDelay = 1000; // make sure to not exceed reddit's ratelimit
const maxCommentsToFetch = 1000; // fetch this many most recent comments

const snoowrap = new Snoowrap({
  userAgent: 'snoowrap:AnimeSourceBot:v1.0.0 (by /u/AnimeSourceBot)',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS,
});

let statistics = {
  nCorrect: 0,
  nIncorrect: 0,
  nContested: 0,
  nUnlabeled: 0,
  nNoReplies: 0,
};

async function fetchAllComments(comments) {
  console.log(`Fetched ${comments.length} comments...`);
  let prevLength;
  do {
    prevLength = comments.length;
    await new Promise(resolve => setTimeout(resolve, fetchDelay));
    comments = await comments.fetchMore({
      amount: Math.min(fetchCount, maxCommentsToFetch - prevLength),
      skipReplies: false,
      append: true,
    });
    console.log(`Fetched ${comments.length} comments...`);
  } while(comments.length > prevLength);
  return comments;
}

async function updateStatistics(comment) {
  // For some reason comment.replies.fetchAll returns [] for comments retrieved with comments.fetchMore
  // the line below is a hacky workaround for the problem
  await new Promise(resolve => setTimeout(resolve, fetchDelay));
  comment = await snoowrap.getComment(comment.id);
  await new Promise(resolve => setTimeout(resolve, fetchDelay));
  const replies = await comment.replies.fetchAll();
  let hasCorrect = false;
  let hasIncorrect = false;
  replies.forEach(reply => {
    const body = reply.body.toLowerCase();
    if(body.indexOf('!correct') > -1) {
      hasCorrect = true;
    }
    if(body.indexOf('!incorrect') > -1) {
      hasIncorrect = true;
    }
  });
  if (replies.length === 0) {
    ++statistics.nNoReplies;
  } if(!hasCorrect && !hasIncorrect) {
    ++statistics.nUnlabeled;
  } else if(hasCorrect && !hasIncorrect) {
    ++statistics.nCorrect;
  } else if(hasIncorrect && !hasCorrect) {
    ++statistics.nIncorrect;
  } else {
    ++statistics.nContested;
  }
  console.log(statistics);
}

snoowrap
  .getUser(process.env.REDDIT_USER)
  .getComments({amount: fetchCount})
  .then(fetchAllComments)
  .then(async comments => {
    for(let i = 0; i < comments.length; ++i) {
      await updateStatistics(comments[i]);
    }
  })
  .then(() => console.log(statistics))
  .catch(console.error);