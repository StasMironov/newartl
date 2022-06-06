


import select from '../select';
import { debounce } from 'throttle-debounce';
import mask from './../../libs/mask';
import validation from './../validation';
import Input from './../input';


import 'parsleyjs';
import './../validation/parsley-ru';


export default {
	init() {
		const wrapperNode = document.querySelector('[data-steps-career]');
		if(!wrapperNode) return;


		var curIdx = 0;

		validation.init();

		const progressLine = document.createElement('div');
		progressLine.setAttribute('class', 'progress-step');
	
		// const selectEducation = $('[data-education-select]').siblings();


		

		let step;
		var form = $('[data-steps-career]');
		var stateValid = 0;

		if(form.children("div").hasClass('initialize')) return;


		

		function fieldValidate(){
			stateValid = 0;


			let fields = $('.body.current').find('[data-field-check]');

			fields.each((_, field)=>{
				$(field).parsley().validate();
			});

			const erorFields = $('.body.current').find('.parsley-error');

			

			if (erorFields.length <= 0 ) {
				return true;
			}

			
		}

		form.children("div").steps({
			headerTag: 'h3',
			bodyTag: 'section',
			transitionEffect: "fade",


			labels: {
				// finish: "Отправить",
				next: "<button class='button button--white' data-btn-next>Дальше</button>",
				previous: "<button class='button button--outline-white' data-btn-prev>Назад</button>",
				finish: "<button class='button button--white' type='submit' data-submit-form>Отправить</button>",
				current: "current step:",
				pagination: "Pagination",
			},
			onInit: function (event, currentIndex, priorIndex) {
				$(this).addClass('initialize');
				require('./../../libs/jquery.inputmask.bundle');
				require('./../../libs/jquery.inputmask-multi');
				
				mask.initMask();
				const inputs = new Input();
				$('.steps').append(progressLine);

				let tabs = wrapperNode.querySelectorAll('.steps li');
				step = 100 / tabs.length;

				$(progressLine).width(step*(1) + '%')

				$('.wizard .content').animate({ height: $('.body.current').outerHeight() }, "slow");


				let answer = document.createElement('div');
				answer.classList.add("modal-career__answer");
				answer.setAttribute('data-form-answer','');
				form.append(answer);
				//initEvents(); 

			},
			onStepChanging: function (event, currentIndex, newIndex){
				if (newIndex<currentIndex){
					curIdx = newIndex;
					resizeJquerySteps(newIndex);
					return true;
				}

			

				if(fieldValidate()){
					curIdx = newIndex;
					resizeJquerySteps(newIndex);
					//console.log(hFieldEducation);

				
					return true;
				}



				//return true;
			},
			onStepChanged: function (event, currentIndex, priorIndex) {
				//let resetButton = wrapperNode.querySelectorAll('[data-datepicker-reset]');

				// resetButton.forEach((button)=>{
				// 	button.addEventListener('click', ()=>{
				// 		resizeJquerySteps(currentIndex);
				// 	});
				// });

				$(progressLine).width(step*(currentIndex+1) + '%');
			},
			onFinishing: function (event, currentIndex)
			{
				return true;
			},
			onFinished: function (event, currentIndex)
			{

				let checkFile = function(){
					if($(form).find('[data-filetextres]') && $(form).find('[data-upload-file]')){
						if($(form).find('[data-filetextres]').hasClass('error')){
							return false;
						} else {
							return true;
						}
					}
				}

				//console.log(checkFile());

				if(fieldValidate() && checkFile()){
					//console.log(true);
					window.dispatchEvent(new CustomEvent('submit.formPopup'));
				} else {
					//console.log(false);
				}
			}
		});

		function resizeJquerySteps(index=false, datepicker=false) {
			// if(index>=0){
			// 	$('.wizard .content').animate({ height: $('.body').eq(index).outerHeight() }, "faster");
			// }


			if(datepicker){
				let count = 0;
				$('.datepicker').each((_, elem)=>{
					if($(elem).hasClass('is-active')){
						count++;
					}
				});
				if(count<=0){
					if(index>=0){
						$('.wizard .content').animate({ height: $('.body').eq(index).outerHeight() }, "faster");
					}
				}
				count = 0
			} else {
				if(index>=0){
					$('.wizard .content').animate({ height: $('.body').eq(index).outerHeight() }, "faster");
				}
			}
		}

		function goToCustomStep(step) {
            var currentStep = form.children("div").steps("getCurrentIndex");
			console.log(currentStep);

            if (currentStep < step) {
                while (currentStep !== step) {
                    form.children("div").steps("next");
                    currentStep++;
                }
            } else if (currentStep > step) {
                while (currentStep !== step) {
                    form.children("div").steps("previous");
                    currentStep--;
                }
            }
		}

		// function initEvents() {
		// 	console.log('leave');
		// 	window.addEventListener('page:leave', goToCustomStep(1));
		// }
	
		$(window).resize(debounce(100, () => {
			250, resizeJquerySteps(curIdx, true);
		}));

		window.addEventListener('submit.formPopup', () => {
			const form = $('[data-steps-career]');
			form.submit();
		});
	}
};
