import React, { useEffect, useRef } from 'react';
import { useCart } from '../contexts';

export const FlyingAnimation: React.FC = () => {
  const { flyingAnimations, removeFlyingAnimation } = useCart();
  const animationRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    flyingAnimations.forEach(animation => {
      const element = animationRefs.current.get(animation.id);
      if (element) {
        requestAnimationFrame(() => {
          element.style.transform = `translate(${animation.endX - animation.startX}px, ${animation.endY - animation.startY}px) scale(0.3)`;
          element.style.opacity = '0';
        });
        
        setTimeout(() => {
          removeFlyingAnimation(animation.id);
        }, 800);
      }
    });
  }, [flyingAnimations, removeFlyingAnimation]);

  if (flyingAnimations.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {flyingAnimations.map(animation => (
        <div
          key={animation.id}
          ref={(el) => {
            if (el) animationRefs.current.set(animation.id, el);
          }}
          className="absolute w-12 h-12 rounded-full overflow-hidden shadow-lg"
                     style={{
             left: animation.startX - 24,
             top: animation.startY - 24,
             transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
             transform: 'translate(0, 0) scale(1)',
             opacity: '1',
             zIndex: 1000
           }}
        >
          <img
            src={animation.imageUrl}
            alt="Flying product"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};
