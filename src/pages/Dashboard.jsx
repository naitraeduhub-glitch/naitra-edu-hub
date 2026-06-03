import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f1f5f9",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <div style={{ padding: "20px" }}>
          <h1>Welcome to Naitra Edu Hub</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div style={cardStyle}>
              <h3>Total Students</h3>
              <p>120</p>
            </div>

            <div style={cardStyle}>
              <h3>Active Students</h3>
              <p>98</p>
            </div>

            <div style={cardStyle}>
              <h3>Attendance</h3>
              <p>92%</p>
            </div>

            <div style={cardStyle}>
              <h3>Tests This Week</h3>
              <p>5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  textAlign: "center",
};