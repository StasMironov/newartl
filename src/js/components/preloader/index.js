import gsap from 'gsap';
// import anime from 'animejs/lib/anime.es.js';
// import KUTE from 'kute.js';

export default class Preloader {
	constructor() {
		this.preloader = null;
		this.progress = null;
		this.progressMask = null;
		this.progressText = null;
		this.progressTextMasked = null;
		this.duration = 1.5;

		this.init();
	}

	updateText(progress) {
		this.progressText.innerHTML = Math.round(progress * 100) + ' %';
		// this.progressTextMasked.innerHTML = Math.round(progress * 100) + ' %';
	}

	animate() {
		let els = this.progress;
		let that = this;
        
		gsap.set(els, { x: '-100%', rotation: 0, opacity: 1});

		gsap.to(els, {
			x: '0%',
			duration: this.duration,
			
			delay: 0.35,
			//ease: 'power4.out',
			force3D: true,
			onStart() {
				document.body.classList.add('preloading');
			},
			onUpdate() {
				that.updateText(this.progress())
			},
			onComplete() {
				that.onComplete();
			},
		});
	}

	onComplete() {
		window.dispatchEvent(new CustomEvent('preloader:complete'));

		let that = this;

		sessionStorage.setItem('preloader', 'initialize');

		document.body.classList.remove('preloading');

		gsap.to(this.preloader, {
			onComplete() {
				that.preloader.style.display = 'none';
				window._enableScroll();
			},
		});
	}

	init() {
		//window._disableScroll();

		this.preloader = document.querySelector('.preloader');

		if(!this.preloader) return;

		this.progress = this.preloader.querySelector('[data-preloader-progress]');
		this.progressText = this.preloader.querySelector('[data-preloader-num]');
       


		
		if (sessionStorage.getItem('preloader') !== 'initialize') {
			this.animate();
        
		} else {
			//this.preloader.classList.add('hidden');
			//window.dispatchEvent(new CustomEvent('preloader:complete'));
			this.preloader.classList.add('hidden');
		}
	}
}
