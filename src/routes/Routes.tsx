import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import LoginPage from '../pages/LoginPage'
import '../assets/Routes.css'
import SignupPage from '../pages/SignupPage.tsx'
import MyPage from '../pages/MyPage.tsx'
import Test from '../pages/test.tsx'
import SearchTest from '../pages/SearchTest.tsx'
import DetailPage from '../pages/DetailPage.tsx'
import AiSearchPage from '../pages/AiSearchPage.tsx'
import MyTravelPage from '../pages/MyTravelPage.tsx'
import MyTravelDetailPage from '../pages/MyTravelDetailPage.tsx'
const Router = () => {
  React.useEffect(() => {
    console.log('Routes loaded')
  }, [])

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <BrowserRouter>
        <div className="pages-container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          <Nav />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/test" element={<Test />} />
              <Route path="/searchtest" element={<SearchTest />} />
              <Route path="/detail/:id/:typeid" element={<DetailPage />} />
              <Route path="/AiSearch" element={<AiSearchPage />} />
              <Route path="/mytravel" element={<MyTravelPage />} />
              <Route path="/mytravel/:id" element={<MyTravelDetailPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default Router
