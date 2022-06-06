import Slider from './constructor';


export default {
	init() {
		const sliderPeriod = new Slider({
			init: true,
			wrap: '[data-slider-period-wrap]',
			slider: '[data-slider-period]',
			options: {
				slidesPerView: 'auto',
				allowTouchMove: true,
				speed: 300,
				watchSlidesVisibility: true,
				// loop: true,
				lazy: {
					loadPrevNext: true,
					elementClass: 'swiper-lazy',
				},
				autoHeight: true,
				// breakpoints: {
				// 	768: {
				// 		autoHeight: false,
				// 	},
				// },
			},
		});
	}
}

