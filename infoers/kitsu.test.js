const { queryKitsuByText } = require('./kitsu');
const { expect } = require('chai');

describe('## query kutsu', () => {
  describe('# Anime info is found by text', () => {
    it('should find Yuru Camp△ link by title', (done) => {
      queryKitsuByText('Yuru Camp△')
        .then(info => {
          // noinspection BadExpressionStatementJS
          expect(info).to.be.ok;
          expect(info.links.self).to.equal('https://kitsu.io/api/edge/anime/13480');
          done();
        })
        .catch(done);
    });
  });
});
