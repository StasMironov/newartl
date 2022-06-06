import MicroModal from 'micromodal';
import { throttle } from 'throttle-debounce';
import PerfectScrollbar from 'perfect-scrollbar';
import { isMob } from '../../utils/breakpoints';

const Modal = {
	init() {
		this.ajaxSetup();

		MicroModal.init({
			openTrigger: 'data-modal',
			closeTrigger: 'data-modal-close',
			openClass: 'is-open',
			disableFocus: false,
			awaitOpenAnimation: true,
			awaitCloseAnimation: true,
			debugMode: false,
			disableScroll: false,
			onShow: (modal) => {
				if (modal.querySelector('[data-modal-ajax-container]')) {
					this.ajaxInsert(
						modal.querySelector('[data-modal-ajax-container]')
					);
				}
				
				window._disableScroll();
				setTimeout(()=>{
					$('.header').addClass('show-header mf-index');
				}, 100);
				window.dispatchEvent(new CustomEvent('modal.open'));
			},
			onClose: (modal) => {
				setTimeout(()=>{
					$('.header').removeClass('show-header mf-index');
				}, 500);
				window._enableScroll();
				window.dispatchEvent(new CustomEvent('modal.close'));
				//window.ls.update();
			},
		});
	},

	ajaxSetup() {
		const buttons = document.querySelectorAll('[data-modal-ajax]');

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				const url = button.getAttribute('data-modal-ajax');
				const modal = document.getElementById(
					button.getAttribute('data-modal')
				);

				if (!modal) return;
				const ajaxContainer = modal.querySelector(
					'[data-modal-ajax-container]'
				);

				if (
					!ajaxContainer ||
					ajaxContainer.getAttribute('data-modal-ajax-container') ===
						url
				)
					return;

				ajaxContainer.setAttribute('data-modal-ajax-container', url);
			});
		});
	},

	ajaxInsert(container) {
		const url = container.getAttribute('data-modal-ajax-container');

		if (!url) return;

		fetch(url)
			.then((res) => {
				if (!res.ok) {
					if (res.status === 404) {
						throw new Error('Not Found');
					} else {
						throw new Error('Some error');
					}
				}
				return res.text();
			})
			.then((text) => {
				container.innerHTML = text;

				const content = container.querySelector('[data-ps]');
				let ps = new PerfectScrollbar(content, {
						wheelPropagation: true,
						minScrollbarLength: 120,
				});

				window.addEventListener(
					'resize',
					debounce(100, () => {
						ps.update();
					})
				);
			})
			.catch((err) => {
				console.log(`failed to fetch url (${url}): `, err);
			});
	},
};

export default Modal;
