document.addEventListener('DOMContentLoaded', () => {
  function calculateDashArray(radius, percent) {
    const circumference = 2 * Math.PI * radius;
    const drawValue = (percent / 100) * circumference;
    return { circumference, drawValue };
  }

  const skillItems = document.querySelectorAll('#skills ul li');

  skillItems.forEach((item) => {
    const circle = item.querySelector('.circle');
    const percent = parseFloat(item.getAttribute('data-percent')) || 0;
    const radius = parseFloat(circle.getAttribute('r')) || 0;
    const { circumference } = calculateDashArray(radius, percent);

    circle.style.strokeDasharray = `0 ${circumference}`;
    circle.style.transition = 'none';

    item.addEventListener('click', () => {
      skillItems.forEach((otherItem) => {
        const otherCircle = otherItem.querySelector('.circle');
        const otherRadius = parseFloat(otherCircle.getAttribute('r')) || 0;
        const { circumference: otherCircumference } = calculateDashArray(otherRadius, 0);

        otherCircle.style.transition = 'none';
        otherCircle.style.strokeDasharray = `0 ${otherCircumference}`;
      });

      requestAnimationFrame(() => {
        circle.style.transition = 'stroke-dasharray 1s ease-in-out';
        const { drawValue } = calculateDashArray(radius, percent);
        circle.style.strokeDasharray = `${drawValue} ${circumference - drawValue}`;
      });
    });
  });
});
