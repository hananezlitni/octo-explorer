import React, { useEffect, useRef, useState } from "react";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";
import UserCard from "./components/Card/UserCard";
import RepoCard from "./components/Card/RepoCard";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import styles from "./App.module.css";

const App = () => {
  const [searchValue, setSearchValue] = useState(null); // Value of the input field
  const [resultsFetched, setResultsFetched] = useState(false); // If results have been fetched
  const [usersList, setUsersList] = useState(null); // List of users returned from the Search API
  const [reposList, setReposList] = useState(null); // List of repos returned from the Search API
  const [usersPagination, setUsersPagination] = useState(null); // Pagination for the users tab
  const [reposPagination, setReposPagination] = useState(null); // Pagination for the repos tab
  const [apiLimitReached, setApiLimitReached] = useState(false); // If the API limit has been reached
  const inputRef = useRef(null); // Reference to the input field

  /* Material UI Tabs */
  const [value, setValue] = React.useState(0);
  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }; //end of Material UI tabs

  // Search users and repos
  async function searchUsers(url) {
    let users = await fetch(url)
      .then((res) => {
        if (res.status === 403) {
          setApiLimitReached(true);
          return;
        } else {
          /* Retrieve pagination links then add "order" property to easily sort the links */
          let links = res.headers.get("link").split(",");
          let urls = links.map((link) => {
            let title = link
              .split(";")[1]
              .replace("rel=", "")
              .replaceAll('"', "");

            let order = 0;

            switch (title) {
              case " next":
                title = "Next page";
                order = 3;
                break;
              case " prev":
                title = "Previous page";
                order = 2;
                break;
              case " first":
                title = "First page";
                order = 1;
                break;
              case " last":
                title = "Last page";
                order = 4;
                break;
            }

            return {
              url: link.split(";")[0].replace(">", "").replace("<", ""),
              title: title,
              order: order,
            };
          });
          setUsersPagination(urls);
          return res.json();
        }
      })
      .then((data) => {
        if (!apiLimitReached) {
          setUsersList(data);
        }
      });
  }

  async function searchRepos(url) {
    let repos = await fetch(url)
      .then((res) => {
        if (res.status === 403) {
          setApiLimitReached(true);
          return;
        } else {
          /* Retrieve pagination links then add "order" property to easily sort the links */
          let links = res.headers.get("link").split(",");
          let urls = links.map((link) => {
            let title = link
              .split(";")[1]
              .replace("rel=", "")
              .replaceAll('"', "");

            let order = 0;

            switch (title) {
              case " next":
                title = "Next page";
                order = 3;
                break;
              case " prev":
                title = "Previous page";
                order = 2;
                break;
              case " first":
                title = "First page";
                order = 1;
                break;
              case " last":
                title = "Last page";
                order = 4;
                break;
            }
            return {
              url: link.split(";")[0].replace(">", "").replace("<", ""),
              title: title,
              order: order,
            };
          });
          setReposPagination(urls);
          return res.json();
        }
      })
      .then((data) => {
        if (!apiLimitReached) {
          setReposList(data);
          setResultsFetched(true);
        }
      });
  } // End of search users and repos

  /* Form submission handler */
  const submitHandler = (e) => {
    let input = inputRef.current.value;
    setSearchValue(input);
    e.preventDefault();
  }; // End of form submission handler

  /* Search users and repos using GitHub's Search API */
  useEffect(() => {
    if (searchValue) {
      searchUsers(
        `https://api.github.com/search/users?q=${searchValue}&page=1&per_page=12`
      );
      searchRepos(
        `https://api.github.com/search/repositories?q=${searchValue}&page=1&per_page=12`
      );
    }
  }, [searchValue]); // end of useEffect()

  return (
    <>
      <header>
        {/* GitHub corner */}
        <a
          href="https://github.com/hananezlitni/search-git"
          target="_blank"
          className={styles.githubCorner}
          aria-label="View source on GitHub"
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 250 250"
            className={styles.octoSvg}
            aria-hidden="true"
          >
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path
              d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor"
              className={styles.octoArm}
            ></path>
            <path
              d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor"
              className={styles.octoBody}
            ></path>
          </svg>
        </a>
        {/* End of GitHub corner */}

        <h1>SearchGit</h1>
      </header>
      <main>
        {/* Form */}
        <form className={styles.form} onSubmit={submitHandler}>
          <Input placeholder="Search Git..." forwardedRef={inputRef} />
          <Button label="Search" color="primary" type="submit" />
        </form>
        {/* End of form */}

        {/* If the API limit reached, display a warning message */}
        {apiLimitReached && (
          <p className={styles.warning}>
            API limit reached. Please try again later.
          </p>
        )}

        {/* Otherwise, display tabs with search results */}
        {!apiLimitReached && resultsFetched ? (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Tabs to categorize search results"
              className={styles.tabs}
              TabIndicatorProps={{ style: { background: "#81a1c1" } }}
            >
              <Tab
                label={`Users ${
                  usersList ? `(${usersList.total_count})` : "(0)"
                }`}
                className={styles.tab}
                {...a11yProps(0)}
              />
              <Tab
                label={`Repositories ${
                  reposList ? `(${reposList.total_count})` : "(0)"
                }`}
                className={styles.tab}
                {...a11yProps(1)}
              />
            </Tabs>
            <TabPanel className={styles.tabPanel} value={value} index={0}>
              {/* Iterate over usersList to display users in cards */}
              {usersList?.items.map((user) => (
                <UserCard
                  key={user.id}
                  username={user.login}
                  avatar={user.avatar_url}
                />
              ))}
              {/* Display users pagination sorted as: First --> Previous --> Next --> Last */}
              {/* Render a button for each pagination link, and replace button label with corresponding SVG icon */}
              <div className={styles.pagination}>
                {usersPagination &&
                  usersPagination
                    ?.sort((a, b) => a.order - b.order)
                    .map((url) => (
                      <button
                        onClick={() => searchUsers(url.url)}
                        key={url.url}
                      >
                        {url.title === "First page" ? (
                          <svg viewBox="0 0 448 512">
                            <title>{url.title}</title>
                            <path d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z" />
                          </svg>
                        ) : url.title === "Previous page" ? (
                          <svg viewBox="0 0 256 512">
                            <title>{url.title}</title>
                            <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />
                          </svg>
                        ) : url.title === "Next page" ? (
                          <svg viewBox="0 0 256 512">
                            <title>{url.title}</title>
                            <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
                          </svg>
                        ) : url.title === "Last page" ? (
                          <svg viewBox="0 0 448 512">
                            <title>{url.title}</title>
                            <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z" />
                          </svg>
                        ) : (
                          ""
                        )}
                      </button>
                    ))}
              </div>
            </TabPanel>
            <TabPanel className={styles.tabPanel} value={value} index={1}>
              {/* Iterate over usersList to display users in cards */}
              {reposList?.items.map((repo) => (
                <RepoCard
                  key={repo.id}
                  name={repo.name}
                  owner={repo.owner.login}
                  stars={repo.stargazers_count}
                  language={repo.language}
                />
              ))}
              {/* Display repos pagination sorted as: First --> Previous --> Next --> Last */}
              {/* Render a button for each pagination link, and replace button label with corresponding SVG icon */}
              <div className={styles.pagination}>
                {reposPagination &&
                  reposPagination
                    ?.sort((a, b) => a.order - b.order)
                    .map((url) => (
                      <button
                        onClick={() => searchRepos(url.url)}
                        key={url.url}
                      >
                        {url.title === "First page" ? (
                          <svg viewBox="0 0 448 512">
                            <title>{url.title}</title>
                            <path d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z" />
                          </svg>
                        ) : url.title === "Previous page" ? (
                          <svg viewBox="0 0 256 512">
                            <title>{url.title}</title>
                            <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />
                          </svg>
                        ) : url.title === "Next page" ? (
                          <svg viewBox="0 0 256 512">
                            <title>{url.title}</title>
                            <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
                          </svg>
                        ) : url.title === "Last page" ? (
                          <svg viewBox="0 0 448 512">
                            <title>{url.title}</title>
                            <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z" />
                          </svg>
                        ) : (
                          ""
                        )}
                      </button>
                    ))}
              </div>
            </TabPanel>
          </>
        ) : (
          ""
        )}
      </main>
    </>
  );
};

export default App;
