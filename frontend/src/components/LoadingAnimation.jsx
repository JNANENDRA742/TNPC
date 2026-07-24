import React from 'react';

const calculateDelays = (count, speed) => {
  const delays = [];
  for (let i = 0; i < count; i++) {
    delays.push(-(i * (speed / count)));
  }
  return delays;
};

const SpiralBallLoader = ({ 
  ballCount = 12,       
  radius = 100,        
  ballRadius = 10,     
  speed = 2.5,           
  ballColor = '#000000', 
  bgColor = '#ffffff',   
  containerPadding = 40
}) => {
  const svgSize = (radius + ballRadius + containerPadding) * 2;
  const center = svgSize / 2;
  const delays = calculateDelays(ballCount, speed);

  return (
    <div 
      className="flex flex-col items-center justify-center select-none"
      style={{ 
        backgroundColor: bgColor,
        minHeight: '100dvh', 
        padding: `${containerPadding}px`
      }}
    >
      <div className="relative" style={{ width: `${svgSize}px`, height: `${svgSize}px` }}>
        <svg 
          width={svgSize} 
          height={svgSize} 
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="overflow-visible"
        >
          <style>{`
            @keyframes oscillateBall {
              0%, 100% {
                transform: translateX(${radius}px); 
              }
              50% {
                transform: translateX(${-radius}px); 
              }
            }
          `}</style>

          <g transform={`translate(${center}, ${center})`}>
            {delays.map((delay, i) => {
              // CHANGED: Multiplying by -i instead of i to reverse the track distribution order,
              // which flips the apparent rolling direction of the spiral.
              const angle = -i * (360 / ballCount);

              return (
                <g 
                  key={`ball-group-${i}`}
                  transform={`rotate(${angle})`}
                >
                  <circle
                    r={ballRadius}
                    fill={ballColor}
                    style={{
                      animation: `oscillateBall ${speed}s ease-in-out infinite`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl font-medium tracking-tight" style={{ color: ballColor }}>
          Please wait until Loading is complete ...
        </p>
        <p className="text-sm mt-1" style={{ color: `${ballColor}90` }}>
          Make sure you have a stable internet connection
        </p>
      </div>
    </div>  
  );
};

export default SpiralBallLoader;