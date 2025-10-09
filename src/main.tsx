import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

if (!document.getElementById("parity-root")) {
  const rootDiv = document.createElement("div");
  rootDiv.id = "parity-root";
  document.body.appendChild(rootDiv);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.crossOrigin = "anonymous";
  link.href =
    "https://worldwide-fair-payment-client.vercel.app/assets/embed.css";
  document.head.appendChild(link);
}

createRoot(document.getElementById("parity-root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
