export default {
	init() {
		const toggle = $('[data-text-hidden]');
		const txtBasic = $('[data-show-more]').text();
		const txtMore = $('[data-show-more]').attr('data-show-more');
		let state = 0;

		if (!toggle) return;

		const action = $('[data-text-btn]');
		if (!action) return;

		action.on('click', function () {
			if (txtBasic !== undefined && txtMore !== undefined) {
				try {
					if (state) {
						toggle.slideUp();
						$(this).text(txtBasic);
						state--;
					} else {
						toggle.slideDown();
						$(this).text(txtMore);
						state++;
					}
				} catch (err) {
					console.log(err);
				}
			}
		});
	},
};
