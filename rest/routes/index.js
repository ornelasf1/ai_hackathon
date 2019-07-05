var express = require('express');
var router = express.Router();
var path = require('path');

const getObjectFromFile = fileName => {
  const fs = require('fs');
  const file = fs.readFileSync(path.join(__dirname, fileName), 'utf8');
  let obj = {};
  if (file) {
      obj = JSON.parse(file); 
  }

  return obj;
};

/* GET home page. */
router.get('/mock', (req, res) => {
  res.json(getObjectFromFile('../data/demo-data.json'));
});

router.get('/mock-predictions', (req, res) => {
  res.json(getObjectFromFile('../data/demo-data-pred.json'));
});

module.exports = router;
