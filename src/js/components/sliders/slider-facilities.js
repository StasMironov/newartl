import gsap from 'gsap';
import Slider from './constructor';

export default {
	init() {
		if (document.querySelector('[data-slider-facilities-wrap]')) {
			const sliderFacilities = new Slider({
				init: true,
				wrap: '[data-slider-facilities-wrap]',
				slider: '[data-slider-facilities]',
				prev: '[data-nav-arrow-prev]',
				next: '[data-nav-arrow-next]',
				//initialSlide: 0,
				options: {
					allowTouchMove: true,
					speed: 500,
					watchSlidesVisibility: true,
					watchSlidesProgress: true,
					slideToClickedSlide: true,
					fadeEffect: { crossFade: true },
					effect: 'fade',
					// loop: true,
					observer: true,
					observeParents: true,
					lazy: {
						loadPrevNext: true,
						elementClass: 'swiper-lazy',
					},
					autoHeight: false,
				},
			});
		
			sliderFacilities.update();
		}
	}
}


