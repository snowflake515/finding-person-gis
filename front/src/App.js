import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Wrapper } from './components/Wrapper';
import Header from './components/Header';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';

export default function App() {
  return (
    <BrowserRouter>
      <Wrapper>
        <Header />
        <Routes>
          <Route path="/" exact element={<Page1 />} />
          <Route path="/page2" exact element={<Page2 />} />
          <Route path="/page3" exact element={<Page3 />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  )
}