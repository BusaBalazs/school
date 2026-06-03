import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CtxProvider } from "./context/context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CtxProvider>
      <App />
    </CtxProvider>
  </React.StrictMode>
);