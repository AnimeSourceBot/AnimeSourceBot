const { estimateImageFramesInfo } = require('../image-processing/image-frames-info');
const { createCommentText } = require('../formatting/comment');
const parseEpisode = require('../formatting/parse-episode');
const rp = require('request-promise');
const request = require('request');
const sharp = require('sharp');
const aggregateInfo = require('../infoers/aggregate-info');
const { getColorfulness } = require('../image-processing/colorfulness');
require('dotenv').config();
const api_token = process.env.TRACEMOE_TOKEN;

function requestTracemoe(reader) {
  return reader
    .jpeg()
    .toBuffer()
    .then(buffer => {
      if (buffer.length >= 1024 * 1024) {
        throw new Error('Image size exceeds 1MB');
      }
      return rp({
        method: 'POST',
        uri: `https://trace.moe/api/search?token=${api_token}`,
        formData: {
          image: `data:image/jpeg;base64,${buffer.toString('base64')}`,
        },
        json: true,
      });
    });
}

async function tryFindSource(uri, { minColorfulness, minOverhead }) {
  let reader =
    sharp()
      .resize(1024, 1024)
      .withoutEnlargement()
      .max();
  request
    .get(uri)
    .on('error', console.error)
    .pipe(reader);
  const colorfulness = await getColorfulness(reader);
  if (colorfulness < minColorfulness) {
    return null;
  }
  const imageInfo = await estimateImageFramesInfo(reader);
  if (imageInfo.frameCount > 1) {
    reader = reader
      .resize(imageInfo.width, imageInfo.frameHeight)
      .crop(sharp.gravity.north);
  }
  const result = await requestTracemoe(reader);
  if (result && result.docs && result.docs.length > 0) {
    const bestMatch = result.docs[0];
    let overhead = bestMatch.similarity;
    let fileNames = [bestMatch.filename];
    for (let i = 1; i < result.docs.length; ++i) {
      if (result.docs[i].mal_id !== bestMatch.mal_id) {
        overhead = bestMatch.similarity - result.docs[i].similarity;
        break;
      }
      fileNames.push(result.docs[i].filename);
    }
    if (overhead < minOverhead) {
      return null;
    }
    return {
      similarity: bestMatch.similarity,
      episode: parseEpisode(fileNames),
      anilistId: bestMatch.anilist_id,
      malId: bestMatch.mal_id,
      titleNative: bestMatch.title_native,
      titleEnglish: bestMatch.title_english,
      nsfw: bestMatch.is_adult,
      timestampInSeconds: bestMatch.at,
      isMovie: bestMatch.season === 'Movie',
      imageInfo,
    };
  } else {
    return null;
  }
}

async function tryFindGoodSource(url, { minSimilarity, maxAspectRatioError, minColorfulness, minOverhead }) {
  const match = /:\/\/imgur\.com\/(\w+)$/.exec(url);
  if (match) {
    url = `https://i.imgur.com/${match[1]}.jpg`;
  }
  url = url.replace(/\.gifv$/, '.gif');
  const source = await tryFindSource(url, { minColorfulness, minOverhead });
  if (source && source.similarity > minSimilarity && source.imageInfo.frameCountErrorPercent < maxAspectRatioError) {
    const info = await aggregateInfo(source.anilistId);
    if (info) {
      return {
        source: source,
        commentText: createCommentText(source, info),
      };
    }
  }
  return null;
}

module.exports = { tryFindGoodSource };
