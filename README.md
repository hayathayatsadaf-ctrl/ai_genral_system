# AI-Assisted Journal System

## Overview

This project allows users to write journal entries after immersive nature sessions such as forest, ocean, or mountain environments.

The system:

* Stores journal entries
* Uses an LLM to analyze emotions
* Provides insights about the user's mental state over time.

## Tech Stack

Backend

* Node.js
* Express
* MongoDB
* Groq API (Llama 3.1)

Frontend

* React
* Axios

## Features

* Create journal entries
* Emotion analysis using LLM
* Store emotion, keywords, and summary
* View previous journal entries
* View user insights (top emotion, ambience, keywords)

## API Endpoints

### Create Journal Entry

POST /api/journal

Example request

{
"userId":"123",
"ambience":"forest",
"text":"I felt calm today after listening to the rain"
}

### Get Journal Entries

GET /api/journal/:userId

### Analyze Emotion

POST /api/journal/analyze

### Get Insights

GET /api/journal/insights/:userId

Returns:

* totalEntries
* topEmotion
* mostUsedAmbience
* recentKeywords

## Run Backend

cd backend
npm install
node server.js

Backend runs on:
http://localhost:5000

## Run Frontend

cd journal-frontend
npm install
npm start

Frontend runs on:
http://localhost:3000
