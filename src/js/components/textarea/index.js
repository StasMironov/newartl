export default {
	init() {
		if (!document.querySelector('[data-autoresize]')) {
			return;
		}

		const textareaEl = document.querySelector('[data-autoresize]');
		$(textareaEl).on('input', function () {
			$(this).outerHeight(0).outerHeight(this.scrollHeight);
		});
	},
};
