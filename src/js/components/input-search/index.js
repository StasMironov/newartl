export default {
	init() {
		const wraps = document.querySelectorAll('[data-search-input-wrap]');
		if (!wraps.length) return;

		wraps.forEach((wrap) => {

			const input = wrap.querySelector('[data-input]');
			const reset = wrap.querySelector('[data-reset]');

			if (input.value.length > 0) {
				input.classList.add('filled');
			}

			input.addEventListener('input', (e) => {
				if (e.target.value) {
					input.classList.add('filled');
				} else {
					input.classList.remove('filled');
				}
			});

			reset.addEventListener('click', () => {
				input.classList.remove('filled');
				input.value = '';
			});
		});
	}
}
