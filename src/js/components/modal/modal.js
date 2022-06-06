import MicroModal from 'micromodal';
import Plyr from 'plyr';

const Modal = {
	
	init() {
		this.ajaxSetup();

		const video = document.querySelector('[data-video]');
		const trigger = document.querySelector('[data-modal-video]');

		if (!video || !trigger) return;

		const palyer = new Plyr(video, {});

		MicroModal.init({
			openTrigger: 'data-modal-video',
			closeTrigger: 'data-modal-close',
			openClass: 'is-open',
			disableFocus: false,
			awaitOpenAnimation: true,
			awaitCloseAnimation: true,
			debugMode: false,
			disableScroll: false,
			onShow: (modal) => {
				palyer.play();
				window._disableScroll();
				setTimeout(()=>{
					//console.log($('header'));
					$('.header').addClass('show-header mf-index');
				}, 100);
			},
			onClose: (modal) => {
				palyer.stop();
				setTimeout(()=>{
					$('.header').removeClass('show-header mf-index');
				}, 500);
			
				window._enableScroll();
			},
		});

		this.initEvents();
	},

	ajaxSetup() {
		const buttons = document.querySelectorAll('[data-modal-ajax]');

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				const url = button.getAttribute('data-modal-ajax');
				const modal = document.getElementById(
					button.getAttribute('data-modal')
				);
			});
		});
	},

	initEvents() {
		console.log('leave');
		window.addEventListener('page:leave', this.closeAllModals.bind(this))
	},

	closeAllModals() {
		console.log('close');
		let modals = document.querySelectorAll('.modal');
		let opened = [];

		if(!modals.length) return;

		opened = [...modals].filter(modal => modal.classList.contains('is-open'));

		if(!opened.length) return;

		opened.forEach(modal => {
			let id = modal.getAttribute('id');

			if(!id) return;

			MicroModal.close(id);
		})
	}
};

export default Modal;
