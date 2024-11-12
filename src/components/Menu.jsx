import React, { useState, useEffect, useRef } from "react";
import ScrollTo from "react-scroll-into-view";
import './Menu.css';

const cardTitles = [
  "진단 요약", "고객 비중 분석", "고객 비중 변화", "유동 인구", "요일별 매출", "시간대별 매출",
  "동종업계 점포 수", "가맹점 수 비율", "이용건수 및 결제단가",
  "매출액 추이", "매출액 예상 변화", "연관분석"
];
function Menu({ cards }) {
  const [activeCard, setActiveCard] = useState(1);
  const observer = useRef();

  useEffect(() => {
    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cardId = parseInt(entry.target.id.replace('card', ''));
          setActiveCard(cardId);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5 
    });

    for (let i = 1; i <= cards; i++) {
      const cardElement = document.getElementById(`card${i}`);
      if (cardElement) {
        observer.current.observe(cardElement);
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [cards]);

  return (
    <nav>
      <ul>
        {cardTitles.slice(0, cards).map((title, index) => (
          <li key={index}>
            <ScrollTo selector={`#card${index + 1}`}>
              <button
                className={`menu-button ${activeCard === index + 1 ? "active" : ""}`}
              >
                {title}
              </button>
            </ScrollTo>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;
