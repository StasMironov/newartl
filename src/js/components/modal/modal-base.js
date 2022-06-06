import MicroModal from 'micromodal';
import PerfectScrollbar from 'perfect-scrollbar';
import { debounce } from 'throttle-debounce';

export default class ModalBase {
	constructor(props) {
		this.initial = props.init;
		this.trigger = props.trigger;
		this.closeTrigger = props.closeTrigger;
		this.openClass = props.openClass;
		this.id = props.id;
		this.state = false;

		if (this.initial) {
			this.init();
		}
	}

	onShow(modal) {
		// window._disableScroll();
		window.dispatchEvent(new CustomEvent('modal.open'));
	
	}

	onClose(modal) {
		// window._enableScroll();
		window.dispatchEvent(new CustomEvent('modal.close'));
		//$('header').removeClass('mf-index');
	}

	init() {
		//	const btnClose = document.querySelectorAll(this.closeTrigger);

		if (typeof this.id == 'undefined') return;

		const wrapNode = document.querySelector('.' + this.id);

		if (!wrapNode) return;

		const scrollNode = wrapNode.querySelector('[data-modal-ps]');

		

		if (!scrollNode) return;

		MicroModal.init({
			openTrigger: this.trigger,
			closeTrigger: this.closeTrigger,
			openClass: this.openClass,
			disableFocus: false,
			awaitOpenAnimation: true,
			awaitCloseAnimation: true,
			debugMode: false,
			disableScroll: false,
			onShow: (modal) => {
				this.state = true;
				
				if (scrollNode) {
					this.ps  = new PerfectScrollbar(scrollNode, {
						wheelSpeed: 2,
						wheelPropagation: !1,
						minScrollbarLength: 20,
						suppressScrollX: true
					});

					window.addEventListener(
						'resize',
						debounce(100, () => {
							this.ps.update();
						})
					);
				}

				window._disableScroll();
				
				setTimeout(()=>{
					//console.log($('header'));
					$('.header').addClass('show-header mf-index');
					
				}, 100);


				//let inputsField = wrapNode.querySelectorAll('input');

				// inputsField.forEach((element)=>{
				// 	element.addEventListener('focus', ()=>{
				// 		this.ps.update();
				// 	});
				// });

				document.addEventListener('focusout', (e) => {	this.ps.update();});
			},
			onClose: (modal) => {
				this.onClose(modal);
				setTimeout(()=>{
					$('.header').removeClass('show-header mf-index');
				}, 500);
				window._enableScroll();
				this.state = false;
			},
		});

		this.initEvents();

		
		$('[data-modal-person]').on('click', ()=>{
			//console.log(1);
		});

		

		// if (this.id === 'modal-warning') {
		// 	let state = 0;

		// 	$(`#${this.id}`).addClass('is-warning');
		// 	setTimeout(() => {
		// 		if (localStorage.getItem('popupWarning') != true) {
		// 			MicroModal.show(this.id);
		// 			localStorage.setItem('popupWarning', 1);
		// 			window._disableScroll();
		// 		}
		// 	}, 1500);

		// 	btnClose.forEach((elem, index) => {
		// 		elem.addEventListener('click', () => {
		// 			MicroModal.close(this.id);
		// 			window._enableScroll();
		// 		});
		// 	});

		// 	window.onbeforeunload = function () {
		// 		localStorage.removeItem('popupWarning');
		// 		return null;
		// 	};
		// }
	}

	initEvents() {
		window.addEventListener('page:leave', this.closeAllModals.bind(this))
	}

	closeAllModals() {
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

}
