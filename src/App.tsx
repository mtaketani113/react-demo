import React from 'react';
import {useEffect, useState} from 'react';
import {Top, Customer, Map, Files} from './components/index';
import './App.css';

import {BrowserRouter, Routes , Route} from "react-router-dom";

import {HeaderMenu, FooterMenu} from './components/index';

import { GoogleLogin } from 'react-google-login';
import { useCookies } from "react-cookie";

import "./i18n/configs"
import axios, { AxiosRequestConfig } from 'axios';

import * as fetchIntercept from 'fetch-intercept';

function App() {

  const clientId:string = process.env.REACT_APP_CLIENT_ID == null? "": process.env.REACT_APP_CLIENT_ID ;
  const [cookies, setCookie] = useCookies(["react_access_token"]);
  const [accessToken, setAccessToken] = useState<string|null>(cookies.react_access_token);
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    config.headers = { Authorization: `Bearer ${accessToken}` }
    return config
  })
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
        request: function(url, config) {
          const modifiedHeaders = new Headers(config.headers);
          modifiedHeaders.append('Authorization', `Bearer ${accessToken}`);
          config.headers = modifiedHeaders;
          return [url, config];
        },
        response: (response) => {
          console.log(response);
          if (response.status === 401) {
            //Cookie削除
            setCookie("react_access_token", null);
            setAccessToken(null);
          }
          return response;
        },
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
              <><HeaderMenu accessToken={accessToken} /><BrowserRouter>
              <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/map" element={<Map />} />
                <Route path="/files" element={<Files />} />
              </Routes>
            </BrowserRouter><FooterMenu /></>
            )}

    </React.Fragment>
  );
}

export default App;
