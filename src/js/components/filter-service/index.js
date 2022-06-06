import { isDesktop, isTablet } from '../../utils/breakpoints';

export default class FilterService {
	constructor() {
		this.city = 'temp';

		this.tempArr = [];
		this.inputVal = false;
		this.select_val = false;

		this.filterNode = document.querySelector('[data-service-wrap]');
		if (!this.filterNode) return;

		this.cards = document.querySelectorAll('[data-id]');
		if (!this.cards) return;

		this.urlData = this.filterNode.dataset.url;
		if (!this.urlData) return;

		this.noSearch = this.filterNode.querySelector('[data-nosearch]');
		if (!this.noSearch) return;

		this.render();
	}

	render = (node) => {
		const cards = document.querySelectorAll('[data-id]');
		this.tempArr = [];

		this.initService();

		$('body').on('keyup', '[data-input]', (e) => {
			const city = this.city;
			this.inputVal = e.target.value;
			var cityServ = this.inputVal;
			let serviceEl;

			if (!cityServ.length) {
				serviceEl = '';
				if (!this.select_val) {
					this.renderServise(false, true);
					this.inputVal = '';
				} else {
					this.inputVal = '';
					this.renderServise(this.select_val, true);
				}
			} else {
				serviceEl = city.filter(function (place) {
					return place.name.toLowerCase().indexOf(cityServ.toLowerCase()) !== -1;
				});

				if (serviceEl.length) {
					this.tempArr = [];
					serviceEl.forEach((elem) => {
						this.cards.forEach((card) => {
							card.classList.add('hide');
							if (card.dataset.id == elem.id) {
								this.tempArr.push({
									id: card.dataset.id,
									name: elem.name,
									products: card.dataset.products,
								});
							}
						});
					});
					this.renderServise(this.select_val, false);
				} else {
					cards.forEach((card) => {
						card.classList.add('hide');
					});
				}
			}

			this.checkSearch();
		});

		$('#filter-form-select-1').on('select2:select', (e) => {
			this.select_val = $(e.currentTarget).val();
			this.renderServise(this.select_val, false);
			this.checkSearch();
		});

		$('[data-reset]').on('click', () => {
			if (!this.select_val) {
				this.renderServise(false, true);
				this.inputVal = '';
			} else {
				this.inputVal = '';
				this.renderServise(this.select_val, true);
			}

			this.checkSearch();
		});
	};

	initService() {
		fetch(this.urlData)
			.then((response) => response.json())
			.then((response) => {
				if (response && response.data) {
					const city = response.data;
					this.city = city;
					this.tempArr = [];
					this.cards.forEach((card) => {
						let obj = {
							id: card.dataset.id,
							products: card.dataset.products,
						};
						city.forEach((elem, index) => {
							if (elem.id == card.dataset.id) {
								obj.name = elem.name;
							}
						});
						this.tempArr.push(obj);
					});
				}
			});
	}

	checkSearch() {
		if (this.cards.length) {
			var state = 0;
			$(this.cards).each((_, elem) => {
				
				if (!$(elem).hasClass('hide')) {
					state += 1;
				}
			});

			if (state > 0) {
				$(this.noSearch).removeClass('show');
			} else {
				$(this.noSearch).addClass('show');
			}

			state = 0;
		}
	}

	renderServise(select, reset) {
		let arrProducts = '';

		this.cards.forEach((card) => {
			card.classList.add('hide');
		});

		if (!select) {
			this.cards.forEach((card) => {
				this.tempArr.forEach((elem) => {
					if (card.dataset.id == elem.id) {
						card.classList.remove('hide');
					}
				});
			});
		} else {
			if (select != 'All') {
				if (!this.inputVal) {
					this.cards.forEach((card) => {
						
						if (typeof card.dataset.products != 'undefined') {
							arrProducts = card.dataset.products.split(',');
							//	console.log(arrProducts);

							arrProducts.forEach((el) => {
								if (el == select) {
									card.classList.remove('hide');
								}
							});
						}
					});
				} else {
					this.cards.forEach((card) => {
						this.tempArr.forEach((elem) => {
							if (
								card.dataset.id == elem.id &&
								elem.name.toLowerCase().indexOf(this.inputVal.toLowerCase()) !== -1
							) {
								if (
									typeof card.dataset.products != 'undefined'
								) {
									arrProducts = card.dataset.products.split(
										','
									);
									arrProducts.forEach((el) => {
										if (el == select) {
											card.classList.remove('hide');
										}
									});
								}
							}
						});
					});
				}
			} else {
				if (!this.inputVal) {
					this.cards.forEach((card) => {
						card.classList.remove('hide');
					});
				} else {
					this.cards.forEach((card) => {
						this.tempArr.forEach((elem) => {
							if (
								card.dataset.id == elem.id &&
								elem.name.toLowerCase().indexOf(this.inputVal.toLowerCase()) !== -1
							) {
								card.classList.remove('hide');
							}
						});
					});
				}
			}
		}

		if (reset) {
			if (!select) {
				this.cards.forEach((card) => {
					card.classList.remove('hide');
				});
			} else {
				if (select != 'All') {
					this.cards.forEach((card) => {
						this.tempArr.forEach((elem) => {
							// console.log(card.dataset.products);
							if (typeof card.dataset.products != 'undefined') {
								arrProducts = card.dataset.products.split(',');
								arrProducts.forEach((el) => {
									if (el == select) {
										card.classList.remove('hide');
									}
								});
							}
						});
					});
				} else {
					
					this.cards.forEach((card) => {
						card.classList.remove('hide');
					});
				}
			}
		}
	}
}
