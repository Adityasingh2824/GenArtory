// frontend/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';  // Import global styles
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // For routing
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux'; // If you are using Redux
import dataReducer from "./store.ts";

const store = configureStore({
  reducer: {
    clientReduxStore: dataReducer,
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
