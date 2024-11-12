import React, { useEffect, useState } from 'react';
import { Map, Circle, CustomOverlayMap, MapMarker } from 'react-kakao-maps-sdk';
import './MapPage.css';
import http from '../../api/http';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScheduleMeeting } from 'react-schedule-meeting';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import Loader from '../../components/Loader';

const { kakao } = window;

function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { city, addr, selectedValue1, selectedValue2, data} = location.state || {};
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };
  const toReport = () => {
    navigate('/report', { state: { city, addr, selectedValue1, selectedValue2, data } });
  }
  const [state, setState] = useState({
    center: {     
      lat: 35.205739,
      lng: 126.8115825,
    },
    errMsg: null,
    isLoading: true,
  })
  const [currentDong, setCurrentDong] = useState({
    lat: 35.205739,
    lng: 126.8115825,
  });
  
  const [region, setRegion] = useState("철산동");
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState("카페/음료");
  const [estateData, setEstateData] = useState([
    {
      type: '소형 사무실',
      rent: '월세 1100/10',
      space: '151/80m2'
    },
    {
      type: '상가',
      rent: '월세 1100/10',
      space: '151/80m2'
    },                 
  ]);
  const [bankData, setBankData] = useState([
    {
      branchName: '하안동',
      branchAddress: '경기도 광명시 하안동 범안로 1049 (하안동)',
      branchId: 'BBID010',
      center: [{
        lat: 37.4590598,
        lng: 126.8698947,
      }],
      isOpen: false,
    },
    {
      branchName: '철산동',
      branchAddress: '경기도 광명시 철산동 철산로 16 (철산동)',
      branchId: 'BBID011',
      center: [{
        lat: 37.4756937,
        lng: 126.8680352,
      }],
      isOpen: false,
    }
  ]);
  const toggleInfoWindow = (branchId) => {
    setBankData(bankData.map(bank => {
      if (bank.branchId === branchId) {
        return { ...bank, isOpen: !bank.isOpen };
      } else {
        return { ...bank, isOpen: false };
      }
    }));
  };
  const [businessData, setBusinessData] = useState([
    {
      dongName: '철산 3동',
      salesAmount: 78,
      lat: 37.47538479735877,
      lng: 126.87080360792716,
    },
    {
      dongName: '철산 4동',
      salesAmount: 78,
      lat: 37.4758479735877,
      lng: 126.87080360792716
    },
  ])
  const [selectedBank, setSelectedBank] = useState(null); // 선택된 은행 상태
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태
  const availableTimeslots = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(new Date().setDate(new Date().getDate() + i));
    const day = date.getDay(); // getDay() returns 0 for Sunday and 6 for Saturday
    if (day !== 0 && day !== 6) { // Exclude Sunday (0) and Saturday (6)
      availableTimeslots.push({
        id: i,
        startTime: new Date(new Date(date).setHours(10, 0, 0, 0)),
        endTime: new Date(new Date(date).setHours(16, 0, 0, 0)),
      });
    }
  }
  
  useEffect(() => {
    setUserId(sessionStorage.getItem('userId'));
  }, []); // 마운트 시 한 번만 실행
  const [selectedTime, setSelectedTime] = useState(null);
  const handleTimeSelect = (time) => {
    console.log(time); // 선택된 시간 정보를 콘솔에 출력
    setSelectedTime(time.startTime);
  };
  const reserve = async () => {
    console.log(selectedBank.branchId);
    const reserveData = {
      user_id: userId,
      reserve_time: selectedTime ? formatDate(selectedTime) : ''
    };
    console.log("Reservation Data:", reserveData);
    try {
      const response = await http.post(`/analysis/reservation/${selectedBank.branchId}`, reserveData);
      setSuccessMessage('상담 예약이 완료되었습니다.')
      console.log(response.data);
    } catch (error) {
      console.error('Error during reservation request:', error);
      if (error.response && error.response.status === 409) {
        setErrorMessage('이미 선택된 시간입니다.');
      } else {
        setErrorMessage('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };
  // 모달 열기 함수
  const openModal = (branchId) => {
    const selected = bankData.find(bank => bank.branchId === branchId);
    setSelectedBank(selected);
    setModalOpen(true);
  };
  // 모달 닫기 함수
  const closeModal = () => {
    setSelectedBank(null);
    setModalOpen(false); 
    setSuccessMessage(null)
  };
  const colors = [
    "#1E90FF", // DodgerBlue
    "#FF4500", // OrangeRed
    "#32CD32", // LimeGreen
    "#FFD700", // Gold
    "#8A2BE2", // BlueViolet
    "#FF1493", // DeepPink
    "#00CED1", // DarkTurquoise
    "#FF6347", // Tomato
    "#4682B4", // SteelBlue
    "#DAA520"  // GoldenRod
  ];
  
  const getRandomColor = (index) => {
    return colors[index % colors.length];
  };
  // 현재 위치를 가져올 함수
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        },
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: '현위치를 알고 싶다면 위치를 허용해주세요.',
        isLoading: false,
      }));
    }
  }, []);
  useEffect(() => {
    const fetchEstateData = async () => {
      try {
        const response = await http.post(`/analysis/region/${city}`, {
          category1: selectedValue1,
          category2: selectedValue2,
          region_city: city,
          region_dong: addr
        });
        console.log(response.data);
        // bankData에 isOpen을 추가하여 초기화
        const banksWithIsOpen = response.data.branches.map(branch => ({
          ...branch,
          isOpen: false
        }));
        setRegion(response.data.legalDongName)
        setBankData(banksWithIsOpen);
        const processedDongPositions = response.data.dongPositions.map(dong => ({
          ...dong,
          salesAmount: dong.salesAmount ? Math.floor(dong.salesAmount / 10000) : 0 // salesAmount가 없으면 기본값 0 설정
        }));
        setBusinessData(processedDongPositions);
        const filteredData = businessData.filter(item => item.salesAmount !== undefined && item.salesAmount !== null);
        setEstateData(response.data.properties);
        const currentDong = processedDongPositions.find((dong) => dong.dongName === addr);
        setCurrentDong(currentDong);
        setLoading(false); // 데이터 로딩 완료
      } catch (error) {
        console.error('데이터 불러오기 실패!:', error);
      }
    };

    fetchEstateData();
  }, [city, addr, selectedValue1, selectedValue2]);
  if (loading) {
    return <Loader message="상권 정보를 가져오는 중이에요.."/>;
  }
  
  return (
    <div className="background">
      <Map className='map'
        center={{lat: currentDong.lat, lng: currentDong.lng}}
        level={3}
      >
      {businessData.map((item, index) => {
        if (item.salesAmount === 0 || item.salesAmount == undefined) return null; // salesAmount가 0이면 표시하지 않음
        const minSalesAmount = Math.min(...businessData.map(item => item.salesAmount));
        const maxSalesAmount = Math.max(...businessData.map(item => item.salesAmount));
        const randomColor = getRandomColor(index);
        const rgbaColor = randomColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
        console.log(rgbaColor);
        const logScale = (value, min, max) => {
          const logMin = Math.log(min);
          const logMax = Math.log(max);
          const logValue = Math.log(value);
          return ((logValue - logMin) / (logMax - logMin)) * (maxSize - minSize) + minSize;
        };
        
        // 최소 및 최대 크기 설정
        const minSize = 100; // 최소 크기
        const maxSize = 250; // 최대 크기        
        const size = logScale(item.salesAmount, minSalesAmount, maxSalesAmount)
        return (
        <>
          <CustomOverlayMap position={{lat: item.lat, lng: item.lng}} zIndex={1}>
            <div
              className="map-circle"
              style={{
                width: size + 'px',
                height: size + 'px',
                backgroundColor: rgbaColor,
                border: 'white 3px solid',
              }}
            ></div>
          </CustomOverlayMap>
          <CustomOverlayMap
            position={{lat: item.lat, lng: item.lng}}
            zIndex={1}
          >
            <div style={{ transform: 'translate(-5%, -5%)' }} className="text-center circle">              
            <p className="text-white text-2xl">
              {item.salesAmount >= 10000 
                ? `${(item.salesAmount / 10000).toFixed(1)} 억원`
                : `${item.salesAmount} 만원`}
            </p>
              <p className="text-white text-xl">
                {item.dongName}
              </p>
            </div>
          </CustomOverlayMap>
        </>
        )
      })}
      {bankData.map((item, index) => (
        <>
          <MapMarker // 마커를 생성합니다
            position={item.center[0]}
            zIndex={3}
            image={{
              src: "./hana.png", // 마커이미지의 주소
              size: {
                width: 45,
                height: 60,
              }, // 마커이미지의 크기입니다
              options: {
                offset: {
                  x: 27,
                  y: 69,
                }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
              },
            }}
            onClick={() => toggleInfoWindow(item.branchId)}
          />
          {item.isOpen && (
          <CustomOverlayMap 
            zIndex={2}
            position={item.center[0]}>
            <div className={`wrap ${item.isOpen ? 'show' : ''}`}>
              <div className="info">
                <div className="title">
                  {item.branchName} 지점
                  <div
                    className="close"
                    onClick={() => toggleInfoWindow(item.branchId)}
                    title="닫기"
                  ></div>
                </div>
                <div className="body">
                  <div className="desc">
                    <div className="ellipsis">
                      {item.branchAddress}
                    </div>
                    <div className="jibun ellipsis">
                      {item.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomOverlayMap>
        )}
        </>
      ))}
      </Map>
      <div className="flex right-0 absolute z-20">
        <button
          className="px-2 py-2 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg"
          onClick={()=> toReport()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="absolute top-0 left-0 z-20 mx-auto max-w-2xl rounded-3xl sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
        <div class="mt-2 p-8 lg:mt-0 lg:w-full lg:max-w-3xl lg:flex-shrink-0">
          <div class="rounded-2xl bg-white lg:flex lg:flex-col lg:justify-center lg:py-4 reserve-box">
            <div class="py-6 px-6 mb-4">
              <span className="text-2xl font-bold">{region} 상가 임대료</span>
              <div className="mt-2 max-h-40 overflow-y-auto" id="scrollbar5">
                <table className="mt-2">
                  <thead>
                    <tr>
                      <th class="pr-4 text-left text-lg font-large leading-6 text-gray-900">상가 구분</th>
                      <th class="pr-4 text-left text-lg font-large leading-6 text-gray-900">임대료</th>
                      <th class="pr-4 text-left text-lg font-large leading-6 text-gray-900">대지/연면적</th>
                      <th class="pr-4 text-left text-lg font-large leading-6 text-gray-900">주소</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {estateData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="pr-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.type}</td>
                        <td className="pr-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.bojeung}/{item.rentPrice}</td>
                        <td className="pr-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.availSpace}/{item.contractSpace}㎡</td>
                        <td className="pr-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table> 
              </div> 
            </div>
            <div class="px-6 mb-4">
              <span className="text-2xl font-bold">{city} 대출 상담 예약 가능 은행</span>
              <div className="mt-2 max-h-40 overflow-y-auto" id="scrollbar5">
              <table className="mt-2">
                <thead>
                  <tr>
                    <th class="pr-2 text-left text-lg font-large leading-6 text-gray-900">지점명</th>
                    <th class="pr-2 text-left text-lg font-large leading-6 text-gray-900">주소</th>
                    <th class="pr-2 text-left text-lg font-large leading-6 text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bankData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-700">하나은행 {item.branchName} 지점</td>
                      <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-700">{item.branchAddress}</td>
                      <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button key={bankData.branchId}
                        onClick={() => openModal(item.branchId)}
                        class="flex justify-center items-center w-20 relative gap-2.5 px-3 py-1 rounded bg-[#16c098]/[0.38] border border-[#00b087]"><p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#008767]">상담 예약</p></button>
                        {modalOpen && (
                          <div className="fixed inset-0 z-50 flex items-center reserve-box">
                            {/* <div 
                            onClick={closeModal}
                            className="absolute inset-0 bg-gray-800 opacity-0"></div> */}
                            <div className="bg-[#D7E2FF] rounded-lg p-6 max-w-3xl mx-auto reserve-box">
                              <div className="flex justify-between">
                                <span className="pl-3 text-3xl font-bold">{selectedBank.branchName} 지점 예약하기</span>
                                <button
                                  className="px-2 py-2 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg"
                                  onClick={closeModal}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              {errorMessage && (
                                <div id="toast-danger" className="flex items-center w-full max-w-full p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                                  <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                                    </svg>
                                    <span className="sr-only">Error icon</span>
                                  </div>
                                  <div className="ms-3 text-sm font-normal">{errorMessage}</div>
                                  <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" onClick={() => setErrorMessage("")} aria-label="Close">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                  </button>
                                </div>
                              )}
                              {successMessage && (
                                <div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                                  <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                  </svg>
                                    <span className="sr-only">Check icon</span>
                                  </div>
                                  <div className="ms-3 text-sm font-normal">{successMessage}</div>
                                  <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" onClick={() => setSuccessMessage("")} aria-label="Close">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                  </button>
                                </div>
                              )}
                              <ScheduleMeeting
                                borderRadius={10}
                                primaryColor="#5D70DF"
                                eventDurationInMinutes={30}
                                availableTimeslots={availableTimeslots}
                                onStartTimeSelect={handleTimeSelect}
                                locale={ko}
                                lang_emptyListText={"예약 가능한 시간이 없습니다."}
                                lang_goToNextAvailableDayText={"다음 예약 가능한 요일:"}
                              />
                              <div className="flex justify-center">
                                <button
                                  onClick={reserve}
                                  className="bg-[#5D70DF] text-white text-xl px-4 py-2 rounded-full hover:bg-[#D7E2FF] focus:outline-none"
                                >
                                  예약하기
                                </button>
                              </div>                            
                            </div>
                          </div>
                        )}
                      </td>
                    </tr> 
                  ))}
                </tbody>
              </table>
              </div>  
            </div>
            <div class="px-6 mb-4">
              <span className="text-2xl font-bold">{addr} {selectedValue2} 업종 매출액</span>
              <div className="flex justify-center pt-10">
              <svg    
              width="172"    
              height="172"    
              viewBox="0 0 172 172"    
              fill="none"    
              xmlns="http://www.w3.org/2000/svg"    
              class="opacity-90 circle"    
              preserveAspectRatio="xMidYMid meet"  >
                  <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#5D70DF', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#FF8700', stopOpacity: 1 }} />
                      </linearGradient>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                          <feOffset in="blur" dx="0" dy="8" result="offsetBlur"/>
                          <feFlood flood-color="rgba(0,0,0,0.1)" result="offsetColor"/>
                          <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"/>
                          <feMerge>
                          <feMergeNode in="offsetBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                      </filter>
                  </defs>
                  <circle 
                  opacity="0.9" 
                  cx="86" 
                  cy="86" 
                  r="86" 
                  fill="url(#grad1)"
                  filter="url(#shadow)">
                  </circle> 
              </svg> 
                {currentDong && <p className="absolute mt-20 text-white text-2xl">{currentDong.salesAmount >= 10000 
      ? `${(currentDong.salesAmount / 10000).toFixed(1)}억원`
      : `${currentDong.salesAmount} 만원`}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;