const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const { tryFindGoodSource } = require('./sourcers/tracemoe');
require('dotenv').config();

const streamOptions = {
  subreddit: process.env.SUBREDDITS,
  results: 10,
  pollTime: 10000,
};

const sourcerOptions = {
  minSimilarity: 0.91,       // Minimum similarity between sourced image and source image
  maxAspectRatioError: 0.15, // Maximum error% between multiples of ideal (16:9 or 4:3) and true aspect ratio
  minColorfulness: 0.05,     // Minimum % of saturated pixels
  minOverhead: 0.01          // Minimum separation for (similarity of best source - similarity of second best source)
};

const snoowrap = new Snoowrap({
  userAgent: 'snoowrap:AnimeSourceBot:v1.0.0 (by /u/AnimeSourceBot)',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS,
});

const snoostorm = new Snoostorm(snoowrap);
const commentStream = snoostorm.CommentStream(streamOptions);
const submissionStream = snoostorm.SubmissionStream(streamOptions);

const max_replies_to_track = 128;
let replies = [];

function containsSource(body) {
  return body.match(/({.+}|<.+>)/);
}

async function deleteMyCommentIfSourcePosted(comment) {
  await timeout(10000); // Hack: wait to make make sure comment has replyId assigned
  if (containsSource(comment.body)) {
    for (const reply of replies) {
      if (reply.parentId === comment.parent_id && !reply.isDeleted) {
        console.log(`[DELETING] reddit.com${comment.permalink}`);
        const myComment = snoowrap.getComment(reply.replyId);
        myComment.replies.fetchAll().then(myReplies => {
          if (myReplies.length === 0) {
            reply.isDeleted = true;
            console.log(`[DELETE] reddit.com${comment.permalink}`);
            return myComment.delete();
          } else {
            console.log(`[NO DELETE] because of reply${comment.permalink}`);
          }
        });
      }
    }
  }
}

commentStream.on('comment', comment => {
  deleteMyCommentIfSourcePosted(comment)
    .catch(e => console.log(e));
});

const timeout = ms => new Promise(res => setTimeout(res, ms));

async function tryPostSource(source, parent) {
  parent = await parent.refresh();
  for (let i = 0; i < parent.comments.length; ++i) {
    const commentBody = await parent.comments[i].body;
    if (containsSource(commentBody) || parent.comments[i].author.name === process.env.REDDIT_USER) {
      console.log('[ALREADY SOURCED]');
      return;
    }
  }
  return parent
    .reply(source.commentText)
    .then(reply => {
      replies.push({ parentId: reply.parent_id, replyId: reply.id });
      if(replies.length > max_replies_to_track) {
        replies.shift();
      }
      console.log(`[REPLY] reddit.com${parent.permalink}`);
    });
}

submissionStream.on('submission', submission => {
  if (!submission.is_self && submission.url) {
    console.log('--------------------------------------------------');
    const link = `reddit.com${submission.permalink}`;
    console.log(link);
    tryFindGoodSource(submission.url, sourcerOptions)
      .then(source => {
        if (source) {
          return tryPostSource(source, submission);
        } else {
          console.log('no good match found');
        }
      })
      .catch(e => console.log(e));
  }
});
