import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

const TabsComponent = (tabsArray, users, repos) => {
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    console.log({ users });
  });

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

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          {tabsArray.tabs.map((tab) => {
            <Tab label={tab.label} {...a11yProps(0)} />;
          })}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {users?.items.map((user) => (
          <p key={user.id}>
            <img src={user.avatar_url} /> <br /> {user.login}
          </p>
        ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {repos?.items.map((repo) => (
          <p key={repo.id}>{repo.name}</p>
        ))}
      </TabPanel>
    </>
  );
};

export default TabsComponent;
