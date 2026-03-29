import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
// import Home from "./pages/Home";
// import Camera from "./pages/Camera";
// import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrap */}
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Home />} /> */}
          {/* <Route path="camera" element={<Camera />} />
          <Route path="login" element={<Login />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
