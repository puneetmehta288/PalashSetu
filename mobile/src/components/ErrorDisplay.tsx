import React from 'react';
export const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>{message}</div>
);
export default ErrorDisplay;
