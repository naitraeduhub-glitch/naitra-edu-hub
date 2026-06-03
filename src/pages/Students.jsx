export default function Students() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Students</h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Mobile</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Amit Choudhary</td>
            <td>CDS</td>
            <td>9876543210</td>
            <td>Active</td>
          </tr>

          <tr>
            <td>Rahul Kumar</td>
            <td>NDA</td>
            <td>9876543211</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}