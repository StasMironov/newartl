import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

export default {
	init() {
		//console.log('scrollto');
		if (
			document.querySelectorAll('[data-btn-handler]').length > 0 &&
			document.querySelector('[data-scroll-target]').length > 0
		) {
			const scrollTarget = document.querySelector('[data-scroll-target]');
			const btnHandler = document.querySelectorAll('[data-btn-handler]');
			btnHandler.forEach((element) => {
				element.addEventListener('click', function () {
					gsap.to(window, {
						duration: 0.8,
						scrollTo: { y: scrollTarget, offsetY: 80 },
					});
				});
			});
		}
	},
};
