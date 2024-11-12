import React, { useEffect, useState } from 'react';
import './Loader.css'; // 로딩 스피너 스타일
import rocketImage from '../assets/Rocket-small.svg';

const Loader = ({ message }) => {
  const [animationClass, setAnimationClass] = useState('bounce');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass('go-rocket');
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="loader">
      <div className="bounce">
        <img src={rocketImage} className="bounce-rocket" alt="Bouncing Rocket" />
        <p className="text-xl">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
