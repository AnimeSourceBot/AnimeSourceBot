/* eslint-disable no-unused-expressions */
const parseEpisode = require('./parse-episode');
const { expect } = require('chai');

function test(str, num) {
  it(`should recognize episode=${num} from ${str}`, (done) => {
    expect(parseEpisode(str)).to.equal(num);
    done();
  });
}

describe('## Parse episode number', () => {
  test('第6集 风云突变 1080P.mp4', 6);
  test('[TxxZ][Natsume_Yuujinchou_Go][09][720P](24047115).mp4', 9);
  test('[KTXP][Akame ga Kill!][03][BIG5][720P].mp4', 3);
  test('[Ohys-Raws] Ao no Exorcist Kyoto Fujouou Hen - 10 (TBS 1280x720 x264 AAC).mp4', 10);
  test('二學期 #23.mp4', 23);
  test('[NEKOPARA OVA][Steam][GB][1080p].mp4', 'OVA');
  test('[Xrip][Nekopara][BDrip][OVA][BIG5][720P][AVC].mp4', 'OVA');
  test('[FreeSub] THE IDOLM@STER CINDERELLA GIRLS - 22 (AVC-720P AAC)[BIG5].mp4', 22);
  test('City Hunter - 070.mp4', 70);
  test('[牙狼＜GARO＞～炎の刻印～][19][黒翼-TEMPEST-][X264_AAC].mp4', 19);
  test('Time Bokan 24 - 01 GB (Todou 1280x720 x264 AAC).mp4', 1);
  test('[Ohys-Raws] Black Clover - 39 (TX 1280x720 x264 AAC).mp4', 39);
  test('[FZSD][Pripara][048][BIG5][720P][x264_AAC].mp4', 48);
  test('[異域字幕組][Gintama S3][銀魂 第三季][03_268][1280x720][繁体].mp4', 3);
  test('[SOSG&52wy][Naruto_Shippuuden][517(297)][BIG5][x264_AAC][1280x720].mp4', 297);
  test('[XFSUB][Naruto Shippuuden][517_297][BIG5][x264 1280x720 AAC].mp4', 297);
  test('[SOSG&52wy][Naruto_Shippuuden][275(55)][BIG5][x264_AAC][1280x720].mp4', 55);
  test('[KNA][GIRLS_und_PANZER_der_FILM][BDRIP][1280x720][BIG5][Better_Volume].mp4', null);
  test([
    '【4月】我的英雄学院 52 - 1.52(Av26825293,P1).mp4',
    '[PCSUB][Boku_No_Hero_AcademiaS3][14][BIG5_JP][1080P][MP4_AAC].mp4',
    '第14集 编织必杀技吧 1080P.mp4'
  ], 14);

  // this episode name is kind of strange:
  // test('[dmhy][Active Raid - Kidou Kyoushuushitsu Dai Hakkei][01v3][x264_aac][BIG5][720P_mp4].mp4', 1);
});
