import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import ClerkConfig from "./context/ClerkConfig.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ClerkConfig>
      <AppContextProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppContextProvider>
    </ClerkConfig>
  </BrowserRouter>
);
