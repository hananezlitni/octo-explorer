import React, { useEffect, useRef, useState } from "react";
import Input from "./components/Input/Input";
import Button from "./components/Button/Button";

const App = () => {
  const [searchValue, setSearchValue] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [reposList, setReposList] = useState(null);
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
      fetchRepos();
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
        <h2>
          Users <small>{usersList?.total_count}</small>
        </h2>
        {usersList?.items.map((user) => (
          <p key={user.id}>
            <img src={user.avatar_url} /> <br /> {user.login}
          </p>
        ))}

        <h2>
          Repos <small>{reposList?.total_count}</small>
        </h2>
        {reposList?.items.map((repo) => (
          <p key={repo.id}>{repo.name}</p>
        ))}
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
