document.addEventListener('DOMContentLoaded', () => {
  let s = skrollr.init({
    mobileCheck: function() {
      return false;
    }
  });
  
  gsap.registerPlugin(ScrollTrigger);

  gsap.to("#intro .text, #intro .blossom-tree", {
    scrollTrigger: {
      trigger: "#intro", 
      pin: true,
      start: "top top",
      end: "+=2000",
      scrub: true, 
    },
    opacity: 0, 
    duration: 1
  });


  let isLanding = false;
  let timeoutIds = []; 

  const landingPage = document.querySelector('.landing-page');
  const main = document.querySelector('main');
  const nav = document.querySelector('.fixed-nav');  
  const blobElement = document.querySelector('.blob');
  const sections = document.querySelectorAll('main section');
  const navItems = document.querySelectorAll('.section-nav li');
  const skillSection = document.querySelector('#skills');
  const spans = skillSection.querySelectorAll('h3 span');
  let isDropdownOpen = false;

  function isMobileView() {
    return window.innerWidth <= 600;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      // 모바일 뷰일 때 opacity 처리
      if (isMobileView() && entry.isIntersecting) {
        navItems.forEach(item => item.style.opacity = '0');
        const currentNavItem = document.querySelector(`.section-nav li a[href="#${entry.target.id}"]`).parentElement;
        if (currentNavItem) {
          currentNavItem.style.opacity = '1';
        }
      }

      // current 클래스 처리
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove('current'));
        const currentNavItem = document.querySelector(`.section-nav li a[href="#${entry.target.id}"]`).parentElement;
        if (currentNavItem) {
          currentNavItem.classList.add('current');
        }

        // skills 섹션 관련 처리
        if (entry.target.id === 'skills') {
          spans.forEach((span, index) => {
            const timeoutId = setTimeout(() => {
              span.classList.add('visible');
            }, index * 200);
            timeoutIds.push(timeoutId);
          });
        }
      } else if (entry.target.id === 'skills') {
        timeoutIds.forEach(id => clearTimeout(id));
        timeoutIds = [];
        spans.forEach(span => {
          span.classList.remove('visible');
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  nav.addEventListener('mouseover', (e) => {
    nav.classList.add('active');
  });
  nav.addEventListener('mouseout', (e) => {
    nav.classList.remove('active');
  });
  
  nav.addEventListener('click', () => {
    if (isMobileView()) {
      isDropdownOpen = !isDropdownOpen;
      nav.classList.toggle('dropdown-open', isDropdownOpen);
    }
  });

  if (!isLanding) {
    document.body.classList.add('landing');
  }

  setTimeout(() => {
    landingPage.style.display = 'none';
    main.style.visibility = 'visible';
    nav.style.visibility = 'visible';

    setTimeout(() => {
      main.style.opacity = '1';
      nav.style.opacity = '1';
      isLanding = true;
      document.body.classList.remove('landing');
    }, 50);
  }, 2000);

  const blob = createBlob({
    element: blobElement,
    numPoints: 10,
    centerX: 490,
    centerY: 490,
    minRadius: 360,
    maxRadius: 420,
    minDuration: 1,
    maxDuration: 2
  });
  
  function createBlob(options) {
    let points = [];
    let path = options.element;
    let slice = (Math.PI * 2) / options.numPoints;
    let startAngle = random(Math.PI * 2);

    let tl = new TimelineMax({
      onUpdate: update
    });

    for (let i = 0; i < options.numPoints; i++) {
      let angle = startAngle + i * slice;
      let duration = random(options.minDuration, options.maxDuration);
      let point = {
        x: options.centerX + Math.cos(angle) * options.minRadius,
        y: options.centerY + Math.sin(angle) * options.minRadius
      };
      let tween = TweenMax.to(point, duration, {
        x: options.centerX + Math.cos(angle) * options.maxRadius,
        y: options.centerY + Math.sin(angle) * options.maxRadius,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeInOut
      });

      tl.add(tween, -random(duration));
      points.push(point);
    }

    options.tl = tl;
    options.points = points;

    function update() {
      path.setAttribute("d", cardinal(points, true, 1));
    }

    return options;
  }

  function cardinal(data, closed, tension) {
    if (data.length < 1) return "M0 0";
    if (tension == null) tension = 1;

    let size = data.length - (closed ? 0 : 1);
    let path = "M" + data[0].x + " " + data[0].y + " C";

    for (let i = 0; i < size; i++) {
      let p0, p1, p2, p3;

      if (closed) {
        p0 = data[(i - 1 + size) % size];
        p1 = data[i];
        p2 = data[(i + 1) % size];
        p3 = data[(i + 2) % size];
      } else {
        p0 = i == 0 ? data[0] : data[i - 1];
        p1 = data[i];
        p2 = data[i + 1];
        p3 = i == size - 1 ? p2 : data[i + 2];
      }

      let x1 = p1.x + (p2.x - p0.x) / 6 * tension;
      let y1 = p1.y + (p2.y - p0.y) / 6 * tension;

      let x2 = p2.x - (p3.x - p1.x) / 6 * tension;
      let y2 = p2.y - (p3.y - p1.y) / 6 * tension;

      path += " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + p2.x + " " + p2.y;
    }

    return closed ? path + "z" : path;
  }

  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    if (min > max) {
      let tmp = min;
      min = max;
      max = tmp;
    }
    return min + (max - min) * Math.random();
  }

  const skillItems = document.querySelectorAll('#skills ul li');
  let activeIndex = 0;
  let slideInterval;

  function updateSlider() {
    skillItems.forEach((item, index) => {
      item.classList.remove('active', 'prev', 'next' , 'view');
      item.style.opacity = '0.2'; 
      if (index === activeIndex) {
        item.classList.add('active');
        item.style.opacity = '1'; 
      } else if (index === (activeIndex - 1 + skillItems.length) % skillItems.length) {
        item.classList.add('prev');
        item.style.opacity = '1'; 
      } else if (index === (activeIndex + 1) % skillItems.length) {
        item.classList.add('next');
        item.style.opacity = '1'; 
      }
    });
  }

  function nextSlide() {
    activeIndex = (activeIndex + 1) % skillItems.length;
    updateSlider();
  }

  function startSlideInterval() {
    // slideInterval = setInterval(nextSlide, 5000); 
  }

  function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
  }

  skillItems.forEach((item, index) => {
    // const round = item.querySelector('.round');
    // const circle = round.querySelector('.circle');
    // const percent = parseFloat(item.getAttribute('data-percent')) || 0;
    // const roundRadius = parseFloat(circle.getAttribute('r')) || 0;
    // const roundCircum = 2 * Math.PI * roundRadius;

    // circle.style.strokeDasharray = `0 ${roundCircum}`;

    // item.addEventListener('click', () => {
    //   // 클릭 시 애니메이션 적용
    //   circle.style.transition = 'stroke-dasharray 2s ease-in-out';
    //   const drawValue = (percent * roundCircum) / 100;
    //   circle.style.strokeDasharray = `${drawValue} ${roundCircum - drawValue}`;

    //   // 다른 아이템 초기화
    //   skillItems.forEach((otherItem) => {
    //     if (otherItem !== item) {
    //       const otherCircle = otherItem.querySelector('.circle');
    //       otherCircle.style.strokeDasharray = `0 ${roundCircum}`;
    //     }
    //   });
    // });

    // const round = item.querySelector('.round');
    // if (round) {
    //   const circle = round.querySelector('.circle');
    //   if (circle) {
    //     const roundRadius = circle.getAttribute('r');
    //     const roundPercent = item.getAttribute('data-percent');
    //     const roundCircum = 2 * Math.PI * roundRadius;
    //     const roundDraw = (roundPercent * roundCircum) / 100;

    //     circle.style.setProperty('--percent', roundPercent);

    //     // round.style.strokeDasharray = `${roundDraw} 999`;
    //   }
    // }

    item.addEventListener('click', () => {
      if (index === activeIndex) {
        item.classList.toggle('view');

        // const circle = item.querySelector('.circle');
        // if (circle) {
        //   const percent = item.getAttribute('data-percent');
        //   const roundRadius = circle.getAttribute('r');
        //   const roundCircum = 2 * Math.PI * roundRadius;
        //   const roundDraw = (percent * roundCircum) / 100;

        //   // Update the CSS variable for percent
        //   circle.style.setProperty('--percent', percent);

        //   circle.style.strokeDasharray = `${roundDraw} 999`;
        // }

        skillItems.forEach((otherItem, otherIndex) => {
          if (otherIndex !== index) {
            if (item.classList.contains('view')) {
              otherItem.classList.add('other-active');
            } else {
              otherItem.classList.remove('other-active');
            }
          }
        });
      } else {
        activeIndex = index;
        updateSlider();
        resetSlideInterval();
      }
    });
  });

  startSlideInterval(); 
  updateSlider();

  const timeline = document.querySelector('.timeline');
  const timelineObserverOptions = {
    root: null, 
    rootMargin: '0px 0px -100% 0px', 
    threshold: 0 
  };
  
  const timelineObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('active');
      } else {
        timeline.classList.remove('active');
      }
    });
  };

  const timelineObserver = new IntersectionObserver(timelineObserverCallback, timelineObserverOptions);
  timelineObserver.observe(timeline);


  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineItemObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 
  };

  const timelineItemObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
      }
    });
  };

  const timelineItemObserver = new IntersectionObserver(timelineItemObserverCallback, timelineItemObserverOptions);

  timelineItems.forEach(item => {
    timelineItemObserver.observe(item);
  });
});