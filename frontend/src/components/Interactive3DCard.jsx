import React, { useRef, useState, useEffect } from 'react';

const Interactive3DCard = ({ 
  children, 
  className = '', 
  defaultTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)', 
  maxTilt = 15, 
  scale = 1.02, 
  style = {}
}) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState(defaultTransform);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Calculate rotation: centers are 0
    const rotX = ((0.5 - y) * maxTilt).toFixed(2);
    const rotY = ((x - 0.5) * maxTilt).toFixed(2);

    setTransformStyle(`perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle(defaultTransform);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered 
          ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease' 
          : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

export default Interactive3DCard;
