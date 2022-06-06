import gsap from 'gsap';
import { isDesktop, isTablet } from '../../utils/breakpoints';

export default class blockProduct {
	constructor() {
		this.supportsTouch = 'ontouchstart' in document.documentElement;
		this.nodes = document.querySelectorAll('[data-product-wrap]');
		if (this.nodes && this.nodes.length > 0) {
			this.nodes.forEach((node) => {
				this.render(node);
			});
		}
	}

	render(node) {
		if (this.supportsTouch) return;
		
		const topNode = node.querySelector('[data-pin-top]');
		const progress = topNode.querySelector('[data-pin-progress]');
		const sections = gsap.utils.toArray('[data-pin-section]');

		sections.forEach((elem, index) => {
			const title = elem.querySelectorAll('[data-pin-title]');
			const image = elem.querySelectorAll('[data-pin-image]');
			const bottom = elem.querySelectorAll('[data-pin-bottom]');
			const titlePercent = index === 0 ? 200 : 130;
			const imagePercent = index === 0 ? -150 : -180;

			const tl = gsap
				.timeline({
					scrollTrigger: {
						trigger: elem,
						pin: elem,
						scrub: true,
						start: `top top`,
						end: '+=200%',
						onEnter() {
							topNode.style.position = 'fixed';
						},
						onEnterBack() {
							topNode.style.position = 'fixed';
						},
						onLeave() {
							if (index === sections.length - 1) {
								topNode.style.position = '';
							}
						},
						onLeaveBack() {
							if (index === 0) {
								topNode.style.position = '';
							}
						},
						onUpdate(self) {
							progress.style.width = `${Math.ceil(
								self.progress * 100
							)}%`;
						},
					},
				})
				.from(
					title,
					{
						yPercent: titlePercent,
						duration: 0.6,
						ease: 'power4.out',
					},
					0
				)
				.fromTo(
					image,
					{
						yPercent: 200,
						duration: 1.1,
						ease: 'power4.out',
					},
					{
						yPercent: imagePercent,
					},
					0
				)
				.from(
					bottom,
					{
						yPercent: 300,
						duration: 0.5,
						ease: 'power4.out',
					},
					0.2
				);
		});

		// для корректного отображения data-pin-top при первой загрузке страницы
		setTimeout(() => {
			if (node.getBoundingClientRect().top > 0) {
				topNode.style.position = '';
				
			}
			//window.dispatchEvent(new Event('resize'));
		});

		// console.log(document.querySelectorAll('[data-product-wrap]').getBoundingClientRect().top);
	}
}
