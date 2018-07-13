const { queryAnilistById } = require('./anilist');
const { expect } = require('chai');

describe('## query anilist', () => {
  describe('# Anime info is found by id', () => {
    it('should find Steins;Gate 0 by id', (done) => {
      queryAnilistById(21127)
        .then(info => {
          // noinspection BadExpressionStatementJS
          expect(info).to.be.ok;
          expect(info.id).to.equal(21127);
          expect(info.idMal).to.equal(30484);
          expect(info.title.romaji).to.equal('Steins;Gate 0');
          expect(info.duration).to.equal(24);
          done();
        })
        .catch(done);
    });
  });
});
