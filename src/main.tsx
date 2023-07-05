import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { persistor, store } from "./redux/store"; // Must be imported before PersistGate

import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import router from "./router/router";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Spinner from "./pages/Admin/views/Spinner/Spinner";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<Spinner />}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App>
              <RouterProvider router={router} />

              <ToastContainer />
            </App>
          </PersistGate>
        </Provider>
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);
