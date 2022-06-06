export default class Input {
	constructor() {
		this.input = '.input, .search, .textarea';
		this.NOT_EMPTY = 'not-empty';
		this.IS_INIT = 'is-init';
		this.render();
	}

	// Ищем input search и встаим класс если значение пустое
	render() {
		const inputs = document.documentElement.querySelectorAll(this.input);
		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];

			// Если is-init
			// if (input.classList.contains(this.IS_INIT)) {
			//     this.handler({ target: input });
			//     return;
			// }

			// if (input.value !== '') {
			// 	this.removeEmpty(input);
			// }

			input.addEventListener('change', this.handler.bind(this));
			input.addEventListener('input', this.handler.bind(this));
			input.classList.add(this.IS_INIT);
		}
	}

	handler(e) {
		const { value } = e.target;
		if (value === '') {
			this.setEmpty(e.target);
		} else {
			this.removeEmpty(e.target);
		}
	}

	setEmpty(input) {
		if (input.classList.contains('search')) {
			input.parentNode.classList.remove(this.NOT_EMPTY);
		} else {
			input.classList.remove(this.NOT_EMPTY);
		}
	}

	removeEmpty(input) {
		if (input.classList.contains('search')) {
			input.parentNode.classList.add(this.NOT_EMPTY);
		} else {
			input.classList.add(this.NOT_EMPTY);
		}

		if (input.type === "tel") {
			input.classList.remove(this.NOT_EMPTY);
		}
	}
}
