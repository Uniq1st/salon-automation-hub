function Tag({ children, color, bg }) {
  return (
    <span style={{
      background: bg,
      color: color,
      fontSize: 11,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 99,
      letterSpacing: "0.02em",
    }}>{children}</span>
  );
}

export default Tag;
