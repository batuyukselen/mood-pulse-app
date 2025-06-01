import React, { useEffect, useRef } from 'react';
import { EMOJI_DATA } from '../../utils/constants';

const HeroIllustration: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const parentWidth = canvas.parentElement?.clientWidth || 400;
      canvas.width = parentWidth;
      canvas.height = 400;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create emoji particles
    const emojis = EMOJI_DATA.map(emoji => emoji.icon);
    const particles: {
      x: number;
      y: number;
      emoji: string;
      size: number;
      speed: number;
      angle: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];
    
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: 20 + Math.random() * 30,
        speed: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05
      });
    }
    
    // Draw heartbeat line
    const drawHeartbeat = (x: number, width: number) => {
      const height = canvas.height;
      const middleY = height / 2;
      
      ctx.beginPath();
      ctx.moveTo(0, middleY);
      
      // Draw flat line until the pulse
      ctx.lineTo(x - width/2, middleY);
      
      // Draw the pulse
      if (x > width/2 && x < canvas.width - width/2) {
        ctx.lineTo(x - width/4, middleY - height/8);
        ctx.lineTo(x, middleY + height/6);
        ctx.lineTo(x + width/4, middleY - height/8);
      }
      
      // Continue with flat line
      ctx.lineTo(canvas.width, middleY);
      
      ctx.strokeStyle = '#5B3DF4';
      ctx.lineWidth = 3;
      ctx.stroke();
    };
    
    // Animation
    let pulsePosition = -100;
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw heartbeat
      pulsePosition += 2;
      if (pulsePosition > canvas.width + 100) {
        pulsePosition = -100;
      }
      
      drawHeartbeat(pulsePosition, 200);
      
      // Draw emoji particles
      particles.forEach(particle => {
        // Move particle
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        particle.rotation += particle.rotationSpeed;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.angle = Math.PI - particle.angle;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.angle = -particle.angle;
        }
        
        // Draw emoji
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.font = `${particle.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particle.emoji, 0, 0);
        ctx.restore();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto rounded-lg"
        aria-label="Mood Pulse Board illustration with animated emojis and heartbeat"
      ></canvas>
    </div>
  );
};

export default HeroIllustration;