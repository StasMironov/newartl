import gsap from 'gsap';
import Hammer from 'hammerjs';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

export default class Slider {
	constructor() {
		
		this.sliderWrapNode = document.querySelector('[data-strategy-slider]');
		
		//if (!this.sliderWrapNode) return;

		this.selectors = {
			imageWrap: '[data-image-wrap]',
			slide: '[data-slide]',
			prev: '[data-nav-arrow-prev]',
			next: '[data-nav-arrow-next]',
			image: '[data-img]',
			title: '[data-title]',
			note: '[data-note]',
			action: '[data-action]',
			arrows: '.nav-arrows',
			progressLine: '[data-progress]',
			text: '[data-text]',
		};
		

		if (this.sliderWrapNode) {
			this.render();
			console.log('render');
		}
		
	}

	drawCircle() {
		
		let containers = document.querySelector('[data-icon="drawCircle"]');
		if(!containers) return;
		console.log('draw');
		let pathElem;

		gsap.registerPlugin(DrawSVGPlugin);

		const tl = gsap.timeline();

		pathElem = containers.querySelector('.path');

		tl.fromTo(
			pathElem,
			10,
			{
				drawSVG: '0%',
			},
			{
				drawSVG: '100%',
				ease: 'none',
			}
		);

		window.animateSvg = tl;
		return window.animateSvg;
	}

	render() {
		this.drawCircle();
		this.slides = this.sliderWrapNode.querySelectorAll(
			this.selectors.slide
		);

		if (!this.slides.length) return;

		this.body = document.querySelector('body');

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

		this.timeline2 = gsap.timeline({
			paused: true,
		});

		this.prev = this.sliderWrapNode.querySelector(this.selectors.prev);
		this.next = this.sliderWrapNode.querySelector(this.selectors.next);

		if (this.prev || this.next) {
			this.arrows = this.sliderWrapNode.querySelector(
				this.selectors.arrows
			);

			this.prev.addEventListener('click', () => {
				this.slideChange(this.calcPrevNextIndex('prev')); // расчёт activeIndex, prevIndex, добавление/удаление класса is-active, вызов animation()
			});
			this.next.addEventListener('click', () => {
				this.slideChange(this.calcPrevNextIndex()); // расчёт activeIndex, prevIndex, добавление/удаление класса is-active, вызов animation()
			});
		}

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
					delay: 0, // ~ продолжительность анимации при смене слайдов
					clearProps: 'all',
					onComplete: () => {
						this.slideChange(this.calcPrevNextIndex());
					},
				}
			);

			this.timerTimeline.play();
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
		//this.drawCircle();
		//this.timline2.restart();

		this.inTransition = true;
		this.sliderWrapNode.classList.add('in-transition'); // для transition-delay при смене слайдов

		this.classToggle(this.slides[this.activeIndex], true); // удаление класса is-active и добавление is-prev

		if (this.autoplayInterval) {
			// автоматическая смена слайдов
			this.timerTimeline.restart();
			this.drawCircle();
		}

		this.activeIndex = nextIndex;
		this.prevIndex = prevIndex;

		this.classToggle(this.slides[this.activeIndex], false); // добавление класса is-active

		this.dark = this.slides[this.activeIndex].classList.contains('is-dark'); // если активный слайд - is-dark
		//this.timeline.restart();
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
					duration: 0.2,
					ease: 'power1.out',
				}
			)
			.fromTo(
				this.findNode(this.prevIndex, this.selectors.note),
				{
					opacity: 1,
					y: 0,
				},
				{
					y: 20,
					opacity: 0,
					duration: 0.2,
					ease: 'power1.out',
				},
				'+=0.1'
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
					duration: 0.2,
					ease: 'power1.out',
				},
				'+=0.2'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.note),
				{
					opacity: 0,
					y: 20,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.2,
					ease: 'power1.out',
				},
				'+=0.1'
			)
			.fromTo(
				this.findNode(this.prevIndex, this.selectors.image),
				{
					opacity: 1,
				},
				{
					opacity: 0,
					duration: 0.2,
					ease: 'power1.out',
				},
				'-=1'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.image),
				{
					opacity: 0,
				},
				{
					opacity: 1,
					duration: 0.2,
					ease: 'power1.out',
				},
				'-=0.4'
			)
			.fromTo(
				this.findNode(this.prevIndex, this.selectors.text),
				{
					opacity: 1,
					y: 0,
				},
				{
					y: 20,
					opacity: 0,
					duration: 0.2,
					ease: 'power1.out',
				},
				'-=1'
			)
			.fromTo(
				this.findNode(this.activeIndex, this.selectors.text),
				{
					opacity: 0,
					y: 20,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.2,
					ease: 'power1.out',
				},
				'-=0.4'
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
		} else {
			slide.classList.add('is-active');
		}
	}
}
