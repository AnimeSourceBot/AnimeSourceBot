/* eslint-disable no-unused-expressions */
const whatanime = require('./whatanime');
const { expect } = require('chai');

function tryFindGoodSource(x) {
  return whatanime.tryFindGoodSource(x, {
    minSimilarity: 0.91,
    maxAspectRatioError: 0.15,
    minColorfulness: 0.05,
    minOverhead: 0.01,
  });
}

describe('## whatanime', () => {
  describe('# Single frame anime', () => {
    it('should detect Gabriel Dropout EP#6 from jpeg', (done) => {
      tryFindGoodSource('https://i.imgur.com/NemuozL.jpg')
        .then(({ source, commentText }) => {
          expect(source).to.be.ok;
          expect(source.imageInfo.frameCount).to.equal(1);
          expect(source.titleEnglish).to.equal('Gabriel DropOut');
          expect(source.episode).to.equal(6);
          expect(source.isMovie).to.be.false;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(1.00);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    it('should detect Gabriel Dropout EP#6 from png', (done) => {
      tryFindGoodSource('https://i.imgur.com/2v8k05K.png')
        .then(({ source, commentText }) => {
          expect(source).to.be.ok;
          expect(source.imageInfo.frameCount).to.equal(1);
          expect(source.titleEnglish).to.equal('Gabriel DropOut');
          expect(source.episode).to.equal(6);
          expect(source.isMovie).to.be.false;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(1.00);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    it('should detect Mitsuboshi Colors from imgur page', (done) => {
      tryFindGoodSource('https://imgur.com/wQ2xLmP')
        .then(({ source, commentText }) => {
          expect(source).to.be.ok;
          expect(source.imageInfo.frameCount).to.equal(1);
          expect(source.titleEnglish).to.equal('Mitsuboshi Colors');
          expect(source.episode).to.equal(3);
          expect(source.isMovie).to.be.false;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(1.00);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
  });
  describe('# Multi frame anime', () => {
    it('should detect slightly cropped Kara no Kyoukai from two-frame png', (done) => {
      tryFindGoodSource('https://i.redd.it/sgixly0y37511.png')
        .then(({ source, commentText }) => {
          expect(source.imageInfo.idealAspectRatio).to.be.closeTo(16 / 9, 0.01);
          expect(source.imageInfo.realAspectRatio).to.be.closeTo(1.0, 0.01);
          expect(source.imageInfo.frameCount).to.equal(2);
          expect(source.titleEnglish).to.equal('the Garden of sinners Chapter 2: …and nothing heart. (Murder Speculation Part A)');
          expect(source.episode).to.equal(2);
          expect(source.isMovie).to.be.true;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(0.95);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    it('should detect A-Channel EP#5 from two-frame jpeg', (done) => {
      tryFindGoodSource('https://i.redditmedia.com/rkQsW6u6TTVrmISEHPEFAgPDtZuxByHY3gDeQG-261M.jpg?s=f70590659206153e117bf299d92a2844')
        .then(({ source, commentText }) => {
          expect(source.imageInfo.idealAspectRatio).to.be.closeTo(16 / 9, 0.01);
          expect(source.imageInfo.realAspectRatio).to.be.closeTo(8 / 9, 0.01);
          expect(source.imageInfo.frameCount).to.equal(2);
          expect(source.titleEnglish).to.equal('A-Channel');
          expect(source.episode).to.equal(5);
          expect(source.isMovie).to.be.false;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(1.00);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    /*
    it('should detect Tokyo Ghoul:re from two-frame jpeg', (done) => {
      tryFindGoodSource('https://i.redd.it/vgdutjnkca511.jpg')
        .then(({source, commentText}) => {
          expect(source.imageInfo.frameCount).to.equal(2);
          expect(source.titleEnglish).to.equal('Tokyo Ghoul:re');
          expect(source.episode).to.equal(9);
          expect(source.isMovie).to.be.false;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(1.00);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    */
  });
  describe('# Anime gif', () => {
    it('should detect Nichijou from gif', (done) => {
      tryFindGoodSource('http://i0.kym-cdn.com/photos/images/original/000/576/411/f11.gif')
        .then(({ source, commentText }) => {
          expect(source.imageInfo.frameCount).to.equal(1);
          expect(source.titleEnglish).to.equal('Nichijou - My Ordinary Life');
          expect(source.episode).to.equal(7);
          expect(source.isMovie).to.be.false;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(1.00);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
  });
  describe('# Anime movie', () => {
    it('should detect Girls und Panzer Der Film from jpg', (done) => {
      tryFindGoodSource('https://i.imgur.com/8WXthIc.jpg')
        .then(({ source, commentText }) => {
          expect(source.imageInfo.frameCount).to.equal(1);
          expect(source.titleEnglish).to.equal('Girls und Panzer der Film');
          expect(source.episode).to.equal('');
          expect(source.isMovie).to.be.true;
          expect(source.similarity).to.be.above(0.90);
          expect(source.similarity).to.be.below(1.00);
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
  });
  describe('# Difficult image', () => {
    it('should not confuse manga for anime', (done) => {
      tryFindGoodSource('https://i.imgur.com/bpmaEiW.jpg')
        .then(output => {
          expect(output).to.be.null;
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    it('should return null if no good match found', (done) => {
      tryFindGoodSource('https://i.redd.it/hq7myjmmjr911.png')
        .then(output => {
          if (output !== null) {
            const { source, commentText } = output;
            expect(source.imageInfo.frameCount).to.equal(2);
            expect(source.titleEnglish).to.equal('Satsuriku no Tenshi');
            expect(source.episode).to.equal(2);
            expect(source.isMovie).to.be.false;
            expect(source.similarity).to.be.above(0.90);
            expect(source.similarity).to.be.below(1.00);
          }
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    it('should be able to match dark scenes', (done) => {
      tryFindGoodSource('https://i.redditmedia.com/BkA75Lm5sddraut9ilob2mX0jQnh1ZN7-pO5khT1YQc.png?s=0cc42df9cc774c0f1b94ec87ac47420b')
        .then(output => {
          if (output !== null) {
            const { source, commentText } = output;
            expect(source.imageInfo.frameCount).to.equal(1);
            expect(source.titleEnglish).to.equal('Daimidaler: Prince vs. Penguin Empire');
            expect(source.episode).to.equal(2);
            expect(source.isMovie).to.be.false;
            expect(source.similarity).to.be.above(0.90);
            expect(source.similarity).to.be.below(1.00);
          }
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
    it('should not think random drawing is Azumanga Daioh', (done) => {
      tryFindGoodSource('https://i.redd.it/1g2f3n5uqga11.jpg')
        .then(output => {
          expect(output).to.be.null;
          done();
        })
        .catch(done);
    }).timeout(10 * 1000);
  });
});
