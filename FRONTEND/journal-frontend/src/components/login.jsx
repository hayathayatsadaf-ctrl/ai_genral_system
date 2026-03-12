import { useState } from "react";
import "../App.css";

function Login({ setUser }) {

  const [userId, setUserId] = useState("");

  const handleLogin = () => {
    if (!userId) {
      alert("Enter User ID");
      return;
    }
    setUser(userId);
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <p className="auth-subtitle">Welcome back to your journal</p>

      <input
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />

      <button className="btn-primary" onClick={handleLogin}>
        Enter Journal
      </button>
    </div>
  );
}

export default Login;