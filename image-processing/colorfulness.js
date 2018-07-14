const sharp = require('sharp');
const request = require('request');
const convert = require('color-convert');

async function getColorfulness(reader) {
  if(typeof reader === 'string') {
    reader = sharp();
    request.get(reader).pipe(reader);
  }
  const metadata = await reader.metadata();
  if(metadata.channels === 1) {
    return 0; // Greyscale image
  }
  const buffer = await reader.raw().toBuffer();
  let pixelCount = 0;
  let colorfulPixelCount = 0;
  for(let i = 0; i < buffer.length; i += metadata.channels) {
    const r = buffer[i];
    const g = buffer[i + 1];
    const b = buffer[i + 2];
    // saturation and value range from 0 to 100
    const [hue, saturation, value] = convert.rgb.hsv(r, g, b);
    pixelCount += 1;
    if(value > 20 && saturation > 20) {
      colorfulPixelCount += 1;
    }
  }
  return colorfulPixelCount / pixelCount;
}

module.exports = { getColorfulness };