const hasha = require("hasha");
const axios = require("axios");
const tar = require("tar");

// const url = `https://registry.npmjs.org/react/latest`;
// axios
//   .get(url)
//   .then(_ => _.data.dist)
//   .then(({ integrity, tarball: url }) => {
//     axios.get(url, { responseType: "stream" }).then(({ data }) => {
//       hasha
//         .fromStream(data, { encoding: "base64" })
//         .then(hash => {
//           console.log(`[calc]integrity=sha512-${hash}`);
//           console.log(`[furl]integrity=${integrity}`);
//         })
//         .catch(err => console.log(`err`, err));
//     });
//   });

const urls = [
  `https://registry.npmjs.org/jquery/-/jquery-3.3.1.tgz`,
  `http://registry.npmjs.org/react/-/react-16.4.0-alpha.7926752.tgz`,
  `https://registry.npmjs.org/chalk/-/chalk-2.4.1.tgz`,
  `http://registry.npmjs.org/express/-/express-4.16.3.tgz`,
  `https://registry.npmjs.org/lodash/-/lodash-4.17.10.tgz`,
  `https://registry.npmjs.org/calendar-dates/-/calendar-dates-2.1.4.tgz`,
  `https://registry.npmjs.org/styled-components/-/styled-components-4.0.0-beta.1-2.tgz`
];

urls.forEach(printTarJavaScriptFiles);

// const ignoredDirectoryPattern = /^.+\/(src|lib|test|tests)\/.*/gi;
const ignoredDirectoryPattern = /^.+\/(src|lib|test|tests)\/.*/gi;
// Michael Jackson's unpkg source
// https://github.com/unpkg/unpkg.com/blob/21ed6ee42e298b7eb640ed35912e9c0355c1270d/modules/middleware/findFile.js#L29
// Turns 'package/dist/jquery.js into 'dist/jquery.js
const leadingSegmentPattern = /^[^/]+\/?/gi;

function printTarJavaScriptFiles(tarUrl) {
  axios({
    method: "get",
    url: tarUrl,
    responseType: "stream"
  }).then(function(response) {
    // response.data.pipe(tar.t()).on('entry', entry => { console.log(entry.path); })
    let entries = [];

    response.data
      .pipe(tar.t())
      .on("entry", entry => {
        // console.log(`+++++++++++++++++++++++++++++++++++++`);
        // console.log(`URL => ${tarUrl}`);
        // if (entry.path.endsWith(".js")) console.log(entry.path);
        // console.log(`=====================================`);
        if (entry.path.match(ignoredDirectoryPattern)) return;

        if (entry.path.endsWith(".js")) {
          const javaScriptFile = entry.path.replace(leadingSegmentPattern, "");
          // Lodash has a 💩 load of helper files starting with "_"
          if (javaScriptFile.startsWith("_")) return;
          if (javaScriptFile.endsWith(".config.js")) return;

          entries.push(javaScriptFile);
        }
      })
      .on("end", () => {
        console.log(`+++++++++++++++++++++++++++++++++++++`);
        console.log(`URL => ${tarUrl}`);
        // entries.map(console.log);
        console.log(`entries`, entries);
        console.log(`=====================================`);
      });
  });
}

// const tarUrl = `http://registry.npmjs.org/react/-/react-16.4.0-alpha.7926752.tgz`;
// axios({
//   method: "get",
//   url: tarUrl,
//   responseType: "stream"
// }).then(function(response) {
//   // response.data.pipe(tar.t()).on('entry', entry => { console.log(entry.path); })
//   response.data.pipe(tar.t()).on("entry", entry => {
//     if (entry.path.endsWith(".js")) console.log(entry.path);
//   });
// });
