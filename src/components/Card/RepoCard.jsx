import React, { useState, useEffect } from "react";
import styles from "./Card.module.css";

const RepoCard = ({ name, owner, stars, language }) => {
  const [repoInfo, setRepoInfo] = React.useState(null);

  async function fetchRepoInfo() {
    let repo = await fetch(`https://api.github.com/repos/${owner}/${name}`)
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setRepoInfo(data);
      });
  }

  useEffect(() => {
    fetchRepoInfo();
  }, [name, owner]);

  return (
    <div className={`${styles.card} ${styles.repo}`}>
      <h3><a href={`https://github.com/${owner}/${name}`} target="_blank" className={styles.githubLink}>{repoInfo?.name}</a></h3>

      <p className={styles.repoDescription}>{repoInfo?.description}</p>
      <div className={styles.cardFooter}>
        <p className={styles.repoStars}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <title>Number of stars</title>
            <path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z" />
          </svg>
          {stars}
        </p>
        <p className={styles.repoForks}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>Number of forks</title>
            <path d="M21 3c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.323.861 2.433 2.05 2.832.168 4.295-2.021 4.764-4.998 5.391-1.709.36-3.642.775-5.052 2.085v-7.492c1.163-.413 2-1.511 2-2.816 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.305.837 2.403 2 2.816v12.367c-1.163.414-2 1.512-2 2.817 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.295-.824-2.388-1.973-2.808.27-3.922 2.57-4.408 5.437-5.012 3.038-.64 6.774-1.442 6.579-7.377 1.141-.425 1.957-1.514 1.957-2.803zm-16.8 0c0-.993.807-1.8 1.8-1.8s1.8.807 1.8 1.8-.807 1.8-1.8 1.8-1.8-.807-1.8-1.8zm3.6 18c0 .993-.807 1.8-1.8 1.8s-1.8-.807-1.8-1.8.807-1.8 1.8-1.8 1.8.807 1.8 1.8zm10.2-16.2c-.993 0-1.8-.807-1.8-1.8s.807-1.8 1.8-1.8 1.8.807 1.8 1.8-.807 1.8-1.8 1.8z" />
          </svg>
          {repoInfo?.forks}
        </p>
        <p className={styles.repoLanguage}>{language}</p>
      </div>
    </div>
  );
};

export default RepoCard;
