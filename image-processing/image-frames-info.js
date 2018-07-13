const mime = require('mime');

function estimateImageFramesInfo(reader) {
  const idealAspectRatios = [16 / 9, 4 / 3];
  return reader.metadata().then(metadata => {
    let bestFrameCountInfo = null;
    idealAspectRatios.forEach(idealAspectRatio => {
      const realAspectRatio = metadata.width / metadata.height;
      const realFrameCount = idealAspectRatio / realAspectRatio;
      const idealFrameCount = Math.max(1, Math.round(realFrameCount));
      const frameCountErrorPercent = Math.abs((realFrameCount - idealFrameCount) / idealFrameCount);
      const frameCountInfo = {
        frameCount: idealFrameCount,
        frameCountErrorPercent,
        realAspectRatio,
        idealAspectRatio,
        width: metadata.width,
        height: metadata.height,
        frameHeight: Math.round(metadata.height / idealFrameCount),
        mimeType: mime.getType(metadata.format),
      };
      if (!bestFrameCountInfo || bestFrameCountInfo.frameCountErrorPercent > frameCountInfo.frameCountErrorPercent) {
        bestFrameCountInfo = frameCountInfo;
      }
    });
    return bestFrameCountInfo;
  });
}

module.exports = { estimateImageFramesInfo };