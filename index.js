const fs = require('fs');
const path = require('path');

const ALL_EXT = '[ALL]';
const WILD = '*';

const getFileNames = (tgtDirPath) => {
  const promise = new Promise((resolve, reject) => {
    fs.readdir(tgtDirPath, (err, data) => {
      if (err) { reject(err); }
      else { resolve(data); }
    });
  });
  return promise;
}

const checkStat = (tgtFilePath) => {
  const promise = new Promise((resolve, reject) => {
    fs.stat(tgtFilePath, (err, stats) => {
      if (err) { reject(err); }
      else { resolve([tgtFilePath, stats.isFile()]); }
    })
  });
  return promise;
};

const getFileExt = (tgtFilePath) => {
  return tgtFilePath.substring(tgtFilePath.lastIndexOf('.') + 1);
};

const getBase64 = (tgtFilePath) => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(tgtFilePath, (err, data) => {
      if (err) { reject(err); }
      else {
        const ext = getFileExt(tgtFilePath);
        if (ext === 'jpg' || ext === 'png') {
          const head = 'data:image/' + ext + ';base64,';
          const b64 = head + data.toString('base64');
          resolve(b64);
        } else {
          resolve();
        }
      }
    });
  });
  return promise;
};

module.exports = (tgtDirPath, tgtExt = ALL_EXT) => {
  return new Promise((resolve, reject) => {
    getFileNames(tgtDirPath).then((data) => {
      const pAry = [];
      data.forEach((file) => {
        if (file.substring(file.lastIndexOf('.') + 1) === tgtExt ||
          tgtExt === ALL_EXT || tgtExt === WILD
        ) {
          pAry.push(checkStat(path.join(tgtDirPath, file)));
        }
      });
      Promise.all(pAry).then((arg) => {
        const files = arg.filter((a) => a[1]).map((a) => a[0]);
        pAry2 = [];
        files.forEach((file) => {
          pAry2.push(getBase64(file))
        });
        Promise.all(pAry2).then((arg2) => {
          resolve(arg2.filter((b) => b !== undefined));
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};