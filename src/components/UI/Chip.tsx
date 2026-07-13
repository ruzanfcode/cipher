function Chip({ children, active = false, onClick, className = '', style, sm='' }) {
  return (
    <button
      className={`chip ${active ? 'chip--active' : ''} ${className} ${sm ? 'chip-sm' : ''}`}
      style={style}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Chip;
