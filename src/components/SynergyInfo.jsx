import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoffee, faCar, faStore, faBuilding, faUtensils, faUserMd,
  faCapsules, faClinicMedical, faIndustry, faTshirt, faPaintBrush,
  faBook, faLaptopHouse, faBriefcaseMedical, faShoppingCart,
  faShoppingBag, faBeer, faHotel, faRunning, faHamburger,
  faFish, faAppleAlt, faMobileAlt, faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import { synergyPairs, regions } from '../assets/category';
import './SynergyInfo.css'; 

const iconMap = {
  faCoffee,
  faCar,
  faStore,
  faBuilding,
  faUtensils,
  faUserMd,
  faCapsules,
  faClinicMedical,
  faIndustry,
  faTshirt,
  faPaintBrush,
  faBook,
  faLaptopHouse,
  faBriefcaseMedical,
  faShoppingCart,
  faShoppingBag,
  faBeer,
  faHotel,
  faRunning,
  faHamburger,
  faFish,
  faAppleAlt,
  faMobileAlt,
  faCreditCard
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

const SynergyInfo = ({ responseData }) => {
  const [consequentIcon, setConsequentIcon] = useState(null);
  const [spinning, setSpinning] = useState(true);
  const iconContainerRef = useRef();
  const handleClick = () => {
    setSpinning(false);
  };
  useEffect(() => {
    const findConsequentIcon = (consequent) => {
      const pair = synergyPairs.find(pair => pair.consequent === consequent);
      return pair ? iconMap[pair.icon] : null;
    };

    if (responseData) {
      const icon = findConsequentIcon(responseData.consequent);
      setConsequentIcon(icon);
    }
  }, [responseData]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <p className="text-2xl my-10 text-center">시너지 업종 정보</p>
      {responseData.consequent !== "0" ? (
      <div>
        <div className="pb-2 flex justify-center">
          <div className="flex flex-col justify-center">
            <div ref={iconContainerRef} onClick={handleClick} className={`icon-container ${spinning ? '' : 'stop'}`}>
              {spinning ? (
                Object.values(iconMap).map((icon, index) => (
                  <div key={index} style={{ backgroundColor: getRandomColor(index) }} className="ball">
                    <FontAwesomeIcon key={index} className="icon text-2xl" icon={icon} />
                  </div>
                ))
              ) : (
                <div className="icon-wrapper">
                  <div className="ball">
                    <FontAwesomeIcon className="icon text-2xl" icon={consequentIcon} />
                  </div>
                    <p className="pt-4 text-xl text-center">{responseData.consequent}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pb-2">
          <div className="mx-auto max-w-2xl px-8 pb-4 my-10 rounded-2xl bg-[#D7E2FF] shadow-xl">
            <p className="mt-6 pt-4 flex items-baseline justify-start gap-x-2">
              <span className="text-xl tracking-tight text-gray-900">시너지 업종이란?</span>
            </p>
            <p className="mt-2 flex items-baseline justify-start gap-x-2">
              <span className="text-lg tracking-tight text-gray-900">함께 있을 때 매출이 높은 업종이에요!</span>
            </p>
            <p className="pt-4 flex items-baseline justify-start gap-x-2">
              <span className="text-lg tracking-tight text-gray-900">선택한 동에 {responseData.consequent} 업종은 {responseData.selectedDistrictCount}개 있습니다.</span>
            </p>
            <p className="pt-4 flex items-baseline justify-start gap-x-2">
              <span className="text-lg tracking-tight text-gray-900">시 내에서 시너지 업종이 가장 많은 동은 {responseData.maxDistrictName}이며, 총 {responseData.maxMerCount}개 있습니다.</span>
              {/* <span className="text-lg tracking-tight text-gray-900">시 내에서 시너지 업종이 가장 많은 동은 소하동이며, 총11개 있습니다.</span> */}
            </p>
          </div>
      </div>
      </div>
      ) : (
        <div className="pb-2">
          <div className="mx-auto max-w-sm px-8 pb-4 my-10 rounded-2xl bg-[#D7E2FF] shadow-xl">
          <p className="mt-6 pt-4 flex items-baseline justify-start gap-x-2">
            <span className="text-xl tracking-tight text-gray-900">시너지 업종이란?</span>
          </p>
          <p className="mt-2 flex items-baseline justify-start gap-x-2">
            <span className="text-lg tracking-tight text-gray-900">함께 있을 때 매출이 높은 업종이에요!</span>
          </p>
          <p className="pt-4 flex items-baseline justify-start gap-x-2">
            <span className="text-xl tracking-tight text-gray-900">선택한 동은 시너지 업종이 없어요!</span>
          </p>
        </div>
      </div>
    )}
    </div>
  );
};

export default SynergyInfo;
