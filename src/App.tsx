import * as React from "react";
import { useState } from "react";
import logo from './logo.svg';
import './App.css';

// import ClientOAuth2 from "client-oauth2";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import * as qs from 'query-string';

function is_dev()
{
  return process.env.NODE_ENV === "development";
}

function get_client_id(): string
{
  return is_dev() ? process.env.REACT_APP_DEV_DESTINY_CLIENT_ID as string : process.env.REACT_APP_DESTINY_CLIENT_ID as string
}

function get_api_key() : string
{
  return is_dev() ? process.env.REACT_APP_DEV_DESTINY_API_KEY as string : process.env.REACT_APP_DESTINY_API_KEY as string;
}

function createFormParams (params: any)
{
  return Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
}

interface DestinyAccount
{
  xboxDisplayName: string;
  psnDisplayName: string;
}

function App()
{
  const [token, setToken] = useState(undefined);
  const [user, setUser] = useState({} as DestinyAccount);

  React.useEffect(() => {
    console.log("token: " + token);
    if (token !== undefined)
    {
      console.log("have token");
      getCharacterData();
    }
  }, [token]);

  async function getCharacterData()
  {
      console.log("in data");
      console.log(token);

      const body = {'grant_type': 'authorization_code', 
                    'code': token,
                    'client_id': get_client_id()};

      const a_token = await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
        method: 'post',
        body: createFormParams(body),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 
                  'X-API-Key': get_api_key()}
      }).then(response => response.json());
      console.log(a_token);

      const user = await fetch('https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/', {
        headers: { 'X-API-Key': get_api_key(),
                   'Authorization': 'Bearer ' + a_token.access_token}
      }).then(response => response.json());

      console.log(user);
      setUser(user.Response);
  }

  var auth_link=`https://www.bungie.net/en/OAuth/Authorize?client_id=${get_client_id()}&response_type=code`;
  return (
    <Router>
          <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <a href={auth_link}>Click here to auth w/ id {get_client_id()}</a>
            <p>
              Destiny stuff Edit <code>src/App.js</code> and save to reload.
            </p>
            We are <b>{is_dev() ? 'currently' : 'not'}</b> currently in dev mode.
            {/* {user.xboxDisplayName && <p>Xbox username: {user.xboxDisplayName} </p>}
            {user.psnDisplayName && <p>PSN username: {user.psnDisplayName} </p>} */}

          </header>

          <Route   render={(props) => (
            <Auth {...props} setToken={setToken} />
          )} />

      </div>
    </Router>

  );
}

function Auth(props: any)
{
  React.useEffect(() => {
    handleToken(props);
  });

  function handleToken(props: any)
  {
    let params = qs.parse(props.location.search);
    console.log("aaa");
    console.log(params);
    props.setToken(params.code as string);
  }

  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

export default App;
