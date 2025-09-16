const http = require('http');

// Test the server's root endpoint
http.get('http://localhost:5000/test', (res) => {
  let data = '';
  
  // A chunk of data has been received.
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // The whole response has been received.
  res.on('end', () => {
    console.log('Response status code:', res.statusCode);
    console.log('Response headers:', res.headers);
    console.log('Response data:', data);
  });
  
}).on("error", (err) => {
  console.error("Error:", err.message);
});
