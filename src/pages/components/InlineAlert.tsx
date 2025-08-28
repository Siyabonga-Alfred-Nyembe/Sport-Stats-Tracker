import React from 'react';

interface InlineAlertProps {
  message?: string | null;
  onClose?: () => void;
  tone?: 'error' | 'info' | 'success' | 'warning';
}

const InlineAlert: React.FC<InlineAlertProps> = ({ message, onClose, tone = 'error' }) => {
  if (!message) return null;
  const bg = tone === 'error' ? '#fdecea' : tone === 'success' ? '#e8f5e9' : tone === 'warning' ? '#fff3e0' : '#e3f2fd';
  const color = tone === 'error' ? '#b00020' : tone === 'success' ? '#1b5e20' : tone === 'warning' ? '#e65100' : '#0d47a1';
  const border = tone === 'error' ? '#f5c6cb' : tone === 'success' ? '#c8e6c9' : tone === 'warning' ? '#ffe0b2' : '#bbdefb';
  return (
    <div style={{ background: bg, color, border: `1px solid ${border}`, padding: '10px 12px', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
      <span style={{ lineHeight: 1.4 }}>{message}</span>
      {onClose && (
        <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', color, fontSize: 18, cursor: 'pointer' }}>
          ×
        </button>
      )}
    </div>
  );
};

export default InlineAlert;


