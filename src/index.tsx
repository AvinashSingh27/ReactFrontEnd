import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Container/App';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import {BrowserRouter} from "react-router-dom"
import { Provider } from 'react-redux';
import { store } from './Storage';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
<Provider store={store}>
 <BrowserRouter>
 <ToastContainer></ToastContainer>
 <App></App>
 </BrowserRouter>
 </Provider>
);



