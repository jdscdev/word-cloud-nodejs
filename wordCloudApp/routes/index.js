const express = require('express');
const axios = require('axios');
const router = express.Router();

async function fetchEndpoints() {
  try {
    const endpointURLs = Array.from({ length: 3 }).map((_, index) => `https://dummyjson.com/posts/${index + 1}`);

    return await Promise.all(endpointURLs.map(url => axios.get(url)));
  } catch (error) {
    console.error('Error fetching endpoints:', error.message);
    return [];
  }
}

async function wordWork() {
  const endpointsData = await fetchEndpoints();
  const uniqueWords = [];
  const resultArray = [];

  endpointsData.forEach(eData => {
    eData.data.body.split(' ').map(word => {
      const wordAux = word.replace(/[^a-zA-Z ]/g, '').toLowerCase();
      
      if (wordAux.length > 3) {
        if (!uniqueWords.includes(wordAux)) {
          resultArray.push({ word: wordAux, count: 1 });
          uniqueWords.push(wordAux);
        } else {
          resultArray.find(o => o.word === wordAux).count++;
        }
      }
    });
  });
  // removes words with just 1 count and sort by count
  return resultArray
    .filter(o => o.count > 1)
    .sort((a, b) => b.count - a.count);
}

router.get('/', async (_, res) => {
  const results = await wordWork()//;
  res.render('index', { results });
});

module.exports = router;
