import React from 'react';

const SearchableDropdown = ({ value, onChange, options, placeholder, style }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
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

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const s = search.toLowerCase();
    return options.filter(opt =>
      opt.name.toLowerCase().includes(s) ||
      (opt.code && opt.code.toLowerCase().includes(s))
    );
  }, [search, options]);

  const selectedOption = React.useMemo(() => {
    return options.find(opt => opt.code === value);
  }, [value, options]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...style,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        <span>{selectedOption ? selectedOption.name : placeholder}</span>
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '11px', opacity: 0.7 }}></i>
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#1b1f24',
          border: '1px solid rgba(34, 211, 238, 0.4)',
          borderRadius: '8px',
          marginTop: '4px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          maxHeight: '220px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, backgroundColor: '#1b1f24', zIndex: 1 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ძებნა..."
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '6px',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '12px'
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div style={{ padding: '4px 0' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt.code}
                  onClick={() => {
                    onChange(opt.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: value === opt.code ? '#22d3ee' : '#e2e8f0',
                    backgroundColor: value === opt.code ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.target.style.backgroundColor = value === opt.code ? 'rgba(34, 211, 238, 0.08)' : 'transparent'}
                >
                  {opt.name}
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                ქვეყანა ვერ მოიძებნა
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
