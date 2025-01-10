export default function ErrorPage({ message }: { message: string }) {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "red" }}>Error</h1>
      <p>{message}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}
