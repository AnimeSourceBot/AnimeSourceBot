/* eslint-disable no-unused-expressions */
const { getColorfulness } = require('./colorfulness');
const sharp = require('sharp');
const request = require('request');
const { expect } = require('chai');

describe('## detect-grayscale', () => {
  describe('# Anime is detected as colored', () => {
    it('should detect Gabriel Dropout as colorful', (done) => {
      let reader = sharp();
      request.get('https://i.imgur.com/NemuozL.jpg').pipe(reader);
      getColorfulness(reader)
        .then(colorfulness => {
          expect(colorfulness).to.be.above(0.50);
          expect(colorfulness).to.be.lessThan(1.00);
          done();
        })
        .catch(done);
    });
  });
  describe('# Manga is detected as black and white', () => {
    it('should detect manga as not colorful', (done) => {
      let reader = sharp();
      request.get('https://i.redd.it/jkxf366ts6511.jpg').pipe(reader);
      getColorfulness(reader)
        .then(colorfulness => {
          expect(colorfulness).to.be.gte(0.00);
          expect(colorfulness).to.be.lt(0.01);
          done();
        })
        .catch(done);
    });
    it('should detect single-channel jpeg as not colorful', (done) => {
      let reader = sharp();
      request.get('https://i.imgur.com/bpmaEiW.jpg').pipe(reader);
      getColorfulness(reader)
        .then(colorfulness => {
          expect(colorfulness).to.be.gte(0.00);
          expect(colorfulness).to.be.lt(0.01);
          done();
        })
        .catch(done);
    });
  });
});
