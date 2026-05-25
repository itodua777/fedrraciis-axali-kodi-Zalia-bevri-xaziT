import React from 'react';

const MultiSelectDropdown = ({ value = [], onChange, options = [], placeholder, style }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optVal) => {
    const newValue = value.includes(optVal)
      ? value.filter(v => v !== optVal)
      : [...value, optVal];
    onChange(newValue);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: 9999 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...style,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
          minHeight: '38px',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '6px 10px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {value.length === 0 ? (
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{placeholder}</span>
          ) : (
            value.map(val => (
              <span
                key={val}
                style={{
                  backgroundColor: 'color-mix(in oklab, var(--color-emerald-core) 15%, transparent)',
                  border: '1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)',
                  color: 'var(--color-emerald-core)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(val);
                }}
              >
                {val}
                <i className="fa-solid fa-xmark" style={{ fontSize: '9px', cursor: 'pointer' }}></i>
              </span>
            ))
          )}
        </div>
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '11px', opacity: 0.7 }}></i>
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 10000,
          backgroundColor: '#1b1f24',
          border: '1px solid color-mix(in oklab, var(--color-emerald-core) 40%, transparent)',
          borderRadius: '8px',
          marginTop: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
        }}>
          {options.map(opt => {
            const isSelected = value.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => toggleOption(opt)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: isSelected ? 'var(--color-emerald-core)' : '#cbd5e1',
                  backgroundColor: isSelected ? 'color-mix(in oklab, var(--color-emerald-core) 8%, transparent)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{opt}</span>
                {isSelected && <i className="fa-solid fa-check" style={{ fontSize: '10px' }}></i>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
