const assert = require('power-assert');
const path = require('path');
const reader = require('../index.js');

const testPictDir = path.join(__dirname, 'test_image');

describe('b64img_promise test', () => {
  it('Pattern of arguments expected', (done) => {
    reader(testPictDir).then((result) => {
      assert(result !== undefined);
      assert(Array.isArray(result));
      assert(result.length === 2);
      assert(typeof result[0] === 'string');
      done();
    }).catch((err) => {
      done(err);
    });
  });
  it('Pattern of arguments expected B(select ext)', (done) => {
    reader(testPictDir, 'jpg').then((result) => {
      assert(result !== undefined);
      assert(Array.isArray(result));
      assert(result.length === 1);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  it('Pattern of arguments expected C(select wild)', (done) => {
    reader(testPictDir, '*').then((result) => {
      assert(result !== undefined);
      assert(Array.isArray(result));
      assert(result.length === 2);
      done();
    });
  });
  it('Pattern of not as expected argument', (done) => {
    reader('hogehoge').catch((err) => {
      assert(err.code === 'ENOENT');
      done();
    })
  });
});