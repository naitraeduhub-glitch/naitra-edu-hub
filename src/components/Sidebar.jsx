export default function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>Naitra Edu Hub</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ margin: "20px 0", cursor: "pointer" }}>
📊 Dashboard
</li>
        <li style={{ margin: "20px 0", cursor: "pointer" }}>
👨‍🎓 Students
</li>

<li style={{ margin: "20px 0", cursor: "pointer" }}>
📅 Attendance
</li>

<li style={{ margin: "20px 0", cursor: "pointer" }}>
📈 Results
</li>
        
      </ul>
    </div>
  );
}