const express = require('express');
const axios = require('axios');
const router = express.Router();

async function fetchEndpoints() {
  try {
    const endpointURLs = Array.from({ length: 3 }).map((_, index) => `https://dummyjson.com/posts/${index + 1}`);
    const responses = await Promise.all(endpointURLs.map(url => axios.get(url)));
    return responses.map((response, _) => ({ data: response.data }));
  } catch (error) {
    console.error('Error fetching endpoints:', error.message);
    return [];
  }
}

router.get('/', async (_, res) => {
  const results = await fetchEndpoints();
  res.render('index', { results });
});

module.exports = router;
