import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Router = () => {
  // React의 useEffect를 사용하여 초기 로직 추가
  React.useEffect(() => {
    console.log('Routes loaded');
  }, []);

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
