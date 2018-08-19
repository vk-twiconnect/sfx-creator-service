const express = require('express');
const app = express();
const zip = require('./zip');
const port = process.env.PORT || 3000;

const packageJson = require('./package.json');

app.use(express.json())

app.get('/', (req, res) => res.send({
  name: packageJson.anme,
  homepage: packageJson.homepage,
  version: packageJson.version,
  description: packageJson.description,
  author: packageJson.author,
  nodeVersion: process.version
}));

app.post('/zip', (req, res) => {
  zip.zip(req.get('x-api-key'), req.body, (err, data) => {
    if(err) {
        console.error(JSON.stringify(err));
        res.status(500).send(err.message);
    } else {
        zip.remove_dir(data.folder_name)
        delete data.folder_name
        res.send(data)
    }
  })
})

app.listen(port, () => console.log(`Service listening on port ${port}!`))