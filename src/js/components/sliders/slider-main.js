import gsap from 'gsap';
import Hammer from 'hammerjs';

export default class Slider {
	constructor() {
		this.sliderWrapNode = document.querySelector('[data-main-hero]');
		this.selectors = {
			imageWrap: '[data-image-wrap]',
			slide: '[data-slide]',
			prev: '[data-nav-arrow-prev]',
			next: '[data-nav-arrow-next]',
			image: '[data-image]',
			title: '[data-title]',
			action: '[data-action]',
			arrows: '.nav-arrows',
			number: '[data-number]',
			progressLine: '[data-progress]',
			videoNode: '[data-video-main]',
		};

		if (this.sliderWrapNode) this.render();
	}

	render() {
		this.slides = this.sliderWrapNode.querySelectorAll(
			this.selectors.slide
		);

		if (!this.slides.length) return;



		this.body = document.querySelector('main');

		this.activeIndex = 0;
		this.prevIndex = 0;
		this.slidesAmount = this.slides.length;
		this.inTransition = false;

		this.dark = this.slides[0].classList.contains('is-dark');

		this.timeline = gsap.timeline({
			paused: true,
			onStart: () => {
				this.sliderWrapNode.classList.add('is-dirty'); // добавление класса при первой смене слайда
			},
			onComplete: () => {
				this.sliderWrapNode.classList.remove('in-transition');
				this.inTransition = false;
			},
		});

		this.prev = this.sliderWrapNode.querySelector(this.selectors.prev);
		this.next = this.sliderWrapNode.querySelector(this.selectors.next);

		this.arrows = this.sliderWrapNode.querySelector(this.selectors.arrows);

		if (this.dark) {
			this.body.classList.add('dark-slide-is-active');
			this.arrows.classList.add('nav-arrows--on-black');
		} else {
			this.body.classList.remove('dark-slide-is-active');
			this.arrows.classList.remove('nav-arrows--on-black');
		}

		this.numbers = this.sliderWrapNode.querySelectorAll(
			this.selectors.number
		);

		this.numbers.forEach((el, idx) => {
			el.addEventListener('click', () => {
				if (el.classList.contains('is-active') || this.inTransition)
					return;

				this.slideChange([idx, this.activeIndex]);

				this.numbersClassToggle(idx); // смена активной кнопки
			});
		});

		this.prev.addEventListener('click', () => {
			this.slideChange(this.calcPrevNextIndex('prev')); // расчёт activeIndex, prevIndex, добавление/удаление класса is-active, вызов animation()
		});
		this.next.addEventListener('click', () => {
			this.slideChange(this.calcPrevNextIndex()); // расчёт activeIndex, prevIndex, добавление/удаление класса is-active, вызов animation()
		});

		this.autoplayInterval =
			this.sliderWrapNode.getAttribute('data-autoplay') || null;
		this.progressLine = null;
		this.timerTimeline = gsap.timeline({
			paused: true,
		});

		this.manager = new Hammer.Manager(this.sliderWrapNode);
		this.swipe = new Hammer.Swipe({
			direction: Hammer.DIRECTION_HORIZONTAL,
		});
		this.manager.add(this.swipe);

		this.manager.on('swipeleft', () => {
			this.slideChange(this.calcPrevNextIndex());
		});

		this.manager.on('swiperight', () => {
			this.slideChange(this.calcPrevNextIndex('prev'));
		});

		if (this.autoplayInterval) {
			// автоматическая смена слайдов
			this.progressLine = this.sliderWrapNode.querySelector(
				this.selectors.progressLine
			);

			this.timerTimeline.fromTo(
				this.progressLine,
				{
					x: '-100%',
				},
				{
					x: 0,
					ease: 'none',
					duration: this.autoplayInterval / 1000,
					delay: 1.5, // ~ продолжительность анимации при смене слайдов
					clearProps: 'all',
					onComplete: () => {
						this.slideChange(this.calcPrevNextIndex());
					},
				}
			);

			this.timerTimeline.play();
		}

		const activeVideoNode = this.slides[this.activeIndex].querySelector(
			this.selectors.videoNode
		);

		if (activeVideoNode) {
			this.videoCheck(activeVideoNode);
		}

		
	}

	calcPrevNextIndex(direction = 'next') {
		let activeIndex = 0;
		let prevIndex = 0;

		if (direction === 'prev') {
			if (this.activeIndex !== 0) {
				// расчёт activeIndex
				activeIndex = this.activeIndex - 1;
			} else {
				activeIndex = this.slidesAmount - 1;
			}
			if (activeIndex === this.slidesAmount - 1) {
				// расчёт prevIndex
				prevIndex = 0;
			} else {
				prevIndex = activeIndex + 1;
			}
		}

		if (direction === 'next') {
			if (this.activeIndex < this.slidesAmount - 1) {
				// расчёт activeIndex
				activeIndex = this.activeIndex + 1;
			} else {
				activeIndex = 0;
			}
			if (activeIndex !== 0) {
				// расчёт prevIndex
				prevIndex = activeIndex - 1;
			} else {
				prevIndex = this.slidesAmount - 1;
			}
		}

		return [activeIndex, prevIndex];
	}

	slideChange([nextIndex, prevIndex]) {
		if (this.inTransition) return;

		this.inTransition = true;
		this.sliderWrapNode.classList.add('in-transition'); // для transition-delay при смене слайдов

		this.classToggle(this.slides[this.activeIndex], true); // удаление класса is-active и добавление is-prev

		if (this.autoplayInterval) {
			// автоматическая смена слайдов
			this.timerTimeline.restart();
		}

		this.activeIndex = nextIndex;
		this.prevIndex = prevIndex;

		this.numbersClassToggle(this.activeIndex); // смена активной кнопки

		this.classToggle(this.slides[this.activeIndex], false); // добавление класса is-active

		this.dark = this.slides[this.activeIndex].classList.contains('is-dark'); // если активный слайд - is-dark

		this.animation();
	}

	findNode(index, selector) {
		// поиск элемента в слайде
		return this.slides[index].querySelector(selector);
	}

	animation() {
		this.timeline
			.fromTo(
				this.findNode(this.prevIndex, this.selectors.title),
				{
					opacity: 1,
					y: 0,
				},
				{
					y: 20,
					opacity: 0,
					duration: 0.4,
					ease: 'power1.out',
				}
			)
			.fromTo(
				this.findNode(this.prevIndex, this.selectors.action),
				{
					opacity: 1,
					y: 0,
				},
				{
					y: 20,
					opacity: 0,
					duration: 0.4,
					ease: 'power1.out',
				},
				'<+=0.2'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.title),
				{
					opacity: 0,
					y: 20,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.4,
					ease: 'power1.out',
				},
				'+=0.4'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.action),
				{
					opacity: 0,
					y: 20,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.4,
					ease: 'power1.out',
				},
				'<+=0.2'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.imageWrap),
				{
					'clip-path': 'circle(0% at 50% 50%)',
				},
				{
					'clip-path': 'circle(100% at 50% 50%)',
					duration: 1.5,
					clearProps: 'all',
					ease: 'sine.out',
					onStart: () => {
						if (this.dark) {
							this.body.classList.add('dark-slide-is-active');
							this.arrows.classList.add('nav-arrows--on-black');
						} else {
							this.body.classList.remove('dark-slide-is-active');
							this.arrows.classList.remove(
								'nav-arrows--on-black'
							);
						}
					},
				},
				'-=1'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.image),
				{
					rotation: 15,
				},
				{
					rotation: 0,
					duration: 1.25,
					clearProps: 'all',
					ease: 'circ.out',
				},
				'-=1.5'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.image),
				{
					scale: 1.2,
				},
				{
					scale: 1,
					duration: 1.3,
					clearProps: 'all',
					ease: 'power1.out',
				},
				'-=1.5'
			);

		this.timeline.play();
	}

	classToggle(slide, remove = false) {
		if (remove) {
			for (let i = 0; i < this.slides.length; i++) {
				if (slide === this.slides[i]) continue;
				this.slides[i].classList.remove('is-prev');
			}
			slide.classList.add('is-prev');
			slide.classList.remove('is-active');

			const prevVideoNode = slide.querySelector(this.selectors.videoNode);

			if (prevVideoNode) {
				this.videoCheck(prevVideoNode, true);
			}
		} else {
			slide.classList.add('is-active');
			const activeVideoNode = this.slides[this.activeIndex].querySelector(
				this.selectors.videoNode
			);

			if (activeVideoNode) {
				this.videoCheck(activeVideoNode);
			}
		}
	}

	numbersClassToggle(idx) {
		for (let i = 0; i < this.numbers.length; i++) {
			if (idx === i) continue;

			this.numbers[i].classList.remove('is-active');
		}

		this.numbers[idx].classList.add('is-active');
	}

	videoCheck(node, hidden = false) {
		if (hidden) {
			const video = node.querySelector('video');

			if (video) {
				video.pause();
				video.currentTime = 0;
			}
		} else {
			const video = node.querySelector('video');

			if (video) {
				video.currentTime = 0;
				video.play();
			}
		}
	}
}
