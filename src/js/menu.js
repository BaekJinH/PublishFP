document.addEventListener('DOMContentLoaded', () => {
  const mainButton = document.querySelector('.menu-trigger .main-button');
  const interactMenu = document.querySelector('.menu-trigger .interact-menu');
  const buttonWrapper = document.querySelector('.menu-trigger .button-wrapper');
  const layer = document.querySelector('.menu-trigger .layer');
  const layeredContent = document.querySelector('.menu-trigger .layered-content');
  const closeButton = document.querySelector('.menu-trigger .close-button');

  let isClicked = false;
  let isTimer = false;
  let isActive = false;

  mainButton.addEventListener('click', () => {
    isClicked = true;
    interactMenu.classList.add('visible');
    setTimeout(() => {
      isTimer = true;
      buttonWrapper.classList.add('clicked');
      layer.classList.add('active');
    }, 900);
    setTimeout(() => {
      isActive = true;
      layeredContent.classList.add('active');
    }, 1500);
  });

  closeButton.addEventListener('click', () => {
    isActive = false;
    isTimer = false;
    layeredContent.classList.remove('active');
    layer.classList.remove('active');
    buttonWrapper.classList.remove('clicked');
    setTimeout(() => {
      isClicked = false;
      interactMenu.classList.remove('visible');
    }, 3000);
  });
});