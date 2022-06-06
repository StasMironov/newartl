import field from 'parsleyjs/src/parsley/field';
import { throttle } from 'throttle-debounce';
import PerfectScrollbar from 'perfect-scrollbar';

export default class Search {
	constructor() {
		this.form = document.querySelector('[data-search-ajax]');
		if (!this.form) return;

		this.render();
	}

	render() {
		this.field = this.form.querySelector('[data-search-ajax-field]');
		if (!field) return;

		this.frame = this.form.querySelector('[data-search-frame]');
		if (!this.frame) return;

		this.url = this.form.getAttribute('data-url');
		if (!this.url) return;

		this.reset = this.form.querySelector('[data-reset]');
		if (!this.reset) return;

		this.form.addEventListener('submit', (e) => {
			e.preventDefault(); // Страницы с выдачей не будет
		});

		this.field.addEventListener(
			'keyup',
			throttle(200, false, (e) => {
				const value = e.target.value;

				if (value.trim().length > 1) {
					this.fetch();
					this.form.classList.add('is-active');
				} else {
					this.appendText();
					this.form.classList.remove('is-active');
				}
			})
		);

		this.reset.addEventListener('click', () => {
			this.appendText();
		});

		document.addEventListener('click', (e) => {
			if (
				!e.target.hasAttribute('data-search-ajax') &&
				!e.target.closest('[data-search-ajax]')
			) {
				this.form.classList.remove('is-active');
			}
		});
	}

	fetch() {
		const formData = new FormData(this.form);
		let url = this.url;

		url += [
			url.indexOf('?') >= 0 ? '&' : '?',
			`q=${formData.get('search')}`,
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
		if (!value) {
			this.frame.innerHTML = '';
		} else {
			this.frame.innerHTML = value;
			this.initPs();
		}
	}

	initPs() {
		const content = this.frame.querySelector('[data-content]');

		this.ps = new PerfectScrollbar(content, {
			suppressScrollX: true,
			wheelPropagation: false,
			minScrollbarLength: 140,
		});
	}
}
