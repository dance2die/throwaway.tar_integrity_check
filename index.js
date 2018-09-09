const hasha = require("hasha");
const axios = require("axios");

const url = `https://registry.npmjs.org/react/latest`;
axios
  .get(url)
  .then(_ => _.data.dist)
  .then(({ integrity, tarball: url }) => {
    axios.get(url, { responseType: "stream" }).then(({ data }) => {
      hasha
        .fromStream(data, { encoding: "base64" })
        .then(hash => {
          console.log(`[calc]integrity=sha512-${hash}`);
          console.log(`[furl]integrity=${integrity}`);
        })
        .catch(err => console.log(`err`, err));
    });
  });
