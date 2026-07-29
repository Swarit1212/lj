import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/authContext";
import { MetalRateProvider } from "./context/MetalRateContext";
import { CartProvider } from "./context/CartContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock_google_client_id";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <MetalRateProvider>
            <CartProvider>
              <HelmetProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </HelmetProvider>
            </CartProvider>
          </MetalRateProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
