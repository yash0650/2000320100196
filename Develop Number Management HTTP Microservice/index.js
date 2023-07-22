// Yash Gautam - ABES EC
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;
  if (!urls || !Array.isArray(urls)) {
    return res
      .status(400)
      .json({ error: "bad query." });
  }

  const result = new Set();
  
  try {
    const requests = urls.map((url) => axios.get(url));
    const responses = await Promise.allSettled(requests);

    responses.forEach(response => {
      if (response.value.data && Array.isArray(response.value.data.numbers)) {
        response.value.data.numbers.forEach(number => {
          result.add(number);
        });
      }
    });
    const endResult = Array.from(result).sort((a, b) => a - b);
    return res.json({ numbers: endResult });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "error occured." });
  }
});

app.listen(PORT, () => {
  console.log(
    `http://localhost:${PORT} is running`
  );
});
