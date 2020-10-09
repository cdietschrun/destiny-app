import * as React from "react";
import { useState } from "react";
import logo from './logo.svg';
import './App.css';

import ClientOAuth2 from "client-oauth2";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import * as qs from 'query-string';
import { ExecFileOptionsWithStringEncoding } from "child_process";

interface DestinyAccount
{
  xboxDisplayName: string;
  psnDisplayName: string;
}

function App()
{
  const [code, setCode] = useState('');
  const [user, setUser] = useState({} as DestinyAccount);

  React.useEffect(() => {
    getCharacterData();
  }, [code]);

  // const bungienet = new ClientOAuth2({
  //   clientId: process.env.REACT_APP_DESTINY_CLIENT_ID,
  //   // clientSecret: process.env.REACT_APP_DESTINY_CLIENT_ID,
  //   redirectUri: 'https://localhost:3000/destiny-app/',
  //   accessTokenUri: "https://www.bungie.net/Platform/App/OAuth/token/",
  //   authorizationUri: "https://www.bungie.net/en/OAuth/Authorize",
  //   scopes: ["ReadBasicUserProfile", "MoveEquipDestinyItems", "ReadDestinyInventoryAndVault"]
  //   // headers: { "X-API-Key": process.env.REACT_APP_DESTINY_API_KEY}
  // });
  
  // const getUrl = (url: string) => {
  //   const url = github.code.getUri();
  //   return response;
  // }
  
  // const getResponse = async (url: string) => {
  //   const response = await bungienet.code.getToken(url);
  //   return response;
  // }

  function createFormParams (params: any)
  {
    return Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
  }

  async function getCharacterData()
  {
    // bungienet.credentials.getToken()
    //   .then(function (user) {
    //     console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }
  // })
      // const titles = await fetch('https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/', {
      //   headers: {
      //     'X-API-Key': process.env.REACT_APP_DESTINY_API_KEY as string,
      //     'Authorization': 'Bearer ' + code
      //   }
      // }).then(response => response.json());
      // console.log(titles);
      // console.log(titles['active_title']['name']);
      // setActiveTitle(titles['active_title']);
      console.log("in data");
      console.log(localStorage.getItem('token'));

      const body = {'grant_type': 'authorization_code', 
                    'code': localStorage.getItem('token'),
                    'client_id': process.env.REACT_APP_DESTINY_CLIENT_ID as string};

      const token = await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
        method: 'post',
        body: createFormParams(body),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 
                  'X-API-Key': process.env.REACT_APP_DESTINY_API_KEY as string}
                  //  'Authorization': localStorage.getItem('token') as string}
      }).then(response => response.json());
      console.log(token);
      localStorage.setItem('access_token', token.access_token);

      const user = await fetch('https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/', {
        headers: { 'X-API-Key': process.env.REACT_APP_DESTINY_API_KEY as string,
                   'Authorization': 'Bearer ' + token.access_token}
      }).then(response => response.json());

      console.log(user);
      setUser(user.Response);
  }

  return (
    <Router>
          <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <a href="https://www.bungie.net/en/OAuth/Authorize?client_id=34288&response_type=code">Click here to auth</a>
            <p>
              Destiny stuff Edit <code>src/App.js</code> and save to reload.
            </p>
            {user !== undefined && [<p>
              Xbox username: {user.xboxDisplayName} </p>,
              <p>PSN username: {user.psnDisplayName}
            </p>]
            }
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>

          <Route path="/destiny-app/authdone" component={Auth} />
      </div>
    </Router>

  );
}

function Auth(props: any)
{
  React.useEffect(() => {
    handleToken(props);
  }, []);

  function handleToken(props: any)
  {
    console.log(props);
    console.log("yo were here");
    let params = qs.parse(props.location.search);
    console.log(params.code);
    localStorage.setItem('token', params.code as string);
    // props.setCode(params.code);
  }

  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

export default App;
