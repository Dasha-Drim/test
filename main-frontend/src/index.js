import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './utils/bootstrap.min.css';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router } from "react-router-dom";
import API from './utils/API';
import axios from 'axios';

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEN from './assets/locales/en/translation.json';
import translationRU from './assets/locales/ru/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  }
};

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    // Options for language detector
    detection: {
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
    // react: { useSuspense: false },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
  })

const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Loading..</h3>
  </div>
)

ReactDOM.render(
  <Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Suspense>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
/*
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.js');
}*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/serviceWorker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

window.onbeforeunload = async () => {
  await API.post('/users/offline');
}


if (!localStorage.getItem("visitor")) {
  axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=70e42c803e62485bb539d16d56c9faf4').then(async (response) => {
    await API.post('/visitors', {city: response.data.city, country: response.data.country, new: true});
    localStorage.setItem("visitor", "true")
  }).catch(error => {
    console.log(error);
  });
} else API.post('/visitors', {new: false});
