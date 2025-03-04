import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Router = () => {
  return (
    <BrowserRouter>
      <div className='pages-container'>
        <Nav />
        <Routes>
          <Route path='/' element={<MainPage />} />
          {/* 여기에 다른 Route 추가 */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default Router;
