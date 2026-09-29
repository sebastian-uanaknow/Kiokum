import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KiokumHome } from "./screens/KiokumHome";
import { Register } from "./screens/Register";
import { Login } from "./screens/Login";
import { Dashboard } from "./screens/Dashboard";
import { Content } from "./screens/Content";
import { HowItWorks } from "./screens/HowItWorks";
import { PrivacyPolicy } from "./screens/PrivacyPolicy";
import { TermsAndConditions } from "./screens/TermsAndConditions";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KiokumHome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<Content />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
