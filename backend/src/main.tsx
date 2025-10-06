// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserProvider } from "./context/UserContext";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
   <ThemeProvider>
  <UserProvider>
    <AppWrapper>
      <App />
    </AppWrapper>
  </UserProvider>
</ThemeProvider>
  // </StrictMode>
);
