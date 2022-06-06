import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export default {
	init() {
		const header = document.querySelector('header.header');
		if (!header) return;
		let classesToAdd = ['in-progress', 'show-header'];

		
		ScrollTrigger.create({
			trigger: 'body',
			start: 'top top',
			onUpdate: (self) => {
				if (self.direction > 0) {
					header.classList.add('is-hide');
				} else {
					header.classList.remove('is-hide');

					if (self.progress !== 0) {
						header.classList.add(...classesToAdd);
					} else {
						header.classList.remove(...classesToAdd);
					}
				}
			},
		});
	},
};
