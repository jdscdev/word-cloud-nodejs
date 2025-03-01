const express = require('express');
const axios = require('axios');
const constants = require('./../constants');
const router = express.Router();

async function fetchEndpointsData(endpointURLs) {
  try {
    return await Promise.all(endpointURLs.map(url => axios.get(url)));
  } catch (error) {
    console.error('Error fetching endpoints:', error.message);
    return [];
  }
}

async function wordWork(endpointsData) {
  const uniqueWords = [];
  const resultArray = [];

  endpointsData.forEach(eData => {
    eData.data.body.split(' ').map(word => {
      const wordAux = word.replace(/[^a-zA-Z]/g, '').toLowerCase().trim();
      
      if (wordAux && !constants.STOP_WORDS.includes(wordAux)) {
        if (!uniqueWords.includes(wordAux)) {
          resultArray.push({ 
            word: wordAux,
            abs_frequency: 1,
            rel_frequency: 0
          });
          uniqueWords.push(wordAux);
        } else {
          resultArray.find(o => o.word === wordAux).abs_frequency++;
        }
      }
    });
  });
  // removes words with just 1 abs_frequency and sort by abs_frequency in descending order
  return resultArray
    .filter(o => o.abs_frequency > 1)
    .sort((a, b) => b.abs_frequency - a.abs_frequency);
}

router.get('/', async (_, res) => {
  const endpointURLs = Array.from({ length: 100 }).map((_, index) => `https://dummyjson.com/posts/${index + 1}`);
  const endpointsData = await fetchEndpointsData(endpointURLs);
  const wordResults = await wordWork(endpointsData);

  res.render('index', { wordResults });
});

module.exports = router;
