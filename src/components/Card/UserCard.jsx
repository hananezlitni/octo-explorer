import React from "react";
import styles from "./Card.module.css";

const UserCard = ({ username, avatar, followers }) => {
  return (
    <div className={styles.card}>
      <img className={styles.userAvatar} src={avatar} alt={`${username}'s GitHub avatar`} />
      <h2>
        {username}
      </h2>
      <p>Followers: {followers}</p>
    </div>
  );
};

export default UserCard;
