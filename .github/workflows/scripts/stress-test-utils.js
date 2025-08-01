const http = require('http');
const https = require('https');

class StressTestUtils {
  static async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      const req = protocol.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      req.on('error', reject);
      req.end();
    });
  }

  static async runConcurrentTests(url, concurrency = 10, requests = 100) {
    const results = [];
    const batches = Math.ceil(requests / concurrency);
    
    for (let batch = 0; batch < batches; batch++) {
      const batchPromises = [];
      const batchSize = Math.min(concurrency, requests - (batch * concurrency));
      
      for (let i = 0; i < batchSize; i++) {
        batchPromises.push(this.makeRequest(url));
      }
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }
}

module.exports = StressTestUtils;
