import React, { useState, useEffect } from 'react';
import ChartComponent from './ChartComponent';
import http from '../api/http.js';
import SynergyInfo from './SynergyInfo.jsx';
import './Card.css';
import Rocket from '../assets/Rocket-small.svg'

function Card ({ card, city, addr, selectedValue1, selectedValue2, responseData}) {
    const [indicator, setIndicator] = useState("");
    const [message, setMessage] = useState("");
    const [bgColor, setBgColor] = useState("");
    const { consequent } = responseData ?? {};
    const [month, setMonth] = useState("7월");
    const formatValue = (value) => {
        if (value >= 100000000) {
          return `${(value / 100000000).toFixed(1)} 억원`;
        } else {
          return `${Math.floor(value / 10000)} 만원`;
        }
      };
    const cardTitles = [
        "진단 요약", "고객 비중 분석", "고객 비중 변화", "유동 인구", "요일별 매출", "시간대별 매출",
        "동종업계 점포 수", "가맹점 수 비율", "이용건수 및 결제단가",
        "매출액 추이", "매출액 예상 변화", "연관분석"
      ];
    const id = `card${card}`;
    const title = cardTitles[card - 1];
    const today = new Date();
    const dataSeries1 = [];
    // 30일 동안의 데이터 생성
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const formattedDate = date.toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit'
        });
        dataSeries1.push({ x: formattedDate, y: Math.floor(Math.random() * 10000000) });
    }
    const [salesTrendChart, setSalesTrendChart] = useState( {
        series: [
            {
                name: '예상 매출액',
                data: dataSeries1
            },
        ],
        options: {
            chart: {
                id: 'salesTrendChart',
                type: 'area',
                stacked: false,
                toolbar: {
                    show: true,
                    offsetX: 0,
                    offsetY: 30,
                    tools: {
                      download: true,
                      zoomin: true,
                      zoomout: true,
                      pan: false,
                      reset: false,
                      selection: false,
                    },
                    export: {
                      csv: {
                        filename: undefined,
                        columnDelimiter: ',',
                        headerCategory: 'category',
                        headerValue: 'value',
                        categoryFormatter(x) {
                          return new Date(x).toDateString()
                        },
                        valueFormatter(y) {
                          return y
                        }
                      },
                      svg: {
                        filename: undefined,
                      },
                      png: {
                        filename: undefined,
                      }
                    },
                    autoSelected: 'zoom' 
                  },
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 5, // 마커의 크기 설정, 마커를 항상 보이게 함
                strokeColor: '#FFF', // 마커의 테두리 색상
                strokeWidth: 2, // 마커의 테두리 두께
                hover: {
                  size: 7 // 호버 시 마커의 크기
                }
              },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.5,
                    stops: [0, 90, 100]
                },
            },
            colors: ['#5D70DF'],
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return (val / 10000).toFixed(0) + '만'; // 10000으로 나누고 소수점 없이 표시
                    },
                    style: {
                        fontFamily: 'GongGothicMedium',
                        fontSize: '12px', // Y축 라벨 폰트 크기
                    }
                },
            },
            xaxis: {
                type: 'category',
                tickAmount: 5
            },
            stroke: {
                curve: 'smooth' // 곡선 라인으로 설정
            },
            tooltip: {
                shared: false,
                y: {
                    formatter: function (val) {
                        return (val / 10000).toFixed(0) + ' 만원'; // 10000으로 나누고 "만원" 추가
                    }
                },
                style: {
                    fontFamily: 'GongGothicMedium', 
                    fontSize: '14px', // 툴팁 폰트 크기
                }
            },
            title: {
                text: `창닥AI ${addr} ${selectedValue2} 당월 매출액 변화 예측(만원)`,
                align: 'center', // 'left', 'center', 'right'로 위치 설정
                margin: 10, // 제목과 차트 사이의 여백
                offsetX: 0, // X축 오프셋
                offsetY: 0, // Y축 오프셋
                style: {
                    fontSize: '18px', // 폰트 크기
                    fontFamily: 'GongGothicMedium', // 폰트 패밀리
                    color: '#263238', // 폰트 색상
                }
            },
            
        }
    });
    const processData = (data) => {
        const ageLabels = [
            '10대', '20대', '30대', '40대', '50대', '60대', '70대 이상'
        ];
        const maleChangeData = new Array(ageLabels.length).fill(0);
        const femaleChangeData = new Array(ageLabels.length).fill(0);
    
        data.forEach(item => {
            const ageGroup = parseInt(item.age, 10);
            let ageIndex;
    
            if (ageGroup === 2) ageIndex = 0; // 10대
            else if (ageGroup === 3) ageIndex = 1; // 20대
            else if (ageGroup === 4) ageIndex = 2; // 30대
            else if (ageGroup === 5) ageIndex = 3; // 40대
            else if (ageGroup === 6) ageIndex = 4; // 50대
            else if (ageGroup === 7) ageIndex = 5; // 60대
            else if (ageGroup === 8) ageIndex = 6; // 70대 이상
    
            if (item.sex === 'M') {
                maleChangeData[ageIndex] += item.percentageChange;
            } else if (item.sex === 'F') {
                femaleChangeData[ageIndex] += item.percentageChange;
            }
        });
    
        return { maleChangeData, femaleChangeData };
    };
    const [customerRatioChart, setCustomerRatioChart] = useState(
        {
            options: {
                chart: { 
                  id: 'customer-ratio',
                  stacked: true
                }, 
                colors: ['#68D241', '#FF0D35'],
                xaxis: {
                  type: 'int',
                  categories: [
                    '10대', '20대', '30대', '40대', '50대', '60대', '70대 이상'
                  ],
                  labels: {
                    rotate: -90,
                    style: {
                        fontSize: '14px',
                        fontFamily: 'GongGothicMedium',
                        colors: ['#333'],
                      },
                  }
                },
                yaxis: {
                      labels: {
                        style: {
                          fontSize: '14px',
                          fontFamily: 'GongGothicMedium',
                          colors: ['#333'],
                        },
                      },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                      fontSize: '14px',    // 폰트 크기
                      fontFamily: 'GongGothicMedium',
                      colors: ['#FFF'],
                    },
                    formatter: (value) => `${value}%`, // 데이터 레이블 포매터
                    position: 'top' // 데이터 레이블 위치
                  },
                plotOptions: {
                  bar: {
                    borderRadius: 2,
                    borderRadiusApplication: 'end', // 'around', 'end'
                    borderRadiusWhenStacked: 'all', // 'all', 'last'
                    horizontal: true,
                    barHeight: '80%',
                  },
                },
                title: {
                    text: `최근 1년간 ${selectedValue2} 업종의 성별, 연령별 고객 비중(%)`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                },
                tooltip: {
                    y: {
                        formatter: (value) => `${value.toFixed(2)}%`
                    }
                },
              },
              series: [
                {
                  name: '남성',
                  data: [1.45, 5.42, 5.9, 44, 55, 41, 37]
                },
                {
                  name: '여성',
                  data: [1.1, 4.3, 6.0, 0.44, 55, 41, 37]
                }
              ],
              type: "bar",
              stacked: true
        },
    );
    useEffect(() => {
        if (responseData) {
            const maleData = new Array(7).fill(0);
            const femaleData = new Array(7).fill(0);
            const ageLabels = [
                '10-19세', '20-29세', '30-39세', '40-49세', '50-59세', '60-69세', '70대 이상'
              ];
            responseData.genderAgeDistribution.forEach(item => {
                let index = ageLabels.indexOf(item.ageLabel);
                if (index === -1) { // 70대 이상 처리
                  index = ageLabels.length - 1; // 70대 이상 인덱스로 설정
                }
              
                if (item.sex === 'M') {
                  maleData[index] += parseFloat(item.percentage.toFixed(2));
                } else if (item.sex === 'F') {
                  femaleData[index] += parseFloat(item.percentage.toFixed(2));
                }
              });
            const updatedCustomerRatioChart = {
                ...customerRatioChart,
                series: [
                    { name: '남성', data: maleData },
                    { name: '여성', data: femaleData }
                ]
            };
            setCustomerRatioChart(updatedCustomerRatioChart);
            setChartData(prevData => prevData.map(chart => {
                if (chart.options.chart.id === 'customer-ratio') {
                    return updatedCustomerRatioChart;
                }
                return chart;
            }));
        }
    }, [responseData]);
    useEffect(() => {
        if (responseData) {
            const transformedData = responseData.timeSeriesPrediction.map(item => ({
                x: new Date(item.timestamp).toLocaleDateString('ko-KR', {
                    month: '2-digit',
                    day: '2-digit'
                }),
                y: parseFloat(item.mean.toFixed(2))
            }));
            const updatedSalesTrendChart = {
                ...salesTrendChart,
                series: [
                    {
                        name: '예상 매출액',
                        data: transformedData
                    }
                ]
            };        
            setSalesTrendChart(updatedSalesTrendChart);
            setChartData(prevData => prevData.map(chart => {
                if (chart.options.chart.id === 'salesTrendChart') {
                    return updatedSalesTrendChart;
                }
                return chart;
            }));
        }
    }, [responseData]);
    const [chartData, setChartData] = useState([
        customerRatioChart,
        {
            options: { 
                chart: { id: 'chart1' }, 
                colors: ['#68D241', '#FF0D35'],
                plotOptions: {
                    bar: {
                        barHeight: '60%',
                        borderRadius: 3,
                        borderRadiusWhenStacked: 'all',
                    },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                      fontSize: '14px',    // 폰트 크기
                      fontFamily: 'GongGothicMedium',
                      colors: ['#FFF'],
                    },
                    formatter: (value) => `${value}%`, // 데이터 레이블 포매터
                    position: 'top' // 데이터 레이블 위치
                  },
                xaxis: {
                    type: 'int',
                    categories: [
                        '10대', '20대', '30대', '40대', '50대', '60대', '70대 이상'
                    ],
                    labels: {
                        rotate: -90,
                        style: {
                            colors: ['#333'],  // X축 레이블 색상
                            fontSize: '14px',  // X축 레이블 폰트 크기
                            fontFamily: 'GongGothicMedium',
                          },
                    }
                },
                yaxis: {
                    labels: {
                      style: {
                        colors: ['#333'],  // Y축 레이블 색상
                        fontSize: '14px',  // Y축 레이블 폰트 크기
                        fontFamily: 'GongGothicMedium',
                      },
                      formatter: function (val) {
                        return val; // Y축 레이블 포매터
                      },
                      offsetX: 0, // Y축 레이블 X축 오프셋
                      offsetY: 0  // Y축 레이블 Y축 오프셋
                    },
                    tickAmount: 4
                  },
                title: {
                    text: '전년 동기간 대비 성별, 연령별 고객 비중 변화(%)',
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                },
                tooltip: {
                    y: {
                        formatter: (value) => {
                            return `${value}%`;
                        }
                    }
                },
            },
            series: [
                {
                    name: '남성',
                    data: [1.45, 5.42, 5.9, -0.42, -47.2, -43.3, -18.6]
                },
                {
                    name: '여성',
                    data: [1.1, 4.3, 6.0, 0.5, -46.0, -42.0, -17.0]
                }
            ],
            type: "bar",

        },
        {
              options : {
                chart: {
                    id: 'flowpop',
                    stacked: true
                },
                colors: ['#68D241', '#FF0D35'],
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '70%',
                        borderRadius: 5,
                        borderRadiusWhenStacked: 'all',
                    },
                },
                dataLabels: {
                    enabled: true,
                },
                stroke: {
                    width: 1,
                    colors: ['#fff'],
                },
                legend: {
                    show: true,
                },
                title: {
                    text: `최근 1년간 ${addr}의 성별, 연령별 유동인구의 평균(명)`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                },
                grid: {
                    xaxis: {
                        lines: {
                            show: true,
                        },
                    },
                    yaxis: {
                        lines: {
                            show: false,
                        },
                    },
                },
                xaxis: {
                    categories: [
                        '10대 이하', '20대', '30대', '40대', '50대', '60대', '70대', '80대 이상'
                      ],
                    labels: {
                        formatter(val) {
                            const formattedValue = `${Math.abs(parseFloat(val)).toLocaleString()}`;
                            return parseFloat(val) < 0 ? `-${formattedValue}` : `${formattedValue}`;
                        },
                        offsetX: -10
                    },
                    axisBorder: {
                        show: false,
                    },
                    tickAmount: 4
                },
                yaxis: {
                    showAlways: true,
                },
                tooltip: {
                    y: {
                        formatter: (value) => {
                            return `${value}%`;
                        }
                    }
                },
            },
            series: [
                {
                  name: '남성',
                  data: [1.45, 5.42, 10, 20, 30, 40, 37, 20, 10]
                },
                {
                  name: '여성',
                  data: [-1.1, -4.3, -60, -20, -30, -70, -30, -20, -10]
                }
              ],
                type: "bar", 
            },
        {
            options: { 
                colors: ['#5D70DF'],
                chart: { 
                    id: `day-sales` 
                }, 
                xaxis: { 
                    categories: [
                        "월", "화", "수", "목", "금", "토", "일"
                    ] 
                },
                tooltip: {
                    y: {
                        formatter: (value) => {
                            return `${value}%`;
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    style: {
                      fontSize: '14px',    // 폰트 크기
                      fontFamily: 'GongGothicMedium',
                      colors: ['#FFF'],
                    },
                    formatter: (value) => `${value}%`, // 데이터 레이블 포매터
                    position: 'top' // 데이터 레이블 위치
                  },
                plotOptions: {
                    bar: {
                        barHeight: '70%',
                        borderRadius: 5,
                        borderRadiusWhenStacked: 'all',
                    },
                }, 
                title: {
                    text: `${addr} ${selectedValue2} 업종의 요일별 매출액 비중(%)`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                },
            },
            series: [{ name: "요일별 매출액 비중", data: [10, 20, 30, 40, 30, 20, 10] }],
            type: "bar",
        },
        {
            options: { 
                chart: { id: `hours` }, 
                xaxis: { categories: ["00~07시", "07~09시", "09~11시","11~13시","13~15시","15~17시","17~19시","19~21시","21~23시","23~24시"] },
                title: {
                    text: `${addr} ${selectedValue2} 업종의 시간대별 매출액 비중(%)`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                },
                stroke: {
                    curve: 'smooth' // 곡선 라인으로 설정
                },
                markers: {
                    size: 5, // 마커의 크기 설정, 마커를 항상 보이게 함
                    strokeColor: '#FFFFFF', // 마커의 테두리 색상
                    strokeWidth: 2, // 마커의 테두리 두께
                    hover: {
                      size: 7 // 호버 시 마커의 크기
                    }
                  },
                  tooltip: {
                    y: {
                        formatter: (value) => {
                            return `${value}%`;
                        }
                    }
                },
            },
            series: [
                { name: "매출 건수", data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150] },
                { name: "매출 비중", data: [20, 30, 25, 40, 39, 50, 60, 81, 105, 130] }
            ],
            type: "line",
        },
        {
            options: {
                chart: { id: `rival` }, xaxis: { categories: ["2023.11", "2023.12", "2024.01", "2024.02", "2024.03", "2024.04"]},
                colors: ['#5D70DF'],
                plotOptions: {
                    bar: {
                        barHeight: '60%',
                        borderRadius: 5,
                        borderRadiusWhenStacked: 'all',
                    },
                },
                title: {
                    text: `${addr} ${selectedValue2} 업종의 월별 가맹점 수(개)`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                }, 
            },
            series: [{ name: "series-2", data: [10, 20, 30, 40, 30, 10] }],
            type: "bar",
        },
        {
            options: { 
                chart: { id: 'rival-ratio' },
                legend: { position: 'bottom', offsetY: -100, fontSize: '24px',
                  },
                dataLabels: {
                    enabled: true,
                    style: {
                      fontSize: '24px', // 폰트 크기
                      fontFamily: 'GongGothicMedium', // 폰트 패밀리
                    },
                  },
                  tooltip: {
                    y: {
                        formatter: (value) => {
                            return `${Math.round(value)}%`;
                        }
                    }
                },
                labels: ["운영점포", "폐업점포", "휴업점포"], 
                title: {
                    text: `${addr} ${selectedValue2} 업종의 가맹점 운영 상태 비중(%)`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 0, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                }, 
                plotOptions: {
                    pie: {
                      customScale: 0.7,
                      offsetY: -100,
                    }
                  },
                  animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
            },
            series: [44, 55, 13],
            type: "pie",
        },
        {
            options: {
                chart: {
                  id: 'consume',
                  type: 'line',
                },
                plotOptions: {
                    bar: {
                        barHeight: '60%',
                        borderRadius: 3,
                        borderRadiusWhenStacked: 'all',
                    },
                },
                stroke: {
                  width: [1, 4]
                },
                title: {
                    text: `${selectedValue2} 업종의 월별 총 이용 건수(건)와 평균 결제 단가(원)`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                },
                dataLabels: {
                  enabled: true,
                  enabledOnSeries: [1]
                },
                labels: ["23/11", "23/12", "24/01", "24/02", "24/03", "24/04"],
                xaxis: {
                    categories: ["23/11", "23/12", "24/01", "24/02", "24/03", "24/04"]
                },
                yaxis: [{
                  title: {
                    text: '',
                  },
                
                }, {
                  opposite: true,
                  title: {
                    text: ''
                  }
                }],
              },
            series: [{
                name: '이용 건수',
                type: 'column',
                data: [440, 505, 414, 671, 227, 413]
              }, {
                name: '평균 결제 단가',
                type: 'line',
                data: [235, 322, 22, 1216, 12435, 104]
              }],
            type: "bar",
        },
        {
            options: { 
                chart: { id: `change` }, 
                xaxis: { categories: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"] },
                title: {
                    text: `${addr} ${selectedValue2} 업종의 연간 매출액 변화`,
                    align: 'center', // 'left', 'center', 'right'로 위치 설정
                    margin: 10, // 제목과 차트 사이의 여백
                    offsetX: 0, // X축 오프셋
                    offsetY: 0, // Y축 오프셋
                    style: {
                        fontSize: '18px', // 폰트 크기
                        fontFamily: 'GongGothicMedium', // 폰트 패밀리
                        color: '#263238', // 폰트 색상
                    }
                },  
            },
            series: [
                { name: "매출액", data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 10, 20] }
            ],
            type: "line",
        },
        salesTrendChart
    ]);
    useEffect(() => {
        if (responseData && responseData.indicator && responseData.indicator.v_desc) {
            const desc = responseData.indicator.v_desc;
            setIndicator(desc);
            if (desc === "정체") {
                setMessage(`${addr}은 경쟁력 있는 기존 업체 우위 상권이에요!`);
                setBgColor('#FF8700'); // 주황색 배경
            } else if (desc === "상권확장") {
                setMessage(`${addr}은 경쟁력 있는 신규 업체 우위 상권이에요!`);
                setBgColor('#4BA83D'); // 녹색 배경
            } else {
                setMessage(`${addr}은 창업 진출입시 세심한 주의가 필요한 상권이에요!`);
                setBgColor('#DC3434'); // 빨간색 배경
            }
        }
    }, [responseData, addr]);

    useEffect(() => {
        console.log(responseData);
        if (responseData) {
            const dayMapping = {
                '월요일': '월',
                '화요일': '화',
                '수요일': '수',
                '목요일': '목',
                '금요일': '금',
                '토요일': '토',
                '일요일': '일'
            };
            const { maleChangeData, femaleChangeData } = processData(responseData.customerPercentageChange);

            const hourLabels = [
                "00:00~06:59", "07:00~08:59", "09:00~10:59", "11:00~12:59", "13:00~14:59",
                "15:00~16:59", "17:00~18:59", "19:00~20:59", "21:00~22:59", "23:00~23:59"
            ];
            const cntData = new Array(hourLabels.length).fill(0);
            const amtData = new Array(hourLabels.length).fill(0);
            const categories = responseData.daySales.map(item => dayMapping[item.day]);
            const data = responseData.daySales.map(item => parseFloat(item.totalAmt.toFixed(2)));
            const mcategories = responseData.merchantCntData.map(item => `${item.년월.slice(2, 4)}/${item.년월.slice(4, 6)}`);
            const mdata = responseData.merchantCntData.map(item => item.상가수);
            const rivalRatio = Object.values(responseData.merchantData);
            const averageSales = responseData.unitPriceCntData.map(item => ({
                yearMonth: item.년월,
                avgSales: item["상가당매출액(평균)"],
                transactionCount: item.매출건수
            }));
            // 1년 매출액 추이
            const monthlySalesData = responseData.yearAmtData
            const months = monthlySalesData.map(item => `${item.년월.slice(2, 4)}/${item.년월.slice(4, 6)}`);
            const salesData = monthlySalesData.map(item => item.월매출액합계);
            // 시장 규모
            const marketCategories = responseData.recentMonthlySales.map(item => `${item.salesMonth.slice(2, 4)}/${item.salesMonth.slice(5, 7)}`);
            const marketData = responseData.recentMonthlySales.map(item => item.totalSales);
            //유동인구
            const flowpopCategories = responseData.averageFlowpop.map(item => item.ageGroup);
            const maleFlowpopData = responseData.averageFlowpop.map(item => parseFloat(item.mCntAvg.toFixed(2)));
            const femaleFlowpopData = responseData.averageFlowpop.map(item => parseFloat(item.fCntAvg.toFixed(2)));
            const transformedData = responseData.timeSeriesPrediction.map(item => ({
                x: new Date(item.timestamp).toLocaleDateString('ko-KR', {
                    month: '2-digit',
                    day: '2-digit'
                }),
                y: parseFloat(item.mean.toFixed(2))
            }));
            setSalesTrendChart(prevState => ({
                ...prevState,
                series: [
                    {
                        name: '예상 매출액',
                        data: transformedData
                    }
                ]
            }));            
            responseData.hourlySales.forEach(item => {
                const index = hourLabels.indexOf(item.hourLabel);
                if (index !== -1) {
                    cntData[index] += parseFloat(item.cntPercentage.toFixed(2));
                    amtData[index] += parseFloat(item.amtPercentage.toFixed(2));
                } else {
                    console.warn(`Unexpected hourLabel: ${item.hourLabel}`);
                }
            });
            // 요일별 매출 그래프의 데이터를 업데이트
            setChartData(prevData => prevData.map(chart => {
                if (chart.options && chart.options.chart && chart.options.chart.id) {
                    if (chart.options.chart.id === 'day-sales') {
                        return {
                            ...chart,
                            
                            options: {
                                ...chart.options,
                                xaxis: {
                                    ...chart.options.xaxis,
                                    categories: categories
                                }
                            },
                            series: [{ name: "요일별 매출액 비중", data: data }]
                        };
                    } else if (chart.options.chart.id === 'chart1') {
                        return {
                            ...chart,
                            options: {
                                ...chart.options,
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                      fontSize: '14px',    // 폰트 크기
                                      fontFamily: 'GongGothicMedium',
                                      colors: ['#FFF'],
                                    },
                                    background: {
                                      enabled: true,
                                      foreColor: '#000', // 데이터 레이블 배경 색상
                                      borderColor: '#000'
                                    },
                                    formatter: (value) => `${value}%`, // 데이터 레이블 포매터
                                    position: 'top' // 데이터 레이블 위치
                                  },
                                },
                                tooltip: {
                                    y: {
                                        formatter: (value) => {
                                            return `${value}%`;
                                        }
                                    }
                                },
                            series: [
                                {
                                    name: '남성',
                                    data: maleChangeData
                                },
                                {
                                    name: '여성',
                                    data: femaleChangeData
                                }
                            ]
                        };
                    } else if (chart.options.chart.id === 'hours') {
                        return {
                            ...chart,
                            options: {
                            ...chart.options,
                            dataLabels: {
                                enabled: true,
                                style: {
                                  fontSize: '14px',    // 폰트 크기
                                  fontFamily: 'GongGothicMedium',
                                  colors: ['#FFF'],
                                },
                                background: {
                                  enabled: true,
                                  foreColor: '#000', // 데이터 레이블 배경 색상
                                  borderColor: '#000'
                                },
                                formatter: (value) => `${value}%`, // 데이터 레이블 포매터
                                offsetY: -10, // Y축 방향 오프셋
                                position: 'top' // 데이터 레이블 위치
                              },
                            },
                            series: [
                                { name: "매출 건수", data: cntData },
                                { name: "매출 비중", data: amtData }
                            ]
                        };
                    } else if (chart.options.chart.id === 'consume') {
                        return {
                            ...chart,
                            options: {
                                ...chart.options,
                                xaxis: {
                                    categories: averageSales.map(item => `${item.yearMonth.slice(2, 4)}/${item.yearMonth.slice(4, 6)}`),
                                    labels: {
                                      style: {
                                        fontSize: '14px',
                                        fontFamily: 'GongGothicMedium',
                                        colors: ['#333'],
                                      },
                                    },
                                  },
                                  yaxis: [
                                    {
                                      labels: {
                                        style: {
                                          fontSize: '14px',
                                          fontFamily: 'GongGothicMedium',
                                          colors: ['#333'],
                                        },
                                      },
                                    },
                                    {
                                      opposite: true,
                                      labels: {
                                        style: {
                                          fontSize: '14px',
                                          fontFamily: 'GongGothicMedium',
                                          colors: ['#333'],
                                        },
                                      },
                                    }
                                  ],
                                colors: ['#5D70DF', '#D7E2FF'],
                                dataLabels: {
                                    enabled: true,
                                    
                                    style: {
                                      fontSize: '14px',    // 폰트 크기
                                      fontFamily: 'GongGothicMedium',
                                      colors: ['#FFF'],
                                    },
                                    background: {
                                      enabled: true,
                                      
                                      foreColor: '#000', // 데이터 레이블 배경 색상
                                      borderColor: '#000'
                                    },
                                    formatter: (value) => `${value}원`, // 데이터 레이블 포매터
                                    offsetY: -10, // Y축 방향 오프셋
                                    position: 'top' // 데이터 레이블 위치
                                  },
                                  markers: {
                                    size: 5, // 마커의 크기 설정, 마커를 항상 보이게 함
                                    strokeColor: '#FFF', // 마커의 테두리 색상
                                    strokeWidth: 2, // 마커의 테두리 두께
                                    hover: {
                                      size: 7 // 호버 시 마커의 크기
                                    }
                                  },
                                  tooltip: {
                                    y: {
                                        formatter: (value) => {
                                            return `${Math.round(value)}건`;
                                        }
                                    }
                                },
                            },
                            series: [
                                { 
                                    name: "이용 건수", 
                                    type: 'column', // 첫 번째 시리즈는 바 차트
                                    data: averageSales.map(item => item.transactionCount) 
                                },
                                { 
                                    name: "평균 결제 단가", 
                                    type: 'line', // 두 번째 시리즈는 라인 차트
                                    data: averageSales.map(item => item.avgSales) 
                                }
                            ],
                            type: "line",
                        }
                    } else if (chart.options.chart.id === 'rival') {
                        return {
                            ...chart,
                            options: {
                                ...chart.options,
                                xaxis: {
                                    categories: mcategories
                                }
                            },
                            series: [{ name: "상가수", data: mdata }],
                            type: "bar",
                        }
                    } else if (chart.options.chart.id === 'market') {
                        return {
                            ...chart,
                            options: {
                                ...chart.options,
                                xaxis: {
                                    ...chart.options.xaxis,
                                    categories: marketCategories
                                }
                            },
                            series: [{ name: "총 매출", data: marketData }],
                            type: "bar",
                        }
                    } else if (chart.options.chart.id === 'rival-ratio') {
                        return {
                            ...chart,
                            series: rivalRatio,
                            type: "pie",
                        }
                    } else if (chart.options.chart.id === 'change') {
                        return {
                            ...chart,
                            options: {
                                ...chart.options,
                                colors: ['#5D70DF'],
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                      fontSize: '14px',    // 폰트 크기
                                      fontFamily: 'GongGothicMedium',
                                      colors: ['#FFF'], // 폰트 색상
                                    },
                                    background: {
                                      enabled: true,
                                      borderColor: '#000'
                                    },
                                    formatter: (value) => {
                                        if (value >= 100000000) {
                                          return `${(value / 100000000).toFixed(2)}억`;
                                        } else {
                                          return `${Math.round(value / 10000)}만`;
                                        }
                                      },
                                    offsetY: -10, // Y축 방향 오프셋
                                    position: 'top' // 데이터 레이블 위치
                                  },
                                xaxis: {
                                    ...chart.options.xaxis,
                                    categories: months
                                },
                                yaxis: {
                                    labels: {
                                        style: {
                                            colors: ['#333'],  // Y축 레이블 색상
                                            fontSize: '14px',  // Y축 레이블 폰트 크기
                                            fontFamily: 'GongGothicMedium',
                                          },
                                          formatter: (value) => {
                                            if (value >= 100000000) {
                                              return `${(value / 100000000).toFixed(2)}억`;
                                            } else {
                                              return `${Math.round(value / 10000)}만`;
                                            }
                                          },
                                    }
                                },
                                stroke: {
                                    curve: 'smooth' // 곡선 라인으로 설정
                                },
                                tooltip: {
                                    y: {
                                        formatter: (value) => {
                                            if (value >= 100000000) {
                                              return `${(value / 100000000).toFixed(2)}억`;
                                            } else {
                                              return `${Math.round(value / 10000)}만`;
                                            }
                                          },
                                    }
                                },
                                markers: {
                                    size: 5, // 마커의 크기 설정, 마커를 항상 보이게 함
                                    strokeColor: '#FFF', // 마커의 테두리 색상
                                    strokeWidth: 2, // 마커의 테두리 두께
                                    hover: {
                                      size: 7 // 호버 시 마커의 크기
                                    }
                                  }
                            },
                            series: [
                                { 
                                    name: "월 매출액 합계", 
                                    data: salesData 
                                }
                            ]
                        };
                    } else if (chart.options.chart.id === 'flowpop') {
                        return {
                            ...chart,
                            options: {
                                ...chart.options,
                                xaxis: {
                                    ...chart.options.xaxis,
                                    categories: flowpopCategories,
                                    labels: {
                                        formatter(val) {
                                            const formattedValue = `${Math.abs(parseFloat(val)).toLocaleString()}`;
                                            return formattedValue;
                                        },
                                        offsetX: -10
                                    },
                                },
                                tooltip: {
                                    y: {
                                        formatter: function(val) {
                                            return `${Math.abs(val).toLocaleString()}명`;
                                        }
                                    }
                                },
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                      fontSize: '14px',    // 폰트 크기
                                      fontFamily: 'GongGothicMedium',
                                      colors: ['#FFF'],
                                    },
                                    formatter: (value) => `${Math.abs(value)}명`, // 데이터 레이블 포매터
                                    position: 'top' // 데이터 레이블 위치
                                  },
                            },
                            series: [
                                { name: "남성", data: maleFlowpopData },
                                { name: "여성", data: femaleFlowpopData }
                            ],
                        };
                    }
                }
                return chart;
            }));
        }
    }, [responseData]);
    const cardContents = [
        {
            title: "진단 요약",
            content: (
                <div className="relative grid grid-cols-2 gap-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute h-full w-px bg-gray-300"></div>
                        <div className="absolute w-full h-px bg-gray-300"></div>
                    </div>
                    <div>
                        <div className="m-2 flex justify-start">
                            <img src={Rocket} alt="" className="w-10 h-10"/>
                            <p class="text-2xl">AI {addr} {selectedValue2} 업종 예상 매출액 추이</p>
                        </div>
                        <ChartComponent {...salesTrendChart} width="100%"/>
                    </div>
                    <div>
                        <div className="m-2 flex justify-start">
                            <img src={Rocket} alt="" className="w-10 h-10"/>
                            <p class="text-2xl">AI {addr} {selectedValue2} 업종 예상 월 매출액 합계</p>
                        </div>
                        <div>
                            <div class="px-6">
                            <div className="flex relative justify-center pt-20">
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
                                <p class="absolute mt-20 text-white text-3xl">{formatValue(responseData.predictionResult.predicted_value)}</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="py-2 m-2">
                        <p class="text-2xl">{addr} 상권 변화지표</p>
                        <div class="mx-auto max-w-xs px-8 mt-20 rounded-3xl bg-gray-200 shadow-xl">
                            <p class="mt-6 pt-4 flex items-baseline justify-center gap-x-2">
                                <span class="text-lg tracking-tight text-gray-900">{addr}의 상권 변화 지표는</span>
                            </p>
                            <div style={{ backgroundColor: bgColor }} class={`mt-3 rounded-full px-3 py-2 text-center text-lg text-white shadow-sm1`}>{indicator}</div>
                            <p class="my-3 pb-3 flex items-baseline justify-center gap-x-2">
                                <span class="text-lg tracking-tight text-gray-900">{message}</span>
                            </p>
                        </div>
                    </div>
                    <div className="py-2 m-2">
                        <p class="text-2xl">{addr} {selectedValue2} 업종 성별, 연령별 고객비중</p>
                        <ChartComponent {...customerRatioChart} width="100%" />
                    </div>
                </div>
            )
        },
        {
            title: "연관 분석",
            content: responseData && responseData.fullBusinessAnalysis ? (
                <SynergyInfo responseData={responseData.fullBusinessAnalysis} />
              ) : (
                <div>데이터가 없습니다.</div>
              )
        },
    ];
    // 첫 번째 카드에 대한 처리
    if (card === 1) {
        const { title: customTitle, content } = cardContents[0];
        return (
            <div className="h-[100vh] px-20 py-16 mb-20" id={id}>
                <h2 className="text-3xl mb-6">{customTitle}</h2>
                {content}
            </div>
        );
    }

    // 마지막 카드에 대한 처리
    if (card === cardTitles.length) {
        const { title: customTitle, content } = cardContents[1];
        return (
            <div className="h-[100vh] px-20 py-16" id={id}>
                <h2 className="text-3xl mt-10 mb-10">{customTitle}</h2>
                {content}
            </div>
        );
    }
    const defaultChartConfig = {
        options: { chart: { id: `defaultChart` }, xaxis: { categories: [] } },
        series: [],
        type: "line",
        width: '80%', 
    };

    const chartConfig = chartData[card - 2] || defaultChartConfig;

    return (
        <div className="h-[100vh] pl-20 pt-16" id={id}>
            {chartConfig.options && chartConfig.options.chart && chartConfig.options.chart.id === 'chart1' ? (
                responseData.customerPercentageChange && responseData.customerPercentageChange.length > 0 ? (
                    <ChartComponent className="mx-auto" title={title} {...chartConfig} />
                ) : (
                    <div className="error-message">
                    <h2 className="text-2xl mt-10 mb-10">{title}</h2>
                    <p className="text-xl mt-10">해당 지역은 아직 고객 비중 변화 정보가 부족합니다😥</p>
                    </div>
                )
                ) : chartConfig.options.chart.id === 'consume' ? (
                responseData.unitPriceCntData && responseData.unitPriceCntData.length > 0 ? (
                    <ChartComponent className="mx-auto" title={title} {...chartConfig} />
                ) : (
                    <div className="error-message">
                    <h2 className="text-2xl mt-10 mb-10">{title}</h2>
                    <p className="text-xl mt-10">해당 지역은 아직 이용건수 및 결제단가 정보가 부족합니다😥</p>
                    </div>
                )
                ) : chartConfig.options.chart.id === 'change' ? (
                responseData.yearAmtData && responseData.yearAmtData.length > 0 ? (
                    <ChartComponent className="mx-auto" title={title} {...chartConfig} />
                ) : (
                    <div className="error-message">
                    <h2 className="text-2xl mt-10 mb-10">{title}</h2>
                    <p className="text-xl mt-10">해당 지역은 아직 매출액 추이 정보가 부족합니다😥</p>
                    </div>
                )
                ) : (
                <ChartComponent title={title} {...chartConfig} />
                )}
        </div>
    );
};

export default Card;
