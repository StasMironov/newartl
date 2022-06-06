import { isDesktop } from '../../utils/breakpoints';
import Slider from './constructor';

export default {
	init() {
		if (document.querySelector('[data-slider-photo-wrap]')) {
			try {
				const pagSlide = new Slider({
					init: true,
					wrap: '[data-slider-photo-wrap]',
					slider: '[data-pag]',
					options: {
						slidesPerView: 5,
						spaceBetween: 20,
						// touchRatio: false, // TODO дублирует touchRatio: 0.2
						//loop: true,
						slideToClickedSlide: true,
						touchRatio: 0.2,
						breakpoints: {
							359: {
								spaceBetween: 16,
								slidesPerView: 3,
							},
							641: {
								slidesPerView: 5,
							},
							769: {
								spaceBetween: 20,
								slidesPerView: 5,
							},
						},
						observer: true,
  						observeParents: true,
						on: {
              beforeInit: function () {
                let numOfSlides = this.wrapperEl.querySelectorAll(".swiper-slide").length;
								if (numOfSlides >= 5) {
									document.querySelector('[data-pag]').classList.add('overlay');
								}
              },
							init() {
							},
							touchEnd() {
								const lastSlide = this.slides[this.slides.length - 1];
								if (
									$(lastSlide).hasClass('swiper-slide-thumb-active')
								) {
									document
										.querySelector('[data-pag]')
										.classList.remove('overlay');
								} else {
									document
										.querySelector('[data-pag]')
										.classList.add('overlay');
								}
							},
						},
					},
				});
		
				const sliderPhoto = new Slider({
					init: true,
					wrap: '[data-slider-photo-wrap]',
					slider: '[data-slider-photo]',
					prev: '[data-nav-arrow-prev]',
					next: '[data-nav-arrow-next]',
					options: {
						slidesPerView: 'auto',
						allowTouchMove: true,
						speed: 500,
						watchSlidesVisibility: true,
						loop: true,
						fadeEffect: { crossFade: true },
						effect: 'fade',
						lazy: {
							loadPrevNext: true,
							elementClass: 'swiper-lazy',
						},
						autoHeight: false,
						breakpoints: {
							768: {
								autoHeight: false,
							},
						},
						observer: true,
  						observeParents: true,
						thumbs: {
							swiper: pagSlide.swiper,
						},
						on: {
							init() {
								if (
									!!this.slides &&
									!!this.visibleSlidesIndexes &&
									this.slides.length <=
										this.visibleSlidesIndexes.length
								) {
									this.wrapperEl
										.closest('[data-slider-photo-wrap]')
										.classList.add('nav-hidden');
								}
							},
							slideChangeTransitionStart() {
								const lastSlide =
									pagSlide.swiper.slides[
										pagSlide.swiper.slides.length - 1
									];
								if (
									$(lastSlide).hasClass('swiper-slide-thumb-active')
								) {
									document
										.querySelector('[data-pag]')
										.classList.remove('overlay');
								} else {
									document
										.querySelector('[data-pag]')
										.classList.add('overlay');
								}
							},
						},
					},
				});
				sliderPhoto.update();
				pagSlide.update();
		
				window.addEventListener('resize', () => {
					pagSlide.update();
				});
			} catch (err) {
				console.log(err);
			}
		}
	}
}

