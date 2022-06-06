export default {
	init() {
		const toggle = document.querySelector('[data-lang-toggle]');
		if (!toggle) return;

		const action = toggle.querySelector('[data-action]');
		if (!action) return;

		action.addEventListener('click', () => {
			toggle.classList.toggle('is-active');
		});

		document.addEventListener('click', (e) => {
			if (!e.target.closest('[data-lang-toggle]')) {
				toggle.classList.remove('is-active');
			}
		});
	},
};
