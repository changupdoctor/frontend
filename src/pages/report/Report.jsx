import React, { useEffect, useState } from 'react';
import './Report.css';
import http from '../../api/http';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import Card from "../../components/Card";
import Menu from "../../components/Menu";
import gpt from "../../assets/chatgpt.png"
import Loader from '../../components/Loader';
import Error from '../../components/Error';

function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const { city = '', addr = '', selectedValue1 = '', selectedValue2 = '', data } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(10);
  const [message, setMessage] = useState("");
  const [bgColor1, setBgColor1] = useState("");
  const [bgColor2, setBgColor2] = useState("");
  const [bgColor3, setBgColor3] = useState("");
  const [bgColor4, setBgColor4] = useState("");
  const [bgColor5, setBgColor5] = useState("");
  const [error, setError] = useState(false);
  const storedUserName = sessionStorage.getItem('userName');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.post("/analysis/main", data);
        setResponseData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    if (loading) return; // 데이터 로딩 중에는 실행하지 않음

    const storedUserName = sessionStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }

    
    if (responseData && responseData.indicator && responseData.indicator.v_desc) {
      const desc = responseData.indicator.v_desc;
      if (desc === "정체") {
        setBgColor4('#FF8700'); // 주황색 배경
      } else if (desc === "상권확장") {
        setBgColor4('#4BA83D'); // 녹색 배경
      } else {
        setBgColor4('#DC3434'); // 빨간색 배경
      }
    }
    if (responseData && responseData.gptResponse) {
      const colorsArray = responseData.gptResponse.split(',');
      console.log(colorsArray);
      colorsArray.forEach((color, index) => {
        let bgColor;
        if (color === "황색") {
          bgColor = '#FF8700'; // 주황색 배경
        } else if (color === "녹색") {
          bgColor = '#4BA83D'; // 녹색 배경
        } else {
          bgColor = '#DC3434'; // 빨간색 배경
        }
        if (index === 0) {
          setBgColor1(bgColor);
        } else if (index === 1) {
          setBgColor2(bgColor);
        } else if (index === 2) {
          setBgColor3(bgColor);
        }
      });
    }
  }, [loading, responseData, score, userName]);
  
  useEffect(() => {
    const colorScores = {
      '#DC3434': 1,  // 빨간색
      '#FF8700': 2, // 주황색
      '#4BA83D': 3, // 녹색
    };
    
    const colors = [bgColor1, bgColor2, bgColor3, bgColor4];
    const totalScore = colors.reduce((acc, color) => {
      return acc + (colorScores[color] || 0);
    }, 0);
    let finalColor;
    if (totalScore <= 4) {
      finalColor = '#DC3434'; // 빨간색
      setMessage(`${storedUserName}님의 창업 전망은 위험해요!`);
    } else if (totalScore <= 9) {
      finalColor = '#FF8700'; // 주황색
      setMessage(`${storedUserName}님의 창업 전망은 주의가 필요해요!`);
    } else {
      finalColor = '#4BA83D'; // 녹색
      setMessage(`${storedUserName}님의 창업 전망은 밝아요!`);
    }
    setBgColor5(finalColor);
  }, [bgColor1, bgColor2, bgColor3, bgColor4]);
  const cards = Array.from({ length: 13 }, (_, index) => index + 1);
  const handleNavigation = () => {
    navigate('/map', { state: { city, addr, selectedValue1, selectedValue2, data } });
  };
  if (loading) {
    return <Loader message={`${storedUserName}님의 진단 결과를 가져오는 중이에요..`}/>;
  }

  if (error || !responseData ) {
    return <Error />;
  }
  return (
    <div className="background">
      <div class="mx-auto max-w-2xl rounded-3xl lg:mx-0 lg:flex lg:max-w-none">
        <div class="p-8 lg:flex-auto">
          <div class="mx-auto max-w-2xl rounded-3xl bg-gray-50 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none ">
            <div class="pl-10 py-8 lg:flex-auto overflow-auto h-[80vh]" id="scrollbar5">
              {/* <div className="fixed"> */}
                <p class="text-4xl">{storedUserName}님의 창업 진단 리포트</p> 
              {/* </div> */}
              <div className="pl-20">
                <Menu cards={12} />
                {cards.map(card => (
                  <Card key={card} card={card} city={city} addr={addr} selectedValue1={selectedValue1} selectedValue2={selectedValue2} responseData={responseData}/>
                ))}
              </div>
              <div class="mt-10 flex items-center gap-x-4">
              </div>
            </div>
            <div class="lg:mt-0 lg:w-1/3 lg:max-w-md lg:flex-shrink-0">
              <div class="bg-gray-100 text-center rounded-tr-3xl rounded-br-3xl lg:flex lg:flex-col lg:justify-center">
                <div class="px-6 py-4 lg:flex lg:flex-1 lg:justify-end">
                  <a href="/" class="text-lg font-semibold leading-6 text-gray-900"><ChevronLeftIcon className="w-6 h-6" aria-hidden="true" /></a>
                </div>
                <p class="px-10 mb-2 text-start text-3xl">{storedUserName}님의 창업 전망 신호등</p>
                <div className="my-4 px-10 flex justify-start">
                  <img className="w-10 h-10" src={gpt} alt="" />
                  <p class="px-2 my-auto text-start text-2xl align-middle">ChatGPT의 지표 평가</p>
                </div>
                <div className="flex flex-col items-start mt-4 px-10">
                  <div className="signal-indicator">
                    <span className="text-2xl">예상 매출액</span>
                    <div style={{ backgroundColor: bgColor1 }} className="dot"></div>
                  </div>
                  <div className="signal-indicator">
                    <span className="text-2xl">예상 매출액 추이</span>
                    <div style={{ backgroundColor: bgColor2 }} className="dot"></div>
                  </div>
                  <div className="signal-indicator">
                    <span className="text-2xl">주고객 연령적합도</span>
                    <div style={{ backgroundColor: bgColor3 }} className="dot"></div>
                  </div>
                  <div className="signal-indicator">
                    <span className="text-2xl">상권변화지표</span>
                    <div style={{ backgroundColor: bgColor4 }} className="dot"></div>
                  </div>
                  <div className="flex signal-indicator mb-0">
                    <span class="text-3xl align-middle my-auto align-middle">종합 평가</span> 
                    <div style={{ backgroundColor: bgColor5 }} className="h-8 w-8 rounded-full dotdot"></div>
                  </div>
                  <div className="w-full flex justify-center mt-4">
                    <span class="text-xl">{message}</span> 
                  </div>
                </div>
                <div class="mx-auto max-w-xs px-8 my-10 rounded-3xl bg-gray-200 shadow-xl">
                  <p class="mt-10 flex items-baseline justify-center gap-x-2">
                    <span class="text-3xl tracking-tight text-gray-900 break-all">창업 희망 지역 매출,</span>
                  </p>
                  <p class="mt-2 flex items-baseline justify-center gap-x-2">
                    <span class="text-3xl tracking-tight text-gray-900 break-all">임대료 궁금하다면?</span>
                  </p>
                  <button onClick={handleNavigation} className="my-10 block w-full rounded-full bg-[#5D70DF] px-3 py-2 text-center text-lg text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">상권 정보 보러가기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="welcome-message text-xl">
          <p>{`환영합니다, ${storedUserName} 님`}</p>
        </div>
      </div>
    </div>
  );
}

export default Report;