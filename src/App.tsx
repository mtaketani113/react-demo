import React from 'react';
import {useState} from 'react';
import {Top, Customer} from './components/index';
import './App.css';

import {BrowserRouter, Routes , Route} from "react-router-dom";

import {HeaderMenu, FooterMenu} from './components/index';

import { GoogleLogin } from 'react-google-login';
import { useCookies } from "react-cookie";

import "./i18n/configs"

function App() {

  const clientId:string = process.env.REACT_APP_CLIENT_ID == null? "": process.env.REACT_APP_CLIENT_ID ;
  const [cookies, setCookie] = useCookies(["react_access_token"]);
  const [accessToken, setAccessToken] = useState<string>(cookies.react_access_token);
  return (
    <React.Fragment>
      {accessToken == null ? (
            <GoogleLogin
               clientId={clientId}
               buttonText="LOGIN WITH GOOGLE"
               onSuccess={(response) => {
                if ('accessToken' in response) {
                  setAccessToken(response.accessToken);
                  setCookie("react_access_token", response.accessToken);
                }
                console.log(response)
                console.log("Google Login success")}}
               onFailure={(err) => console.log("Google Login failed", err)}
               cookiePolicy={'single_host_origin'}
            />
            ) : (
              <><HeaderMenu /><BrowserRouter>
              <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/customer" element={<Customer accessToken={accessToken} />} />
              </Routes>
            </BrowserRouter><FooterMenu /></>
            )}

    </React.Fragment>
  );
}

export default App;
