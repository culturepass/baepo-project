export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#f5f7fa",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        웹사이트
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#666",
        }}
      >
        ChatGPT + node.js 활용 제작사이트
      </p>
    </main>
  );
}