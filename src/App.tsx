import React from 'react';
import { useEffect, useState } from 'react';
import { Top, Customer, Map, Files, HomepageLayout, Graph } from './components/index';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HeaderMenu, FooterMenu } from './components/index';

import { useCookies } from 'react-cookie';

import './i18n/configs';
import axios, { AxiosRequestConfig } from 'axios';

import * as fetchIntercept from 'fetch-intercept';
import { Icon, Segment, TransitionablePortal } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(['react_access_token']);
  const [accessToken, setAccessToken] = useState<string | null>(cookies.react_access_token);
  const [openError, setOpenError] = useState<boolean>(false);
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    config.headers = { Authorization: `Bearer ${accessToken}` };
    return config;
  });
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        //Cookie削除
        setCookie('react_access_token', null);
        setAccessToken(null);
      }
      setOpenError(true);
      setTimeout(() => {
        setOpenError(false);
      }, 3000);
      return Promise.reject(error);
    },
  );

  useEffect(() => {
    if (accessToken == null) {
      fetchIntercept.clear();
    } else {
      fetchIntercept.register({
        request: function (url, config) {
          const modifiedHeaders = new Headers(config.headers);
          modifiedHeaders.append('Authorization', `Bearer ${accessToken}`);
          config.headers = modifiedHeaders;
          return [url, config];
        },
        response: (response) => {
          console.log(response);
          if (response.status === 401) {
            //Cookie削除
            setCookie('react_access_token', null);
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
        <HomepageLayout setAccessToken={setAccessToken} setCookie={setCookie} />
      ) : (
        <>
          <HeaderMenu accessToken={accessToken} /> {/* ヘッダー */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Top />} /> {/* トップ */}
              <Route path="/customer" element={<Customer />} /> {/* 顧客一覧 */}
              <Route path="/map" element={<Map />} /> {/* 地図 */}
              <Route path="/files" element={<Files />} /> {/* ファイル */}
              <Route path="/graph" element={<Graph />} /> {/* グラフ */}
            </Routes>
          </BrowserRouter>
          <FooterMenu /> {/* フッター */}
          {/*
            処理失敗時のメッセージ表示部
           */}
          <TransitionablePortal open={openError}>
            <Segment style={{ left: '40%', position: 'fixed', top: '10%', zIndex: 1000 }}>
              <p>
                <Icon color="red" name="exclamation triangle" />
                {t('message.error')}
              </p>
            </Segment>
          </TransitionablePortal>
        </>
      )}
    </React.Fragment>
  );
}

export default App;
