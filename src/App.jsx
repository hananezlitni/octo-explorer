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
          return {
            url: link.split(";")[0].replace(">", "").replace("<", ""),
            title: link.split(";")[1].replace("rel=", "").replaceAll('"', ""),
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
          return {
            url: link.split(";")[0].replace(">", "").replace("<", ""),
            title: link.split(";")[1].replace("rel=", "").replaceAll('"', ""),
          };
        });
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
                  userUrls?.map((url) => (
                    <button onClick={() => fetchUsers(url.url)} key={url.url}>
                      {url.title}
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
                  repoUrls?.map((url) => (
                    <button onClick={() => fetchRepos(url.url)} key={url.url}>
                      {url.title}
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