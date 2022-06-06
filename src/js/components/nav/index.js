export default {
	init() {
		const node = document.querySelector('[data-nav-wrap]');
		if (!node) return;

		const list = node.querySelector('[data-nav-list]');
		if (!list) return;

		const items = list.querySelectorAll('[data-nav-item]');
		if (items && items.length > 0) {
			items.forEach((item) => {
				if (item.classList.contains('is-active')) {
					const styles = getComputedStyle(item);
					list.scrollLeft =
						item.offsetLeft - parseInt(styles.marginRight, 10);
				}
			});
		}
	},
};
