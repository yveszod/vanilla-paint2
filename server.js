const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
/*
 * Enable use of CSS Files
 * Source: https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type
 */
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/*
 * Render HTML Files, source: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
 */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/images', (req, res) => {
  res.header("Content-Type", 'application/json');
  res.sendFile(path.join(__dirname, 'images.json'));
});
// Add Images
app.post('/images', (req, res) => {
  fs.readFile('./images.json', 'utf8', (err, data) => {

    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {

      // parse JSON string to JSON object
      const images = JSON.parse(data);

      // add a new record
      images.push({
        src: req.body.src,
      });

      // write new data back to the file
      fs.writeFile('./images.json', JSON.stringify(images), (err) => {
        if (err) {
          console.log(`Error writing file: ${err}`);
        }
      });
    }

  });
  res.send('Image Added');
});

// Remove Images
app.post('/images/delete', (req, res) => {
  const emptyImages = [];
  fs.writeFile('./images.json', JSON.stringify(emptyImages), (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    }
  });
});

app.listen(3000, () => {
  console.log('Server Started on Port 3000');
});
