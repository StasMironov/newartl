export default class ScrollAnimation {
	constructor(props) {
		this.threshold = 0.05; // For Observer
		this.rootMargin = '50px'; // For Observer
		this.observer = null;

		this.selector =
			'[data-animate], [data-animate-custom], [data-animate-sequence]';
		this.animateClassName = 'animate';

		this.stepSelector = '[data-animate-step]';

		this.init();
	}

	animate(el) {
		el.classList.add(this.animateClassName);
	}

	animateReverse(el) {
		el.classList.remove(this.animateClassName);
	}

	animateStep(el, i) {
		const delay = el.dataset.animateDelay || 200;

		setTimeout(() => {
			el.classList.add(this.animateClassName);
		}, delay * i);
	}

	initAnimation() {
		const els = document.querySelectorAll(this.selector);

		[...els].forEach((el) => this.observer.observe(el));
	}

	initStepAnimation() {
		const els = document.querySelectorAll(this.stepSelector);

		[...els].forEach((el) => this.observer.observe(el));
	}

	initUserTextAnimation() {
		const els = document.querySelectorAll('[data-animate-user-text]');

		[...els].forEach((block) => {
			const toAnimate = block.children;
			const repeat =
				block.getAttribute('data-animate-user-text') === 'repeat';

			[].slice
				.call(toAnimate)
				// .filter(
				// 	(el) =>
				// 		// el.tagName !== 'DIV' && !el.classList.contains('plyr')
				// )
				.forEach((el) => {
					if (repeat) {
						el.setAttribute('data-repeat', '');
					}

					this.userTextObserver.observe(el);
				});
		});
	}

	initObservers() {
		this.observer = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry, i) => {
					const repeat =
						entry.target.getAttribute('data-animate-repeat') !==
						null;

					if (entry.intersectionRatio >= this.threshold) {
						if (
							entry.target.getAttribute('data-animate-step') !==
							null
						) {
							this.animateStep(entry.target, i);
						} else {
							this.animate(entry.target);
						}

						if (!repeat) {
							observer.unobserve(entry.target);
						}
					} else if (repeat) {
						this.animateReverse(entry.target);
					}
				});
			},
			{
				rootMargin: this.rootMargin,
				threshold: this.threshold,
			}
		);

		this.userTextObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					const repeat =
						entry.target.getAttribute('data-repeat') !== null;

					if (entry.intersectionRatio >= this.threshold) {
						this.animate(entry.target);

						if (!repeat) {
							observer.unobserve(entry.target);
						}
					} else if (repeat) {
						this.animateReverse(entry.target);
					}
				});
			},
			{
				rootMargin: this.rootMargin,
				threshold: this.threshold,
			}
		);
	}

	init() {
		document.documentElement.classList.remove('animate-disabled');
		this.initObservers();

		// Init default animation
		this.initAnimation();

		// Init step animation
		this.initStepAnimation();

		// Init user text animation
		this.initUserTextAnimation();
	}
}
