function SentimentBadge({ label, fg, bg, dot = false, className = '', size = ''  }) {
  return (
    <span className={`sentiment-badge ${className} ${size}`} style={{ color: fg, background: bg  }}>
      {dot ? <span className="sentiment-badge__dot" style={{ background: fg }} /> : null}
      {label}
    </span>
  );
}

export default SentimentBadge;
