import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: '' });

  const fetchRequests = async () => {
    try {
      const { data } = await axios(`${rootUrl}/rate_limit`);
      let { remaining: request } = data.rate;
      setRequests(request);

      if (request === 0) {
        toggleError(true, 'Sorry, you have exceeded your hourly rate limit');
      }
    } catch (error) {
      // throw error
    }
  };

  const fetchUser = async (user) => {
    toggleError();
    setIsLoading(true);
    const response = await axios(`https://api.github.com/users/${user}`).catch(
      (err) => console.log(err.message)
    );
    if (response) {
      setGithubUser(response.data);
      const { followers_url, login } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(followers_url),
      ]).then((res) => {
        const [repos, followers] = res;
        const status = 'fulfilled';
        if (repos.status === status) {
          setRepos(repos.value.data);
        }
        if (followers.status === status) {
          setFollowers(followers.value.data);
        }
      });
    } else {
      toggleError(true, 'there is no user with this nick');
    }
    setIsLoading(false);
    fetchRequests();
  };

  const toggleError = (show = false, msg = '') => {
    setError({ msg, show });
  };

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        isLoading,
        repos,
        followers,
        requests,
        error,
        fetchUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

const useGithubContext = () => {
  return useContext(GithubContext);
};

export { GithubProvider, useGithubContext };
