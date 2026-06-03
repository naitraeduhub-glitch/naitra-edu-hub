import React from "react";


export default function Login() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f4f4",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          width: "350px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Naitra Edu Hub Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
          }} />

        <input
          type="password"
          placeholder="Enter Password"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
          }} />

        <button
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
