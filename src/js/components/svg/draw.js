import gsap from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

const Draw = {
	init() {
		//console.log('draw');
		let containers = document.querySelectorAll('[data-icon="draw"]');
		let pathElem;

		gsap.registerPlugin(DrawSVGPlugin);

		const tl = gsap.timeline();

		containers.forEach((element) => {
			pathElem = element.querySelectorAll('.path');
			//console.log(pathElem);

			tl.fromTo(
				pathElem,
				2,
				{
					drawSVG: '0%',
				},
				{
					drawSVG: '100%',
					ease: 'power1.inOut',
				}
			);
		});

		window.animateSvg = tl;
	},
};

export default Draw;
