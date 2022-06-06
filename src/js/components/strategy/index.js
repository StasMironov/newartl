import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Power0 } from 'gsap/all';
import { debounce } from 'throttle-debounce';
import { isDesktop } from '../../utils/breakpoints';

class Strategy {
	constructor(props) {
		if (
			!(props.wrap instanceof HTMLElement) ||
			!isDesktop() ||
			document.documentElement.classList.contains('is-touch')
		)
			return;
		this.wrap = props.wrap;

		this.cards = this.wrap.querySelectorAll('[data-card]');
		if (!this.cards.length) return;

		this.forward = true;
		this.lastTime = 0;
		this.isClear = true;
		this.scrollTriggerId = 'strategy';

		if (isDesktop()) {
			this.init();
		}
		window.addEventListener(
			'resize',
			debounce(100, () => {
				if (isDesktop() && this.isClear) {
					this.init(this.cards.length - 1);
				} else if (!isDesktop() && !this.isClear) {
					this.remove();
				}
			})
		);
	}

	checkDirection(tl) {
		const newTime = tl.time();
		if (
			(this.forward && newTime < this.lastTime) ||
			(!this.forward && newTime > this.lastTime)
		) {
			this.forward = !this.forward;
		}
		this.lastTime = newTime;
	}

	init(activeCardId = 0) {
		this.isClear = false;
		this.tl = gsap.timeline({
			scrollTrigger: {
				id: this.scrollTriggerId,
				trigger: this.wrap,
				start: 'center center',
				end: `+=${this.cards.length - 1}00%`,
				scrub: true,
				pin: true,
				ease: Power0.easeInOut,
			},
		});
		this.cards.forEach((card, index, arr) => {
			if (index == activeCardId) {
				card.classList.add('is-active');
			}
			this.tl.to(card, {
				top: 0,
				onUpdate: () => {
					this.checkDirection(this.tl);
					if (!this.forward && index == 0) {
						card.classList.add('is-active');
					}
					if (!this.forward && index != 0) {
						card.classList.remove('is-active');
						arr[index - 1].classList.add('is-active');
					}
				},
				onReverseComplete: () => {
					this.disableCards();
					card.classList.add('is-active');
				},
				onComplete: () => {
					this.disableCards();
					card.classList.add('is-active');
				},
			});
		});
	}

	disableCards() {
		this.cards.forEach((card) => {
			card.classList.remove('is-active');
		});
	}

	remove() {
		this.isClear = true;
		this.tl.pause(0).kill(true);
		//ScrollTrigger.getById(this.scrollTriggerId).kill();
		gsap.set(this.wrap, { clearProps: true });
		this.disableCards();
	}
}

export default Strategy;
