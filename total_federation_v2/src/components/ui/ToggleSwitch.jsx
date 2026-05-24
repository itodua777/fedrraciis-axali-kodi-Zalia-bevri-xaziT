import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}>
      <div style={{
        position: 'relative',
        width: '44px',
        height: '22px',
        backgroundColor: checked ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        border: checked ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '11px',
        transition: 'all 0.3s ease',
        boxShadow: checked ? '0 0 8px rgba(34, 211, 238, 0.3)' : 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '24px' : '2px',
          width: '16px',
          height: '16px',
          backgroundColor: checked ? '#22d3ee' : 'rgba(255, 255, 255, 0.6)',
          borderRadius: '50%',
          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          boxShadow: checked ? '0 0 6px #22d3ee' : 'none'
        }} />
      </div>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={e => onChange(e.target.checked)} 
        style={{ display: 'none' }}
      />
      <span style={{ fontSize: '13px', color: 'rgba(226, 232, 240, 0.9)' }}>{label}</span>
    </label>
  );
};

export default ToggleSwitch;
