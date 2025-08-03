const axios = require('axios');

async function httpCheck(url) {
  try {
    const start = Date.now();
    const response = await axios.get(url, { timeout: 10000 });
    const loadTime = Date.now() - start;

    return {
      status: response.status,
      ok: response.status === 200,
      loadTime,
      headers: response.headers,
    };
  } catch (error) {
    return {
      status: error.response?.status || 0,
      ok: false,
      loadTime: null,
      headers: {},
    };
  }
}

module.exports = httpCheck;