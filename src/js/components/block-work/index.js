import field from 'parsleyjs/src/parsley/field';
import { throttle } from 'throttle-debounce';
import validation from './../validation';
import Input from './../input';
import select from './../select';
import Datepicker from './../datepicker';
import gsap from 'gsap';

export default class Education {
	constructor() {
		this.form = document.querySelector('[data-work-ajax]');
		if (!this.form) return;

		this.wrapperNode = document.querySelector('[data-steps-career]');
		if(!this.wrapperNode) return;

		this.counter = 100;
		this.temp;
		this.inputs = new Input();


		this.fields = {
			work: {
				fields: '[data-work]',
				hidden: '[data-work-field]'
			},
			post: {
				fields: '[data-post]',
				hidden: '[data-post-field]'
			},
			date: {
				fields: '[data-date-work]',
				hidden: '[data-workdate-field]'
			}
		}

		this.render();
	}

	resizeJquerySteps(del=true) {
		//console.log(del);
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
				el.addEventListener('change', ()=>{
					valueFields = [];
					searchFields.forEach((select)=>{
						if(select.value.length >= 1){
							valueFields.push(select.value);
						}
						
					});
					hField.value='';
					hField.value = valueFields;
							
				});

				valueFields = [];
				valueFields.push(el.value);
				hField.value='';
				hField.value = valueFields;
		});

		//console.log(valueFields);
	}

	render() {
		this.frame = this.form.querySelector('[data-container-works]');
		if (!this.frame) return;

		this.url = this.form.getAttribute('data-url');
		if (!this.url) return;

		this.btnAddEducations = this.form.querySelector('[data-add-work]');

		this.btnAddEducations.addEventListener('click', (e)=>{	
			this.counter += 1;
			this.fetch();	
		});

		
		$(window ).on( "custom-work", ()=> {
			this.btnDeleteEducations = this.form.querySelectorAll('[data-delete-work]');
			this.btnDeleteEducations.forEach((el)=>{
				//console.log(el);
				el.addEventListener('click', (e)=>{	
					let parentBox = $(el).closest('[data-work-card]');
					//console.log(parentBox);
					parentBox.remove();
					let lastEl = $('[data-work-card]').last();
					$(lastEl).get(0).scrollIntoView(false);
					this.resizeJquerySteps(false);
					this.checkFields(this.fields.work.fields, this.fields.work.hidden);
					this.checkFields(this.fields.post.fields, this.fields.post.hidden);
					this.checkFields(this.fields.date.fields, this.fields.date.hidden);
				});
			})

			select.init();
			this.inputs.render();
			
		});

		$(window).trigger("custom-work");
		this.checkFields(this.fields.work.fields, this.fields.work.hidden);
		this.checkFields(this.fields.post.fields, this.fields.post.hidden);
		this.checkFields(this.fields.date.fields, this.fields.date.hidden);
	}

	fetch() {
		let url = this.url;
        //console.log(url)
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
        //console.log(1)
			let range = document.createRange();
			let fragment = range.createContextualFragment(value); //Creates a DOM object
			let fragmentCard = fragment.querySelector('[data-work-card]');

			fragmentCard.style.opacity = 0;
			this.frame.appendChild(fragment);
			$(window).trigger("custom-work");
			this.resizeJquerySteps();
			gsap.fromTo(fragmentCard, {
				autoAlpha: 0,
			},{
				autoAlpha: 1,
				delay: 0.5
			});
            new Datepicker();
			this.checkFields(this.fields.work.fields, this.fields.work.hidden);
			this.checkFields(this.fields.post.fields, this.fields.post.hidden);
			this.checkFields(this.fields.date.fields, this.fields.date.hidden);
	}
}
