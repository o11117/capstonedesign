import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import styles from '../assets/LoginPage.module.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import GoogleLoginButton from '../components/GoogleLoginButton.tsx'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post('https://port-0-planit-mcmt59q6ef387a77.sel5.cloudtype.app/api/auth/login', {
        email,
        password,
      })

      const { user_id, name, token, phone } = response.data // 서버에서 받은 사용자 정보
      console.log('로그인 성공', response.data.token)
      // 상태 저장
      login({ userId: user_id, name, token, email, phone })
      // 로그인 성공 후 마이페이지로 이동
      navigate('/')
    } catch (err) {
      console.error('로그인 실패:', err)
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.loginContainer}>
        <h1>Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>

        {error && <p className={styles.error}>{error}</p>}

        <div>
          <Link to="/signup">회원가입</Link>
        </div>

        <div style={{ marginTop: '20px' }}>
          <GoogleLoginButton />
        </div>
      </div>
    </form>
  )
}

export default LoginPage
