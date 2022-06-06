import gsap from 'gsap';
import { throttle } from 'throttle-debounce';
import PerfectScrollbar from 'perfect-scrollbar';

export default {
	psSub: '',
	ps: '',
	status: 0,
	statePanel(el, status) {
		const subItems = el.querySelectorAll('[data-sub-item]');
		const tlSubItems = gsap.fromTo(
			subItems,
			{
				translateY: 20,
				opacity: 0,
			},
			{
				stagger: 0.1,
				translateY: 0,
				opacity: 1,
				ease: 'power1.out',
				paused: true,
			}
		);
		const showPanel = gsap.timeline({
			paused: true,
			duration: 0.1,
		});

		if (status) {
			showPanel.to(el, {
				xPercent: 0,
				autoAlpha: 1,
				onComplete: () => {
					tlSubItems.play();
				},
			});

			showPanel.play();
		} else {
			$(el).removeClass('is-active');
			showPanel.to(el, {
				xPercent: -100,
				autoAlpha: 0,
				onComplete: () => {
					tlSubItems.reverse().delay(0);
				},
			});

			showPanel.play();
		}
	},
	init() {
		const menuNode = document.querySelector('[data-menu]');
	//	if (!menuNode) return;
		//console.log(menuNode);
    const links = menuNode.querySelectorAll('[data-link]');
        
		const triggers = menuNode.querySelectorAll('[data-trigger]');
		//console.log(triggers);
		//if (!triggers.length) return;
		const submenu = menuNode.querySelectorAll('[data-submenu]');
		// console.log(submenu);
		//if (!triggers.length) return;

		const backBtn = menuNode.querySelectorAll('[data-back]');
		//if (!backBtn.length) return;
		const burger = document.querySelector('[data-menu-burger]');
		if (!burger) return;

		const parentNode = document.querySelector('body');
		//if (!parentNode) return;

		const wrapNode = document.querySelector('[data-content]');
		//if (!wrapNode) return;    


		function disableScrolling() {
			var x = window.scrollX;
			var y = window.scrollY;
			window.onscroll = function () {
				window.scrollTo(x, y);
			};
		}

		function enableScrolling() {
			window.onscroll = function () {};
		}

		if (window.innerWidth > 640) {
			if (!$(wrapNode).hasClass('ps')) {
				this.ps = new PerfectScrollbar(wrapNode);
			}
		}

		submenu.forEach((subMenu, idx) => {
			subMenu.classList.remove('is-active');
			gsap.set(subMenu, { xPercent: -100, autoAlpha: 0 });
		});

		const timelineTrigger = gsap.fromTo(
			//triggers,
      links,
			{
				translateY: 20,
				opacity: 0,
			},
			{
				stagger: {
					each: 0.1,
				},
				translateY: 0,
				className: '+=menu__item active',
				opacity: 1,
				ease: 'power1.out',
				paused: true,
			}
		);

		burger.addEventListener(
			'click',
			throttle(100, () => {
				burger.classList.add('active');
				burger.classList.remove('not-active');
				menuNode.classList.toggle('is-active');

				if (menuNode.classList.contains('is-active')) {
					window._disableScroll();
					timelineTrigger.play().delay(0.3);
					parentNode.classList.add('is-open');
					this.status = 1;
					// if (this.status) {
					// 	window.addEventListener('scroll', (e) => {
					// 		console.log(1);
					// 		e.preventDefault();
					// 		window.scrollTo(0, 0);
					// 	});
					// }

					// $(window).bind('touchmove', function (e) {
					// 	e.preventDefault();
					// });

					disableScrolling();
				} else {
					window._enableScroll();
					burger.classList.remove('active');
					burger.classList.add('not-active');
					submenu.forEach((subMenu, idx) => {
						subMenu.classList.remove('is-active');
						this.statePanel(subMenu, false);
					});
					timelineTrigger.reverse().delay(0);
					parentNode.classList.remove('is-open');
					//this.status=0;
					//$('body').unbind('touchmove');
					enableScrolling();
				}
			})
		);

		triggers.forEach((trigger, index) => {
			trigger.addEventListener(
				'click',
				throttle(100, (event) => {
					event.stopPropagation();
					trigger.style = '';
					submenu.forEach((subMenu, idx) => {
						
						if (index === idx) {
							//console.log(subMenu);
							subMenu.classList.add('is-active');
							this.statePanel(subMenu, true);
							const wrapSubNode = subMenu.querySelector(
								'[data-sub-wrap]'
							);

							

							if (window.innerWidth > 640) {
								if (!$(wrapSubNode).hasClass('ps')) {
									this.psSub = new PerfectScrollbar(
										wrapSubNode,
										{
											wheelSpeed: 2,
											wheelPropagation: true,
											minScrollbarLength: 20,
										}
									);
									this.psSub.update();

									wrapSubNode.addEventListener(
										'scroll',
										() => {
											this.psSub.update();
										}
									);
									wrapSubNode.scrollTop = 0;
								}
							}
						}
					});
				})
			);
		});

		backBtn.forEach((btn, index) => {
			btn.addEventListener('click', (event) => {
				event.stopPropagation();
				const parentNode = $(btn).closest('[data-submenu]');
				if (!parentNode) return;
				this.statePanel(parentNode[0], false);
			});
		});

		window.addEventListener('resize', () => {
			if (window.innerWidth > 640) {
				menuNode.classList.remove('is-active');
				burger.classList.remove('active');
				burger.classList.add('not-active');
				submenu.forEach((subMenu, idx) => {
					this.statePanel(subMenu, false);
				});
				timelineTrigger.reverse().delay(0);
			}
		});
	},
};
