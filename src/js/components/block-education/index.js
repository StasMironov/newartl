import field from 'parsleyjs/src/parsley/field';
import { throttle } from 'throttle-debounce';
import validation from './../validation';
import Input from './../input';
import select from './../select';
import Datepicker from './../datepicker';
import gsap from 'gsap';

export default class Education {
	constructor() {
		this.form = document.querySelector('[data-education-ajax]');
		if (!this.form) return;

		this.wrapperNode = document.querySelector('[data-steps-career]');
		if(!this.wrapperNode) return;


		this.counter = 100;
		this.temp;
		this.inputs = new Input();

		this.fields = {
			education: {
				fields: '[data-education-select]',
				hidden: '[data-education-field]'
			},
			profession: {
				fields: '[data-profession]',
				hidden: '[data-profession-field]'
			},
			certificate: {
				fields: '[data-certificate]',
				hidden: '[data-certificate-field]'
			},
			date: {
				fields: '[data-date]',
				hidden: '[data-eddate-field]'
			}
		}


		this.render();
	}

	resizeJquerySteps(del=true) {
		if(!del){
			$('.wizard .content').animate({ height: $('.body.current').outerHeight()}, "slow");
		} else {
			$('.wizard .content').animate({ height: $('.body.current').outerHeight() + 32}, "slow");
		}
	}

	checkFields(fields,hiddenField){
		let searchFields = this.wrapperNode.querySelectorAll(fields);
		const hField = this.wrapperNode.querySelector(hiddenField);
		
		let valueFields = [];

		searchFields.forEach((el)=>{
				if(el.tagName == 'SELECT') {
					$(el).on('select2:select', ()=>{
					
						valueFields = [];
						searchFields.forEach((select)=>{
							
							if(select.value.length >= 1){
								valueFields.push(select.value);
							}
							
						});
						hField.value='';
						hField.value = valueFields;
								
					});
				} else {
					$(el).on('change', ()=>{
					
						valueFields = [];
						searchFields.forEach((select)=>{
							
							if(select.value.length >= 1){
								valueFields.push(select.value);
							}
							
						});
						hField.value='';
						hField.value = valueFields;
								
					});
				}
			
				

				

				valueFields = [];
				valueFields.push(el.value);
				hField.value='';
				hField.value = valueFields;
		});
	}

	checkEdSelect(changeContent = false){
		const hFieldEducation = this.wrapperNode.querySelector('[data-education-field]');
		hFieldEducation.value = '';
		let valueSelect = [];
		let selects = this.wrapperNode.querySelectorAll('[data-education-select]');

		selects.forEach((el)=>{
			if(!changeContent){
				el.addEventListener('change', ()=>{
					valueSelect = [];
					
					selects.forEach((select)=>{
						if(select.value.length >= 1){
							valueSelect.push(select.value);
						}
						
					});
					
						hFieldEducation.value = valueSelect;		
				});
			} else {
				if(el.value.length >= 1){
					valueSelect.push(el.value);
					hFieldEducation.value = valueSelect;
				}
			}
		});
	}


	render() {
		this.frame = this.form.querySelector('[data-container-frame]');
		if (!this.frame) return;

		this.url = this.form.getAttribute('data-url');
		if (!this.url) return;

		this.btnAddEducations = this.form.querySelector('[data-btn-education]');

		this.btnAddEducations.addEventListener('click', (e)=>{	
			this.counter += 1;
			this.fetch();
		});
		
		$(window ).on( "custom", ()=> {
			
			this.btnDeleteEducations = this.form.querySelectorAll('[data-btn-delete]');

			this.btnDeleteEducations.forEach((el)=>{
				el.addEventListener('click', (e)=>{	
					let parentBox = $(el).closest('[data-ed-card]');
					parentBox.remove();
					let lastEl = $('[data-ed-card]').last();
					$(lastEl).get(0).scrollIntoView(false);
					this.resizeJquerySteps(false);
					this.checkFields(this.fields.education.fields, this.fields.education.hidden);
					// this.checkProfField(true);
					this.checkFields(this.fields.profession.fields, this.fields.profession.hidden);
					this.checkFields(this.fields.certificate.fields, this.fields.certificate.hidden);
					this.checkFields(this.fields.date.fields, this.fields.date.hidden);
				});
			})

			select.init();
			this.inputs.render();
			new Datepicker();
		});

		$(window).trigger("custom");
		this.checkFields(this.fields.education.fields, this.fields.education.hidden);
		this.checkFields(this.fields.profession.fields, this.fields.profession.hidden);
		this.checkFields(this.fields.certificate.fields, this.fields.certificate.hidden);
		this.checkFields(this.fields.date.fields, this.fields.date.hidden);
	}

	fetch() {
		let url = this.url;
	

		url += [
			url.indexOf('?') >= 0 ? '&' : '?',
			`q=${this.counter}`,
		].join('');

		const response = fetch(url);

		response
			.then((res) => {
				if (res.ok) {
					return res.text();
				} else {
					throw new Error('Something has gone wrong :(');
				}
			})
			.then((text) => {
				this.appendText(text);
			})
			.catch((err) => {
				console.log(`Failed to fetch url (${url}): `, err);
			});
	}

	appendText(value = null) {
			let range = document.createRange();
			let fragment = range.createContextualFragment(value); //Creates a DOM object
			let fragmentCard = fragment.querySelector('[data-ed-card]');

			fragmentCard.style.opacity = 0;
			this.frame.appendChild(fragment);
			$(window).trigger("custom");
			this.resizeJquerySteps();
			gsap.fromTo(fragmentCard, {
				autoAlpha: 0,
			},{
				autoAlpha: 1,
				delay: 0.5
			});

		this.checkFields(this.fields.education.fields, this.fields.education.hidden);
		this.checkFields(this.fields.profession.fields, this.fields.profession.hidden);
		this.checkFields(this.fields.certificate.fields, this.fields.certificate.hidden);
		this.checkFields(this.fields.date.fields, this.fields.date.hidden);
	}
}
