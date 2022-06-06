import { isDesktop } from '../../utils/breakpoints';
import Slider from './constructor';

export default {
	init() {
		const sliderLogos = new Slider({
			init: true,
			wrap: '[data-slider-logos-wrap]',
			slider: '[data-slider-logos]',
			prev: '[data-nav-arrow-prev]',
			next: '[data-nav-arrow-next]',
			options: {
				slidesPerView: 'auto',
				allowTouchMove: true,
				speed: 300,
				watchSlidesVisibility: true,
				loop: true,
				observer: true,
				observeParents: true,
				lazy: {
					loadPrevNext: true,
					elementClass: 'swiper-lazy',
				},
				autoHeight: true,
				breakpoints: {
					768: {
						autoHeight: false,
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
								.closest('[data-slider-logos-wrap]')
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
								.closest('[data-slider-logos-wrap]')
								.classList.add('nav-hidden');
						} else {
							this.wrapperEl
								.closest('[data-slider-logos-wrap]')
								.classList.remove('nav-hidden');
							//this.slideTo(0);
						}
					},
				},
			},
		});
	}
}


