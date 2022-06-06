import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Swiper from 'swiper/swiper-bundle';

gsap.registerPlugin(ScrollTrigger);

export default class blockHistory {
  constructor() {
    this.wrap = document.querySelector('[data-history-wrap]');
    if (!this.wrap) return;

    this.render();
  }

  render() {
    this.initSlider();

    gsap.utils.toArray('[data-tab-pane]').forEach((stage, index) => {
      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
            ScrollTrigger.create({
              id: 'trigger',
              trigger: stage,
              start: 'top center',
              end: 'center center',
              onEnter: () => {
                  this.slider.slideTo(index, 800);

                  this.toggleActive([...this.slider.slides], index);
              },
              onEnterBack: () => {
                  this.slider.slideTo(index, 800);

                  this.toggleActive([...this.slider.slides], index);
              },
              anticipatePin: 1,
              //markers: true,
            });

            const lastTab = document.querySelectorAll(".tab");
            lastTab[lastTab.length -1].classList.add('last-tab');
        },
      });
    });
  }

  initSlider() {
    this.slider = new Swiper('.block-history [data-slider]', {
      spaceBetween: 0,
      direction: 'vertical',
      slidesPerView: 4,
      touchRatio: false,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      speed: 1300,
      breakpoints: {
        320: {
            slidesPerView: 'auto',
        },
        1024: {
            slidesPerView: 4,
          },
      },
    });
  }

  toggleActive(arr, index = undefined) {
    arr.forEach((el, idx) => {
      const tab = el.querySelector('.tab');

      if (index === idx) {
        el.classList.add('is-active');
        tab.classList.add('tab--active');
      } else {
        el.classList.remove('is-active');
        tab.classList.remove('tab--active');
      }
    });
  }
}