import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import noDataImage from '../assets/Rocket-small.svg' // 이미지 경로를 맞게 변경하세요.

const Error = () => {
    const navigate = useNavigate();
    const toIndex = () => {
        navigate('/');
        };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={noDataImage} alt="No Data" className="w-1/4 h-auto" />
      <p className="text-2xl text-gray-700">해당 지역은 아직 상권 정보가 부족합니다😥</p>
      <button
        onClick={toIndex}
        class="mt-6 block rounded-full bg-[#5D70DF] px-3 py-2 text-center text-xl text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            다시 진단받기
        </button>
    </div>
  );
};

export default Error;
