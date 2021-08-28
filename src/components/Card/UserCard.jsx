import React, { useEffect } from "react";
import styles from "./Card.module.css";

const UserCard = ({ username, avatar }) => {
  const [userInfo, setUserInfo] = React.useState(null);

  async function fetchUserInfo() {
    let user = await fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setUserInfo(data);
      });
  }

  useEffect(() => {
    fetchUserInfo();
  }, [username]);

  return (
    <div className={`${styles.card} ${styles.user}`}>
      <img
        className={styles.userAvatar}
        src={avatar}
        alt={`${username}'s GitHub avatar`}
      />
      <div className={styles.username}>
        {userInfo?.name ? (
          <>
            <h3>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                className={styles.githubLink}
              >
                {userInfo?.name}
              </a>
            </h3>
            <p>{username}</p>
          </>
        ) : (
          <h3>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              className={styles.githubLink}
            >
              {username}
            </a>
          </h3>
        )}
      </div>
      <p className={styles.userBio}>{userInfo?.bio}</p>
      <div className={styles.cardFooter}>
        <p className={styles.userFooterData}>{userInfo?.public_repos} <br /> repositories</p>
        <p className={styles.userFooterData}>{userInfo?.followers} <br /> followers</p>
        <p className={styles.userFooterData}>{userInfo?.following} <br /> following</p>
      </div>
    </div>
  );
};

export default UserCard;
