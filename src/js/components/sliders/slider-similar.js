import { isDesktop } from '../../utils/breakpoints';
import Slider from './constructor';

export default {
	init() {
		const sliderSimilar = new Slider({
			init: true,
			wrap: '[data-slider-similar-wrap]',
			slider: '[data-slider-similar]',
			prev: '[data-nav-arrow-prev]',
			next: '[data-nav-arrow-next]',
			options: {
				slidesPerView: '3',
				allowTouchMove: true,
				spaceBetween: 10,
				speed: 1300,
				// loop: true,
				watchSlidesVisibility: true,
				observer: true,
				observeParents: true,
				lazy: {
					loadPrevNext: true,
					elementClass: 'swiper-lazy',
				},
				autoHeight: false,
				breakpoints: {
					360: {
						slidesPerView: '1',
					},
					641: {
						slidesPerView: '2',
					},
					939: {
						slidesPerView: '3',
					},
				},
				on: {
					init() {
						if (
							!!this.slides &&
							!!this.visibleSlidesIndexes &&
							this.slides.length <= this.visibleSlidesIndexes.length
						) {
							this.wrapperEl
								.closest('[data-slider-similar-wrap]')
								.classList.add('nav-hidden');
						}
					},
					resize() {
						if (
							!!this.slides &&
							!!this.visibleSlidesIndexes &&
							this.slides.length <= this.visibleSlidesIndexes.length
						) {
							this.wrapperEl
								.closest('[data-slider-similar-wrap]')
								.classList.add('nav-hidden');
						} else {
							this.wrapperEl
								.closest('[data-slider-similar-wrap]')
								.classList.remove('nav-hidden');
							//this.slideTo(0);
						}
					},
				},
			},
		});
	}
}


