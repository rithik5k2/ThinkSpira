import React, { useState, useEffect } from "react";

function App() {
  const [assignments, setAssignments] = useState([]);

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/assignments", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch(() => console.log("Not logged in yet"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Google Classroom Assignments</h1>
      <button onClick={loginWithGoogle}>Login with Google</button>
      <p>{assignments}</p>
    </div>
  );
}

export default App;