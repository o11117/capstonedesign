// src/pages/TestPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../assets/HotCourses.module.css'
import course1 from '/course1.jpg' // 더미 이미지 (fallback용)

interface TourItem {
  contentid: string
  title: string
  addr1: string
  firstimage?: string
}

const TestPage: React.FC = () => {
  const [data, setData] = useState<TourItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCount, setShowCount] = useState(9)
  const navigate = useNavigate()
  const API_KEY = import.meta.env.VITE_API_KEY1

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        let all: TourItem[] = []
        let page = 1
        let totalCount = 0
        const numOfRows = 100
        do {
          const res = await fetch(
            `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?` +
              `serviceKey=${API_KEY}` +
              `&numOfRows=${numOfRows}` +
              `&pageNo=${page}` +
              `&MobileOS=ETC` +
              `&MobileApp=TestApp` +
              `&_type=json` +
              `&contentTypeId=25` +
              `&areaCode=1`,
          )
          if (!res.ok) throw new Error('API 호출 실패')
          const json = await res.json()
          const items = json.response.body.items.item as TourItem | TourItem[] | undefined
          const arr = items ? (Array.isArray(items) ? items : [items]) : []
          all = all.concat(arr)
          totalCount = json.response.body.totalCount
          page++
        } while (all.length < totalCount && page <= Math.ceil(totalCount / numOfRows))
        setData(all)
      } catch (e) {
        console.error(e)
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchTourData()
  }, [API_KEY])

  // 데이터 전체 셔플 (랜덤 순서)
  const shuffledData = React.useMemo(() => {
    if (data.length <= 1) return data
    const arr = [...data]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [data])

  if (loading) return <p>불러오는 중...</p>
  if (error) return <p>에러 발생: {error}</p>

  return (
    <div style={{ padding: 20 }}>
      <h1 className={styles.courseh1}>🌟 이런 여행 코스는 어떠세요?</h1>
      <div className={styles.hotCourses}>
        <div className={styles.courseList}>
          {shuffledData.slice(0, showCount).map((course) => (
            <div
              key={course.contentid}
              className={styles.courseCard}
              onClick={() => navigate(`/detail/${course.contentid}/25`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={course.firstimage || course1} alt={course.title} className={styles.courseImage} />
              <h3>{course.title}</h3>
              <p>{course.addr1 || '주소 정보 없음'}</p>
              <button
                className={styles.detailBtn}
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/detail/${course.contentid}/25`)
                }}
              >
                자세히 보기
              </button>
            </div>
          ))}
        </div>
        {shuffledData.length > showCount && (
          <button
            style={{ margin: '24px auto 0', display: 'block', padding: '12px 32px', fontSize: '1rem', borderRadius: '8px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}
            onClick={() => setShowCount(c => c + 3)}
          >
            더보기
          </button>
        )}
      </div>
    </div>
  )
}

export default TestPage
