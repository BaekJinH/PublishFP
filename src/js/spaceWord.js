document.addEventListener('DOMContentLoaded', () => {
  const wordRef = document.getElementById('word');
  let time = 0;
  let mouseX = window.innerWidth * 0.75;
  let x = 0;
  let animationFrameId = null;

  const opt = {
    radius: 300,
    radiusY: 0.3,
    maxSpeed: 0.02,
    maxRotation: 50,
    minOpacity: 0.3,
    spacer: '*',
    minRadius: 150,
  };

  const scale = (a, b, c, d, e) => {
    return ((a - b) * (e - d)) / (c - b) + d;
  };

  const lerp = (v0, v1, t) => {
    return v0 * (1 - t) + v1 * t;
  };

  const createInvaders = () => {
    const Letters = wordRef.innerHTML.replace(/\s/g, opt.spacer).split('').reverse();
    wordRef.innerHTML = '';
    const fragment = document.createDocumentFragment();
    Letters.forEach((i) => {
      const l = document.createElement('span');
      l.innerHTML = i;
      fragment.appendChild(l);
    });
    wordRef.appendChild(fragment);
  };

  const animate = () => {
    const letter = wordRef.querySelectorAll('span');
    if (!letter) return;

    x = lerp(x, mouseX / window.innerWidth, 0.1);
    const rotation = -opt.maxRotation + x * opt.maxRotation * 2;
    const speed = -opt.maxSpeed + x * opt.maxSpeed * 2;
    const modY = 1 + x * -2;

    time -= speed;

    letter.forEach((i, ind) => {
      const theta = 1 - ind / letter.length;
      const x = opt.radius * Math.sin(time + theta * Math.PI * 2);
      const y = opt.radius * opt.radiusY * Math.cos(modY + time + theta * Math.PI * 2);
      const s = scale(y, -opt.radius * opt.radiusY, opt.radius * opt.radiusY, opt.minOpacity, 1);

      Object.assign(i.style, {
        zIndex: Math.min(2, Math.max(1, Math.ceil(y))),
        filter: `blur(${4 - 5 * s}px)`,
        opacity: s,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`,
      });
    });
    animationFrameId = requestAnimationFrame(animate);
  };

  const handleMouse = (e) => {
    if (e.type === 'mousemove') {
      mouseX = e.clientX;
    } else if (e.type === 'touchstart' || e.type === 'touchmove') {
      mouseX = e.touches[0]?.clientX || mouseX;
    }
    const centerX = window.innerWidth / 2;
    const distanceFromCenter = Math.abs(mouseX - centerX);
    const maxDistance = centerX;
    opt.radius = scale(distanceFromCenter, 0, maxDistance, opt.minRadius, 300);
  };

  createInvaders();
  animate();
  window.addEventListener('mousemove', handleMouse);
  window.addEventListener('touchstart', handleMouse);
  window.addEventListener('touchmove', handleMouse);

  window.addEventListener('beforeunload', () => {
    window.removeEventListener('mousemove', handleMouse);
    window.removeEventListener('touchstart', handleMouse);
    window.removeEventListener('touchmove', handleMouse);
    cancelAnimationFrame(animationFrameId);
  });
});