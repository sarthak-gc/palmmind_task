import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster
      position="top-right"
      richColors
      duration={700}
      style={{
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    />
    <App />
  </>
);
