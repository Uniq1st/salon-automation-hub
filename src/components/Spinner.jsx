function Spinner() {
  return (
    <span style={{
      display: "inline-block",
      width: 14,
      height: 14,
      border: "2px solid var(--color-border-secondary)",
      borderTopColor: "var(--color-text-secondary)",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      verticalAlign: "middle",
      marginRight: 6,
    }} />
  );
}

export default Spinner;
