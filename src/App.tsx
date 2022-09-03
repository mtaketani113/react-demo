import React from 'react';
import {useEffect, useState} from 'react';
import {Top, Customer, Map, Files} from './components/index';
import './App.css';

import {BrowserRouter, Routes , Route} from "react-router-dom";

import {HeaderMenu, FooterMenu} from './components/index';

import { GoogleLogin } from 'react-google-login';
import { useCookies } from "react-cookie";

import "./i18n/configs"
import axios from 'axios';

import * as fetchIntercept from 'fetch-intercept';

function App() {

  const clientId:string = process.env.REACT_APP_CLIENT_ID == null? "": process.env.REACT_APP_CLIENT_ID ;
  const [cookies, setCookie] = useCookies(["react_access_token"]);
  const [accessToken, setAccessToken] = useState<string|null>(cookies.react_access_token);
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        //Cookie削除
        setCookie("react_access_token", null);
        setAccessToken(null);
      }
      return Promise.reject(error);
    }
  )

  useEffect(() => {
    if(accessToken == null){
      fetchIntercept.clear();
    }else{
      fetchIntercept.register({
        response: (response) => {
          console.log(response);
          if (response.status === 401) {
            //Cookie削除
            setCookie("react_access_token", null);
            setAccessToken(null);
          }
          return response;
        }
      });  
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  
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
              <><HeaderMenu accessToken={accessToken}
                 setCookie={setCookie} setAccessToken={setAccessToken} /><BrowserRouter>
              <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/customer" element={<Customer accessToken={accessToken} />} />
                <Route path="/map" element={<Map />} />
                <Route path="/files" element={<Files  accessToken={accessToken} />} />
              </Routes>
            </BrowserRouter><FooterMenu /></>
            )}

    </React.Fragment>
  );
}

export default App;
