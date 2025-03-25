import React from 'react';

const FormGroup = ({ 
  label, 
  id, 
  error, 
  children, 
  hint, 
  className = '' 
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {hint && <div className="form-hint">{hint}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormGroup;