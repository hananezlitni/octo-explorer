import React from "react";
import styles from "./Button.module.css";

const Button = ({ label, color, type }) => {
  return (
    <button
      className={`${styles.button} ${styles[color]}`}
      type={type}
    >
      {label}
    </button>
  );
};

export default Button;
