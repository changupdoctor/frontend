import React, { useEffect, useRef } from 'react';
import './Rocket.css';
import rocketImage from '../assets/Rocket-small.svg';  // 로켓 이미지 경로
import moneyImage from '../assets/money.svg';    // 돈 이미지 경로

const RocketAnimation = () => {
  const rocketRef = useRef(null);
  const moneyContainerRef = useRef(null);

  useEffect(() => {
    const handleAnimationIteration = () => {
      const rocket = rocketRef.current;
      const moneyContainer = moneyContainerRef.current;

      if (rocket && moneyContainer) {
        moneyContainer.style.left = `${rocket.getBoundingClientRect().left}px`;
        moneyContainer.style.top = `${rocket.getBoundingClientRect().top}px`;
      }
    };

    const rocket = rocketRef.current;
    if (rocket) {
      rocket.addEventListener('animationiteration', handleAnimationIteration);
    }

    return () => {
      if (rocket) {
        rocket.removeEventListener('animationiteration', handleAnimationIteration);
      }
    };
  }, []);

  return (
    <div className="container">
      <img src={rocketImage} className="rocket" alt="Rocket" ref={rocketRef} />
      <div className="money-container" ref={moneyContainerRef}>
        <img src={moneyImage} className="money" alt="Money" />
        <img src={moneyImage} className="money" alt="Money" />
        <img src={moneyImage} className="money" alt="Money" />
      </div>
    </div>
  );
};

export default RocketAnimation;
