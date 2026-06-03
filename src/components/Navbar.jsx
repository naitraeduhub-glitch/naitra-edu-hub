export default function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Dashboard</h3>

      <div>
        <strong>Admin</strong>
      </div>
    </div>
  );
}