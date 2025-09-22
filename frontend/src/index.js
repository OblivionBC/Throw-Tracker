import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DataChangeProvider } from "./componenents/contexts/DataChangeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DataChangeProvider>
      <App />
    </DataChangeProvider>
  </React.StrictMode>
);

reportWebVitals();
