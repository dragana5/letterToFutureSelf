// Node.js server to act as a proxy
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/klaviyo', async (req, res) => {
  try {
    const email = req.query.email;
    const apiKey = "pk_0169f70a51e8aaba9a40e4540b854c8290"; 
    const apiUrl = `https://a.klaviyo.com/api/v2/people/search?email=${email}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while making the request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
