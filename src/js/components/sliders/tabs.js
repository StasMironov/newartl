import gsap from 'gsap';
import Slider from './constructor';
import { isDesktop, isMob, isTablet} from '../../utils/breakpoints';
import SmoothScroll from 'smooth-scroll';

export default {
	data: {
		state: 0,
	},
	init() {
		if(document.querySelector('[data-news-field]')){
			let tabsContainer = document.querySelector('[data-tab-container]');
			var inputHiddenNews = document.querySelector('[data-news-field]');
			let tabs = tabsContainer.querySelectorAll(
				'[data-tab]'
			);
			
			tabs.forEach((tab, idx) => {
				if(tab.classList.contains('tab--active')){
					inputHiddenNews.value = tab.dataset.tabVal
				}
			});
		}
		const slider = new Slider({
			init: true,
			wrap: '[data-tabs]:not([data-tabs-timeline])',
			slider: '[data-slider]',
			options: {
				slidesPerView: 'auto',
				speed: 400,
				a11y: false,
				freeMode: {
					enabled: true,
					sticky: false,
				},
				simulateTouch: false,
				resistance: true,
				resistanceRatio: 0,
				spaceBetween: 24,
				observer: true,
				observeParents: true,
				[window.breakpoints.lg]: {
					freeMode: false,
					spaceBetween: 0,
				},
				on: {
					init() {
						const timeline = gsap.timeline({
							paused: true,
						});
						const timelineItem = gsap.timeline({
							paused: true,
						});

						const tabsContainer = this.el.closest(
							'[data-tab-container]'
						);
						if (!tabsContainer) return;

						const tabsWrap = tabsContainer.querySelectorAll(
							'[data-tabs-wrap]'
						);
						const tabs = tabsContainer.querySelectorAll(
							'[data-tab]'
						);

						tabsWrap.forEach((elem, index) => {
							let panes = elem.querySelectorAll(
								'[data-tab-pane]'
							);
							if (!panes || !tabs) return;

							gsap.fromTo(
								panes[0],
								0.5,
								{
									opacity: 0,
									y: 0,
								},
								{
									opacity: 1,
									yPercent: 0,
								}
							);

							tabs.forEach((tab, idx) => {
								tab.addEventListener('click', (e) => {
									e.preventDefault();
									if(tab.dataset.tabVal){
										console.log(tab.dataset.tabVal);
										inputHiddenNews.value = tab.dataset.tabVal;
										
									}
									tabs.forEach((tab) => {
										tab.classList.remove('tab--active');
									});
									tab.classList.add('tab--active');
									const id = tab.dataset.tab;
									panes.forEach((pane, index) => {
										pane.classList.remove('is-active');
										pane.classList.remove('animate');
										const paneId = pane.dataset.tabPane;

										if (paneId === id) {
											pane.classList.add('is-active');
											pane.classList.add('animate');

											const items = pane.querySelectorAll(
												'[data-fadein-up]'
											);

											timeline.fromTo(
												pane,
												0.5,
												{
													opacity: 0,
													y: 40,
												},
												{
													opacity: 1,
													y: 0,
												}
											);

											timeline.play();

											if (items.length > 0) {
												timelineItem.fromTo(
													items,
													{
														opacity: 0,
														y: 40,
													},
													{
														stagger: 0.2,
														duration: 0.8,
														opacity: 1,
														y: 0,
													}
												);
												timelineItem.play();
											}
										}
									});
									// this.slideTo(
									// 	+tab.getAttribute('data-tab') - 1,
									// 	800
									// );

									//this.slideTo(idx, 400);
								});
							});
						});

						// const tabsWrap = this.el.closest('[data-tabs-wrap]');
						// if (!tabsWrap) return;
						// const tabs = tabsWrap.querySelectorAll('[data-tab]');
						// const panes = tabsWrap.querySelectorAll(
						// 	'[data-tab-pane]'
						// );
						// if (!panes || !tabs) return;
						// tabs.forEach((tab) => {
						// 	tab.addEventListener('click', (e) => {
						// 		e.preventDefault();
						// 		tabs.forEach((tab) => {
						// 			tab.classList.remove('tab--active');
						// 		});
						// 		tab.classList.add('tab--active');
						// 		const id = tab.dataset.tab;
						// 		panes.forEach((pane) => {
						// 			pane.classList.remove('is-active');
						// 			const paneId = pane.dataset.tabPane;
						// 			if (paneId === id) {
						// 				pane.classList.add('is-active');
						// 			}
						// 		});
						// 		// this.slideTo(
						// 		// 	+tab.getAttribute('data-tab') - 1,
						// 		// 	800
						// 		// );
						// 	});
						// });
					},
					resize() {
						if (isDesktop()) {
							this.wrapperEl.style = '';
						}
					},
				},
			},
		});

		const sliderTimeline = new Slider({
			init: true,
			wrap: '[data-tabs][data-tabs-timeline]',
			slider: '[data-slider]',
			options: {
				slidesPerView: 'auto',
				speed: 400,
				a11y: false,
				freeMode: {
					enabled: true,
					sticky: false,
				},
				simulateTouch: false,
				resistance: true,
				resistanceRatio: 0,
				//spaceBetween: 24,
				observer: true,
				observeParents: true,
				[window.breakpoints.lg]: {
					freeMode: false,
					spaceBetween: 0,
				},
				on: {
					init() {
						const timeline = gsap.timeline({
							paused: true,
						});
						const timelineItem = gsap.timeline({
							paused: true,
						});

						const tabsContainer = this.el.closest(
							'[data-tab-container]'
						);
						if (!tabsContainer) return;

						const tabsWrap = tabsContainer.querySelectorAll(
							'[data-tabs-wrap]'
						);
						const tabs = tabsContainer.querySelectorAll(
							'[data-tab]'
						);

						tabsWrap.forEach((elem, index) => {
							let panes = elem.querySelectorAll(
								'[data-tab-pane]'
							);
							if (!panes || !tabs) return;

							gsap.fromTo(
								panes[0],
								0.5,
								{
									opacity: 0,
									y: 0,
								},
								{
									opacity: 1,
									yPercent: 0,
								}
							);

							tabs.forEach((tab, idx) => {
								
								tab.addEventListener('click', (e) => {
									e.preventDefault();
									
									tabs.forEach((tab) => {
										tab.classList.remove('tab--active');
									});
									tab.classList.add('tab--active');
									const id = tab.dataset.tab;
									panes.forEach((pane, index) => {
										pane.classList.remove('is-active');
										pane.classList.remove('animate');
										const paneId = pane.dataset.tabPane;

										if (paneId === id) {
											pane.classList.add('is-active');
											pane.classList.add('animate');

											const items = pane.querySelectorAll(
												'[data-fadein-up]'
											);

											timeline.fromTo(
												pane,
												0.5,
												{
													opacity: 0,
													y: 40,
												},
												{
													opacity: 1,
													y: 0,
												}
											);

											timeline.play();

											if (items.length > 0) {
												timelineItem.fromTo(
													items,
													{
														opacity: 0,
														y: 40,
													},
													{
														stagger: 0.2,
														duration: 0.8,
														opacity: 1,
														y: 0,
													}
												);
												timelineItem.play();
											}
										}
									});
									// this.slideTo(
									// 	+tab.getAttribute('data-tab') - 1,
									// 	800
									// );

									this.slideTo(idx, 400);
								});
							});
						});
					},
					resize() {
						if (isDesktop()) {
							this.wrapperEl.style = '';
						}
					},
				},
			},
		});
    
    //скролл до блока
    let scroll = new SmoothScroll('[data-scroll]', {
      speed: 800,
      updateURL: false,
      header: "header",      
    });

	// Скролл с настраиваемой областью

	
    // маркер у активной ссылки
    const tabs = document.querySelectorAll('.tab');
    let lastClicked = tabs[0];


	//console.log(lastClicked);

    let logScrollEvent = function (event) {
		console.log(event.detail.toggle);


		if($('[data-scroll-unique]')){
			$('[data-scroll-unique]').removeClass("tab--active");
		}		
      lastClicked.classList.remove('tab--active');
	  if(!event.detail.toggle.classList.contains('button')){
		   event.detail.toggle.classList.add("tab--active");   
	  }
       
      lastClicked = event.detail.toggle; 
    };
    
    document.addEventListener('scrollStart', logScrollEvent, false);


	$('[data-scroll-unique]').on('click', (e)=>{
		e.preventDefault();
		// определяем высоту экрана
        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // определяем координату верхнего угла div, к нижней границе которого будем скроллить
        const blockTopPosition = document.querySelector('#production').offsetTop;
        // определяем высоту div, к нижней границе которого будем скролить
        const blockHeight = document.querySelector('#production').offsetHeight;
        // определяем координату нижней границы div, к которому нужно скролить
        const blockBottomPosition = blockTopPosition + blockHeight - screenHeight;

		if(!isMob()){
			$("html,body").animate({"scrollTop":blockBottomPosition + 60},'slow'); 
		} else {
			$("html,body").animate({"scrollTop":blockHeight - 100},'slow'); 
		}
        


		tabs.forEach((element)=>{
			element.classList.remove('tab--active');
		})
		e.currentTarget.classList.add('tab--active');
	});
	},
	
};
