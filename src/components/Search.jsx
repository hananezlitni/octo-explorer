import React, { useEffect, useState } from "react";

const Search = () => {
  let [avatar, setAvatar] = useState("");

  useEffect(() => {
    const results = fetch(`https://api.github.com/search/users?q=hananezlitni`)
      .then((res) => res.json())
      .then((data) => {
        setAvatar(data.items[0].avatar_url);
      });
  });
  return <img src={avatar} />;
};

export default Search;
