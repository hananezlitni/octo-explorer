import React, { useEffect, useRef, useState } from "react";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";

import TabsComponent from "./components/Tabs/Tabs";

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

  async function fetchUsers() {
    let users = await fetch(
      `https://api.github.com/search/users?q=${searchValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsersList(data);
      });

    let repos = await fetch(
      `https://api.github.com/search/repositories?q=${searchValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        setReposList(data);
        setResultsFetched(true);
      });
  }

  async function fetchRepos() {
    let repos = await fetch(
      `https://api.github.com/search/repositories?q=${searchValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        setReposList(data);
      });
  }

  useEffect(() => {
    if (searchValue) {
      fetchUsers();
      //fetchRepos();
    }
  }, [searchValue]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SearchGit</h1>
      </header>
      <main>
        <form className="form" onSubmit={submitHandler}>
          <Input placeholder="Search Git..." forwardedRef={inputRef} />
          <Button label="Search" color="primary" type="submit" />
        </form>
        <br />
        <br />
        <br />
        {resultsFetched ? (
          <TabsComponent
            tabs={[
              {
                label: `Users ${`(${usersList.total_count})`}`,
                value: "users",
              },
              {
                title: `Repositories ${`(${reposList.total_count})`}`,
                value: "repositories",
              },
            ]}
            users={usersList}
            repos={reposList}
          />
        ) : (
          ""
        )}
      </main>
      <footer>
        <br />
        <br />
        <br />
        <small>Made by Hanane Zlitni</small>
      </footer>
    </div>
  );
};

export default App;

/*Users ${usersList ? `(${usersList.total_count})` : ""}`*/
