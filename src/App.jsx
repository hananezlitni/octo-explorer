import React, { useEffect, useRef, useState } from "react";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import styles from "./App.module.css";

const App = () => {
  const [searchValue, setSearchValue] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [reposList, setReposList] = useState(null);
  const [resultsFetched, setResultsFetched] = useState(false);
  const inputRef = useRef(null);

  const submitHandler = (e) => {
    let input = inputRef.current.value; //REVISIT
    setSearchValue(input);
    e.preventDefault();
  };

  async function fetchResults() {
    let users = await fetch(
      `https://api.github.com/search/users?q=${searchValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setUsersList(data);
      });

    let repos = await fetch(
      `https://api.github.com/search/repositories?q=${searchValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setReposList(data);
        setResultsFetched(true);
      });
  }

  useEffect(() => {
    if (searchValue) {
      fetchResults();
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
        <br />
        <br />
        <br />
        {true ? (
          <>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Tabs to categorize search results"
              className={styles.tabs}
              TabIndicatorProps={{ style: { background: "#81A1C1" } }}
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
            <TabPanel value={value} index={0}>
              {usersList?.items.map((user) => (
                <p key={user.id}>
                  <img src={user.avatar_url} /> <br /> {user.login}
                </p>
              ))}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {reposList?.items.map((repo) => (
                <p key={repo.id}>{repo.name}</p>
              ))}
            </TabPanel>
          </>
        ) : (
          ""
        )}
      </main>
      <footer>
        <small>Made by Hanane Zlitni</small>
      </footer>
    </>
  );
};

export default App;

/*Users ${usersList ? `(${usersList.total_count})` : ""}`*/
