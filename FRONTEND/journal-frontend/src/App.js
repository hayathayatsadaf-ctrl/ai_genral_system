import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);

  const userId = "123";

  const loadEntries = async () => {
    const res = await axios.get(`http://localhost:5000/api/journal/${userId}`);
    setEntries(res.data);
  };

  const submitJournal = async () => {

    await axios.post("http://localhost:5000/api/journal", {
      userId,
      ambience: "forest",
      text
    });

    setText("");
    loadEntries();
  };

  const loadInsights = async () => {
    const res = await axios.get(`http://localhost:5000/api/journal/insights/${userId}`);
    setInsights(res.data);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (

    <div style={{ padding: 20 }}>

      <h2>Write Journal</h2>

      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br/><br/>

      <button onClick={submitJournal}>Submit</button>

      <h2>Entries</h2>

      {entries.map((e) => (
        <div key={e._id} style={{border:"1px solid gray", margin:10, padding:10}}>
          <p>{e.text}</p>
          <p><b>Emotion:</b> {e.emotion}</p>
        </div>
      ))}

      <h2>Insights</h2>

      <button onClick={loadInsights}>Load Insights</button>

      {insights && (
        <div>

          <p>Total Entries: {insights.totalEntries}</p>
          <p>Top Emotion: {insights.topEmotion}</p>
          <p>Most Used Ambience: {insights.mostUsedAmbience}</p>

        </div>
      )}

    </div>

  );
}

export default App;
