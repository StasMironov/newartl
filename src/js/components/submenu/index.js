import gsap from 'gsap';
import { throttle } from 'throttle-debounce';

export default {
	init() {
		const header = document.querySelector('header.header');
		if (!header) return;

		const triggers = header.querySelectorAll('[data-submenu-trigger]');
		if (!triggers.length) return;

		triggers.forEach((trigger) => {
			const items = trigger.querySelectorAll('[data-item]');
			const parentItems = trigger.querySelector('[data-items]');
			const links = parentItems.querySelectorAll('[data-item]');

			const timeline = gsap.fromTo(
				items,
				{
					translateY: 20,
					opacity: 0,
				},
				{
					stagger: 0.05,
					translateY: 0,
					opacity: 1,
					duration: 0.12,
					ease: 'power1.out',
					paused: true,
				}
			);

			trigger.addEventListener(
				'mouseenter',
				throttle(100, () => {
					header.classList.add('submenu-opened');
					trigger.classList.add('is-active');

					timeline.play().delay(0.3);
				})
			);

			trigger.addEventListener(
				'mouseleave',
				throttle(100, () => {
					header.classList.remove('submenu-opened');
					trigger.classList.remove('is-active');

					timeline.reverse().delay(0);
				})
			);

			if (links.length <= 0) return;

			links.forEach.call(links, function (e, i, items) {
				e.addEventListener('mouseenter', function () {
					console.clear();
					links.forEach.call(
						items,
						function (e) {
							if (e !== this) {
								let childEl = e.querySelector('[data-link]');
								childEl.classList.add('no-hover');
							} else {
								let childEl = e.querySelector('[data-link]');
								childEl.classList.add('is-hover');
							}
						},
						this
					);
				});
				e.addEventListener('mouseleave', function () {
					console.clear();
					links.forEach.call(
						items,
						function (e) {
							if (e !== this) {
								let childEl = e.querySelector('[data-link]');
								childEl.classList.remove('no-hover');
							} else {
								let childEl = e.querySelector('[data-link]');
								childEl.classList.remove('is-hover');
							}
						},
						this
					);
				});
			});
		});
	},
};
