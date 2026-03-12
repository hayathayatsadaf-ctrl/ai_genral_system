import { useState } from "react";
import "../App.css";

function Register({ setUser }) {

  const [userId, setUserId] = useState("");

  const handleRegister = () => {
    if (!userId) {
      alert("Enter User ID");
      return;
    }
    setUser(userId);
  };

  return (
    <div className="auth-box">
      <h2>Register</h2>
      <p className="auth-subtitle">Create your journal space</p>

      <input
        placeholder="Create a User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleRegister()}
      />

      <button className="btn-primary" onClick={handleRegister}>
        Create Account
      </button>
    </div>
  );
}

export default Register;