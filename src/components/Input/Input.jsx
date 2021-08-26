import React from "react";

const Input = ({ placeholder, forwardedRef }) => {
  return (
    <input
      className="input"
      type="text"
      placeholder={placeholder}
      ref={forwardedRef}
    />
  );
};

export default Input;
