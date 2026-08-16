const VitalLine = ({ className = '', color = '#0D9C8F', width = 220 }) => {
  return (
    <svg
      width={width}
      height="36"
      viewBox="0 0 220 36"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 18 H70 L82 4 L96 32 L108 12 L118 18 H220"
        stroke={color}
        strokeWidth="2.5"
        className="vital-line-path"
      />
    </svg>
  );
};

export default VitalLine;
