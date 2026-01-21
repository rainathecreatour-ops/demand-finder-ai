const https = require('https');

// Export config to set function timeout
exports.config = {
  timeout: 60
};

// Increase function timeout in netlify.toml to 60 seconds
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, max_tokens } = JSON.parse(event.body);

    console.log('Received request with', messages.length, 'messages');

    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('API key not configured!');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'API key not configured. Please add ANTHROPIC_API_KEY to your environment variables.',
          errorType: 'ConfigurationError'
        })
      };
    }

    // Prepare the request data with increased timeout
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: max_tokens || 2000,
      messages: messages
    });

    console.log('Sending request to Claude API...');

    // Make request to Anthropic API
    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': data.length
        },
        timeout: 55000 // 55 second timeout
      };

      const req = https.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedBody = JSON.parse(body);
            resolve({
              statusCode: res.statusCode,
              body: parsedBody
            });
          } catch (e) {
            reject(new Error('Failed to parse response: ' + body));
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });

      req.write(data);
      req.end();
    });

    console.log('Received response from Claude API');

    // Check if the API returned an error status
    if (response.statusCode !== 200) {
      console.error('API returned error status:', response.statusCode, response.body);
      return {
        statusCode: response.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: response.body.error || 'API request failed',
          errorType: 'APIError',
          statusCode: response.statusCode
        })
      };
    }

    // Return the successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response.body)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: error.message || 'Internal server error',
        errorType: 'FunctionError'
      })
    };
  }
};
