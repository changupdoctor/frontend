import React, { useEffect, useRef, useState } from 'react';

const CoinRain = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const coin = new Image();
    coin.src = 'http://i.imgur.com/5ZW2MT3.png';

    const coins = [];

    coin.onload = () => {
      drawloop();
    };

    function drawloop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.3) {
        coins.push({
          x: Math.random() * canvas.width | 0,
          y: -50,
          dy: 3,
          s: 0.5 + Math.random(),
          state: Math.random() * 10 | 0
        });
      }

      let i = coins.length;
      while (i--) {
        const x = coins[i].x;
        const y = coins[i].y;
        const s = coins[i].s;
        const state = coins[i].state;
        coins[i].state = (state > 9) ? 0 : state + 0.1;
        coins[i].dy += 0.3;
        coins[i].y += coins[i].dy;

        ctx.drawImage(coin, 44 * Math.floor(state), 0, 44, 40, x, y, 44 * s, 40 * s);

        if (y > canvas.height) {
          coins.splice(i, 1);
        }
      }

      if (coins.length > 0) {
        requestAnimationFrame(drawloop);
      } else {
        setIsRunning(false);
      }
    }

    drawloop();
  }, [isRunning]);

  const handleClick = () => {
    setIsRunning(true);
  };

  return (
    <div>
      <button onClick={handleClick} className="btns">
        Start Coin Rain
      </button>
      {isRunning && <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }} />}
    </div>
  );
};

export default CoinRain;
