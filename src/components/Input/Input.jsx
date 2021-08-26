import React from "react";
import styles from "./Input.module.css";

const Input = ({ placeholder, forwardedRef }) => {
  return (
    <input
      className={styles.input}
      type="text"
      placeholder={placeholder}
      ref={forwardedRef}
    />
  );
};

export default Input;
