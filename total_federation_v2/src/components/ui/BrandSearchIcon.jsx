import React from 'react';

const BrandSearchIcon = ({ isFocused, className, style, size = 16 }) => {
  const [filterId] = React.useState(() => "neon-glow-" + Math.random().toString(36).substr(2, 9));
  const width = size;
  const height = size;

  return (
    <svg 
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, display: "inline-block", verticalAlign: "middle", ...style }}
      viewBox="0 0 24 24"
    >
      <defs>
        <filter id={`${filterId}-focus`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${filterId}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="5" cy="5" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="12" cy="5" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="19" cy="5" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />

      <circle cx="5" cy="12" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="19" cy="12" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />

      <circle cx="5" cy="19" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="12" cy="19" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />
      <circle cx="19" cy="19" r="2" fill={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"} style={{ transition: "all 0.2s" }} />

      <circle 
        cx="12" 
        cy="12" 
        r="2" 
        fill="var(--color-emerald-core)" 
        filter={isFocused ? `url(#${filterId}-focus)` : `url(#${filterId}-blur)`}
        style={{ transition: "all 0.2s" }}
      />
    </svg>
  );
};

export default BrandSearchIcon;
