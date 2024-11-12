import React from 'react';
import Chart from 'react-apexcharts';

const ChartComponent = ({ title, options, series, type, width, height }) => {
  const commonChartOptions = {
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
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',  // 레전드 폰트 크기
      fontFamily: 'GongGothicMedium',  // 레전드 폰트 패밀리
      // fontWeight: 'bold',  // 레전드 폰트 굵기
      labels: {
        colors: ['#333'],  // 레전드 텍스트 색상
        useSeriesColors: false  // 시리즈 색상을 사용하지 않고 지정된 색상을 사용
      },
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: '#fff',
        radius: 12,
        offsetX: 0,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5
      },
      containerMargin: {
        left: 0,
        top: 0
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      }
    },
    xaxis: {
      labels: {
        style: {
          colors: ['#333'],  // X축 레이블 색상
          fontSize: '14px',  // X축 레이블 폰트 크기
          fontFamily: 'GongGothicMedium',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#333'],  // Y축 레이블 색상
          fontSize: '14px',  // Y축 레이블 폰트 크기
          fontFamily: 'GongGothicMedium',
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '16px',
        fontFamily: 'GongGothicMedium',
      },
    },
    
  };
  const mergedOptions = {
    ...commonChartOptions,
    ...options,
    xaxis: {
      ...commonChartOptions.xaxis,
      ...options.xaxis,
    },

    dataLabels: {
      ...commonChartOptions.dataLabels,
      ...options.dataLabels,
    },
    legend: {
      ...commonChartOptions.legend,
      ...options.legend,
    },
    tooltip: {
      ...commonChartOptions.tooltip,
      ...options.tooltip,
    }
  };
  return (
    <div>
      <h2 className="text-3xl mt-10 mb-10">{title}</h2>
        <div className="pl-20">
          <Chart
              className="pl-20"
              options={mergedOptions}
              series={series}
              type={type}
              width="75%"
              height={height}
          />
        </div>
        {/* <div class="mx-auto px-8 my-10 rounded-3xl bg-gray-200 w-full">
            <p class="pt-3 flex items-baseline justify-center gap-x-2">
                <span class="text-2xl tracking-tight text-gray-900">분석 결과</span>
            </p>
            <p class="py-3 flex items-baseline justify-center gap-x-2">
                <span class="text-xl tracking-tight text-gray-900">{} 이 가장 높습니다.</span>
            </p>
        </div> */}
    </div>
  );
};

export default ChartComponent;
