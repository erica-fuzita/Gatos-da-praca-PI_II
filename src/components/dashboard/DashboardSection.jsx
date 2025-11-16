export default function DashboardSection({ title, children }) {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2
        style={{
          color: "#2e4932",
          marginBottom: "15px",
          fontSize: "1.6rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
