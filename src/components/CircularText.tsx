import { useState } from 'react';
import './CircularText.css';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: 'speedUp' | 'slowDown' | 'pause' | 'goBonkers';
  className?: string;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const letters = Array.from(text);

  const getAnimationDuration = () => {
    if (!isHovered) return spinDuration;

    switch (onHover) {
      case 'slowDown':
        return spinDuration * 2;
      case 'speedUp':
        return spinDuration / 4;
      case 'pause':
        return 0;
      case 'goBonkers':
        return spinDuration / 20;
      default:
        return spinDuration;
    }
  };

  const animationStyle = {
    animationDuration: `${getAnimationDuration()}s`,
    animationPlayState: onHover === 'pause' && isHovered ? 'paused' : 'running',
  };

  return (
    <div
      className={`circular-text ${className}`}
      style={animationStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span key={i} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export default CircularText;
