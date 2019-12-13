const multilangSentiment = require('multilang-sentiment');

const words = {
  '🍥': 0,
  '🍱': 0,
  '❤️': 2,
  '🙂': 1,
  // hang: -5,
  // depressed: -5,
  // 'yeet': -5,
  kms: -5, // for suicide_10.js
};

// Sentiment IIFE to save a reference to the client and log sentiment usage.
const sentiment = (() => {
  let client;
  const S = text => {
    const result = multilangSentiment(text, 'en', { words });
    if (client) {
      client.emit('sentiment', { length: text.length, score: result.score });
    }
    return result;
  };
  S.setClient = clt => {
    client = clt;
  };
  return S;
})();

module.exports = sentiment;
