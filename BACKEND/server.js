require("dotenv").config()
const Journal = require("./models/Journal")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const axios = require("axios")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected")
})
.catch((err) => {
    console.log(err)
})

app.get("/", (req,res)=>{
    res.send("Journal API running")
})

// 
app.post("/api/journal", async (req, res) => {

  try {

    const { userId, ambience, text } = req.body;

    // LLM call
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Analyze the journal entry and return ONLY JSON.

{
"emotion": "",
"keywords": [],
"summary": ""
}

Journal:
${text}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data.choices[0].message.content;
    const analysis = JSON.parse(result);

    // Save to DB
    const journal = new Journal({
      userId,
      ambience,
      text,
      emotion: analysis.emotion,
      keywords: analysis.keywords,
      summary: analysis.summary
    });

    await journal.save();

    res.json({
      message: "Journal saved with analysis",
      data: journal
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      error: error.message
    });

  }

});
// 
app.get("/api/journal/:userId", async (req, res) => {

  try {

    const journals = await Journal.find({
      userId: req.params.userId
    })

    res.json(journals)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})
// 
app.post("/api/journal/analyze", async (req, res) => {

  try {

    const text = req.body.text;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Analyze the journal entry and return ONLY valid JSON.

Format:
{
"emotion": "",
"keywords": [],
"summary": ""
}

Journal:
${text}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data.choices[0].message.content;

    const parsed = JSON.parse(result);

    res.json(parsed);

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message
    });

  }

});
// 
app.get("/api/journal/insights/:userId", async (req, res) => {

  try {

    const userId = req.params.userId;

    const journals = await Journal.find({ userId });

    const totalEntries = journals.length;

    // Emotion count
    const emotionCount = {};

    journals.forEach(j => {
      if (j.emotion) {
        emotionCount[j.emotion] = (emotionCount[j.emotion] || 0) + 1;
      }
    });

    const topEmotion = Object.keys(emotionCount).reduce(
      (a, b) => emotionCount[a] > emotionCount[b] ? a : b,
      Object.keys(emotionCount)[0]
    );

    // Ambience count
    const ambienceCount = {};

    journals.forEach(j => {
      if (j.ambience) {
        ambienceCount[j.ambience] = (ambienceCount[j.ambience] || 0) + 1;
      }
    });

    const mostUsedAmbience = Object.keys(ambienceCount).reduce(
      (a, b) => ambienceCount[a] > ambienceCount[b] ? a : b,
      Object.keys(ambienceCount)[0]
    );

    // Recent keywords
    const recentKeywords = journals
      .slice(-3)
      .flatMap(j => j.keywords || []);

    res.json({
      totalEntries,
      topEmotion,
      mostUsedAmbience,
      recentKeywords
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

app.listen(5000,
     ()=>
        { console.log("Server running on port 5000")

         })