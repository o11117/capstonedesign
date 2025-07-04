import React from 'react'
import { useParams } from 'react-router-dom'
import { useMyTravelStore } from '../store/useMyTravelStore'
import styles from '../assets/MyTravelDetailPage.module.css'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const MyTravelDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { courses } = useMyTravelStore()
  const userId = useAuthStore((state) => state.userId)
  console.log('[MyTravelDetailPage] userId:', userId)
  const course = courses.find((c) => c.id === id)

  // course가 없어도 항상 선언, useMemo로 days를 캐싱
  const days = React.useMemo(() => {
    if (!course) return {};
    return course.items.reduce<{ [day: string]: typeof course.items }>((acc, item) => {
      const dayKey = item.day || 'Day 1';
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push({
        ...item,
        title: item.title || '',
        firstimage: item.firstimage || '',
        contentid: typeof item.placeId === 'string' ? parseInt(item.placeId) || 0 : item.contentid || 0,
        time: item.time || '',
        contenttypeid: item.contenttypeid || 0,
      });
      return acc;
    }, {});
  }, [course]);

  const [placeInfoMap, setPlaceInfoMap] = React.useState<Record<number, { title: string; firstimage: string }>>({});

  const fetchPlaceInfo = async (contentid: number, contenttypeid: number) => {
    try {
      const res = await fetch(
        `https://apis.data.go.kr/B551011/KorService1/detailCommon1?ServiceKey=${import.meta.env.VITE_API_KEY1}&MobileOS=ETC&MobileApp=MyApp&contentId=${contentid}&contentTypeId=${contenttypeid}&defaultYN=Y&firstImageYN=Y&_type=json`
      );
      const data = await res.json();
      const item = data.response?.body?.items?.item?.[0];
      return {
        title: item?.title || '',
        firstimage: item?.firstimage || '',
      };
    } catch (err) {
      console.error('TourAPI fetch failed for contentid:', contentid, err);
      return { title: '', firstimage: '' };
    }
  };

  React.useEffect(() => {
    const missing = Object.values(days)
      .flat()
      .filter(p => !placeInfoMap[p.contentid] && p.contentid && p.contenttypeid);

    if (!missing.length) return;

    const fetchAll = async () => {
      const updates: Record<  number, { title: string; firstimage: string }> = {};
      await Promise.all(
        missing.map(async (p) => {
          const info = await fetchPlaceInfo(p.contentid, p.contenttypeid);
          updates[p.contentid] = info;
        })
      );
      setPlaceInfoMap((prev) => ({ ...prev, ...updates }));
    };

    fetchAll();
  }, [days, placeInfoMap]);

  // 숫자 기준으로 오름차순 정렬
  const dayKeys = Object.keys(days).sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, ''), 10)
    const numB = parseInt(b.replace(/[^0-9]/g, ''), 10)
    return numA - numB
  })
  // All 탭 추가
  const allKey = 'All'
  const tabKeys = [allKey, ...dayKeys]
  // useState는 항상 첫 렌더링 때만 dayKeys[0]을 씁니다
  const [selectedDay, setSelectedDay] = React.useState<string>(tabKeys[0] || '')

  // dayKeys가 바뀌어서 selectedDay가 더 이상 없을 때만 리셋
  React.useEffect(() => {
    if (!selectedDay || !tabKeys.includes(selectedDay)) {
      setSelectedDay(tabKeys[0] || '')
    }
    // eslint-disable-next-line
  }, [tabKeys.join(',')]) // tabKeys가 바뀔 때만

  if (!course) return <div>일정 정보를 찾을 수 없습니다.</div>

  const period = course.startDate && course.endDate ? `${course.startDate} — ${course.endDate}` : '날짜 정보 없음'

  return (
    <div className={styles.outerContainer}>
      <main className={styles.mainBox}>
        <div className={styles.titleSection}>
          <h2 className={styles.mainTitle}>{course.title}</h2>
          <div className={styles.dateRange}>{period}</div>
        </div>
        <div className={styles.dayTabWrapper}>
          {tabKeys.map((dayKey) => (
            <button key={dayKey} className={`${styles.dayTabBtn} ${selectedDay === dayKey ? styles.activeDayTab : ''}`} onClick={() => setSelectedDay(dayKey)} type="button">
              {dayKey === allKey ? 'All' : dayKey}
            </button>
          ))}
        </div>
        <div className={styles.timelineSection}>
          <div className={styles.timeline}>
            <div className={styles.verticalLine} />
            <div className={styles.dayCards}>
              {selectedDay === allKey ? (
                // All 탭: 날짜별로 그룹핑해서 출력
                dayKeys.map((dayKey) => (
                  <div className={styles.dayGroup} key={dayKey}>
                    <div className={styles.dayBadge}>{dayKey}</div>
                    <div className={styles.cardsWrapper}>
                      {(days[dayKey] || [])
                        .slice()
                        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                        .map((place) => (
                          <div className={styles.placeCard} key={place.contentid}>
                            <div className={styles.placeCardImageWrap}>
                              <img src={placeInfoMap[place.contentid]?.firstimage || '/noimage.jpg'} alt={place.title} className={styles.placeCardImage} />
                            </div>
                            <div className={styles.placeCardContent}>
                              <div className={styles.placeTitleRow}>
                                <div>
                                  <strong className={styles.placeTitle}>{placeInfoMap[place.contentid]?.title || place.title}</strong>
                                  {place.groupName && <span className={styles.placeGroup}>{place.groupName}</span>}
                                </div>
                                <button className={styles.detailBtn} onClick={() => navigate(`/detail/${place.contentid}/${place.contenttypeid}`)}>
                                  상세 정보 {'>'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.dayGroup}>
                  <div className={styles.dayBadge}>{selectedDay}</div>
                  <div className={styles.cardsWrapper}>
                    {(days[selectedDay] || [])
                      .slice()
                      .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                      .map((place) => (
                        <div className={styles.placeCard} key={place.contentid}>
                          <div className={styles.placeCardImageWrap}>
                            <img src={placeInfoMap[place.contentid]?.firstimage || '/noimage.jpg'} alt={place.title} className={styles.placeCardImage} />
                          </div>
                          <div className={styles.placeCardContent}>
                            <div className={styles.placeTitleRow}>
                              <div>
                                <strong className={styles.placeTitle}>{placeInfoMap[place.contentid]?.title || place.title}</strong>
                                {place.groupName && <span className={styles.placeGroup}>{place.groupName}</span>}
                              </div>
                              <button className={styles.detailBtn} onClick={() => navigate(`/detail/${place.contentid}/${place.contenttypeid}`)}>
                                상세 정보 {'>'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <button className={styles.fabBtn}>+ 여행지 추가</button>
    </div>
  )
}

export default MyTravelDetailPage
