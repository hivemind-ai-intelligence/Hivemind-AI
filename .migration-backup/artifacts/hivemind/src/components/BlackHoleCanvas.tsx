import { useEffect, useRef } from "react";

export default function BlackHoleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 200;
    
    // Mouse interaction
    let mouseX = width / 2;
    let mouseY = height / 2;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHovering = true;
    };
    
    const handleMouseLeave = () => {
      isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      size: number;
      angle: number;
      speed: number;
      distance: number;
      color: string;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * Math.max(width, height) / 1.5 + 50;
        this.x = width / 2 + Math.cos(this.angle) * this.distance;
        this.y = height / 2 + Math.sin(this.angle) * this.distance;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.02 + 0.005;
        
        const colors = [
          'rgba(255, 255, 255, 0.8)',
          'rgba(168, 178, 196, 0.6)',
          'rgba(200, 212, 224, 0.5)',
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(centerX: number, centerY: number) {
        // Spiral inward
        this.angle += this.speed;
        this.distance -= this.distance * 0.01;
        
        // Reset if too close to center
        if (this.distance < 20) {
          this.distance = Math.max(width, height) / 1.5 + 50;
          this.angle = Math.random() * Math.PI * 2;
        }

        // Apply mouse attraction if hovering
        let targetCenterX = width / 2;
        let targetCenterY = height / 2;
        
        if (isHovering) {
          // Slight pull towards mouse
          targetCenterX += (mouseX - width / 2) * 0.1;
          targetCenterY += (mouseY - height / 2) * 0.1;
        }

        this.x = targetCenterX + Math.cos(this.angle) * this.distance;
        this.y = targetCenterY + Math.sin(this.angle) * this.distance;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      
      // Semi-transparent black to create trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw center black hole
      let centerX = width / 2;
      let centerY = height / 2;
      
      if (isHovering) {
        centerX += (mouseX - width / 2) * 0.05;
        centerY += (mouseY - height / 2) * 0.05;
      }

      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 150);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(0.2, 'rgba(10,10,10,0.8)');
      gradient.addColorStop(0.5, 'rgba(50,50,60,0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner void
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      
      // Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Update and draw particles
      particles.forEach(p => {
        p.update(centerX, centerY);
        p.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 bg-black"
      style={{ filter: "contrast(1.2) brightness(0.9)" }}
    />
  );
}
