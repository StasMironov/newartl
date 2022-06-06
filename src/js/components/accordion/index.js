import gsap from 'gsap';

export default {
	init() {
		

		// let form = document.querySelector('[data-search-form]');
		// console.log(form);
		
		// $('[data-search-form]').submit(function (evt) {
		// 	evt.preventDefault();
		// 	console.log('1');
		// });

		const accordions = document.querySelectorAll('[data-accordion]');

		if (!accordions.length) return;

		const timelines = [];

		for (let i = 0; i < accordions.length; i++) {
			const accordion = accordions[i];

			const toggle = accordion.querySelector('[data-toggle]');
			if (!toggle) continue;

			const roll = accordion.querySelector('[data-roll]');
			if (!roll) continue;

			let state = false;

			const timeline = gsap.timeline({
				paused: true,
				onStart: () => {
					state = true;
				},
				onComplete: () => {
					//window.ls.update();
				},
				onReverseComplete: () => {
					state = false;
					//	window.ls.update();
				},
			});

			timeline.fromTo(
				roll,
				{
					minHeight: 0,
					height: 0,
				},
				{
					minHeight: 'auto',
					height: 'auto',
					duration: '0.6',
					ease: 'power1.out',
				}
			);

			timelines.push(timeline);

			toggle.addEventListener('click', () => {
				if (state) {
					accordion.classList.remove('is-active');
					timelines[i].reverse();
				} else {
					accordion.classList.add('is-active');
					timelines[i].play();
				}
			});
		}
	},
};
