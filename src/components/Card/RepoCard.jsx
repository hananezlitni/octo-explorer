import React from "react";
import styles from "./Card.module.css";

const RepoCard = ({ name, owner, stars, language }) => {
  return (
    <div className={styles.card}>
      <h2>
        {name} (<small>Owner: {owner}</small>)
      </h2>
      <p>Stars: {stars}</p>
      <p>Language: {language}</p>
    </div>
  );
};

export default RepoCard;
