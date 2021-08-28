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
  const [searchValue, setSearchValue] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [reposList, setReposList] = useState(null);
  const [resultsFetched, setResultsFetched] = useState(false);
  const [userUrls, setUserUrls] = useState(null);
  const [repoUrls, setRepoUrls] = useState(null);
  const inputRef = useRef(null);

  const submitHandler = (e) => {
    let input = inputRef.current.value; //REVISIT
    setSearchValue(input);
    e.preventDefault();
  };

  async function fetchUsers(url) {
    let users = await fetch(url)
      .then((res) => {
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
        setUserUrls(urls);
        return res.json();
      })
      .then((data) => {
        setUsersList(data);
      });
  }

  async function fetchRepos(url) {
    let repos = await fetch(url)
      .then((res) => {
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
          console.log({ title });
          return {
            url: link.split(";")[0].replace(">", "").replace("<", ""),
            title: title,
            order: order,
          };
        });
        console.log({ urls });
        setRepoUrls(urls);
        return res.json();
      })
      .then((data) => {
        setReposList(data);
        setResultsFetched(true);
      });
  }

  useEffect(() => {
    if (searchValue) {
      fetchUsers(
        `https://api.github.com/search/users?q=${searchValue}&page=1&per_page=12`
      );
      fetchRepos(
        `https://api.github.com/search/repositories?q=${searchValue}&page=1&per_page=12`
      );
    }
  }, [searchValue]);

  /* TABS */
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
  };
  //end tabs

  return (
    <>
      <header>
        <h1>SearchGit</h1>
      </header>
      <main>
        <form className={styles.form} onSubmit={submitHandler}>
          <Input placeholder="Search Git..." forwardedRef={inputRef} />
          <Button label="Search" color="primary" type="submit" />
        </form>
        {resultsFetched ? (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Tabs to categorize search results"
              className={styles.tabs}
              TabIndicatorProps={{ style: { background: "#8FBCBB" } }}
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
              {usersList?.items.map((user) => (
                <UserCard
                  key={user.id}
                  username={user.login}
                  avatar={user.avatar_url}
                />
              ))}
              <div className={styles.pagination}>
                {userUrls &&
                  userUrls
                    ?.sort((a, b) => a.order - b.order)
                    .map((url) => (
                      <button onClick={() => fetchUsers(url.url)} key={url.url}>
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
              {reposList?.items.map((repo) => (
                <RepoCard
                  key={repo.id}
                  name={repo.name}
                  owner={repo.owner.login}
                  stars={repo.stargazers_count}
                  language={repo.language}
                />
              ))}
              <div className={styles.pagination}>
                {repoUrls &&
                  repoUrls
                    ?.sort((a, b) => a.order - b.order)
                    .map((url) => (
                      <button onClick={() => fetchRepos(url.url)} key={url.url}>
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
