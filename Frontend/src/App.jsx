import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

// Pages import
import LiveVerify from "./pages/Live-Verify/Live-Verify";
import Register from "./pages/Register/Register";
import Verify from "./pages/Verify/Verify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrap */}
        <Route path="/" element={<Layout />}>
          {/* Default Page */}
          <Route index element={<LiveVerify />} />

          {/* Routes */}
          <Route path="live" element={<LiveVerify />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<Verify />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
