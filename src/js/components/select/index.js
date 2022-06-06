import PerfectScrollbar from 'perfect-scrollbar';
import select2 from 'select2/dist/js/select2.full.js';
import './select2multi';

export default {
	init() {
		this.initSelect();
		window.addEventListener('init.select', () => {
			this.initSelect();
		});
	},
	initSelect() {
		const elements = document.querySelectorAll('[data-select]');

		$.fn.select2.amd.require(
			[
				'select2/multi-checkboxes/dropdown',
				'select2/multi-checkboxes/selection',
				'select2/multi-checkboxes/results',
			],
			(DropdownAdapter, SelectionAdapter, ResultsAdapter) => {
				elements.forEach((el) => {

					// console.log('select:');
					// console.log(el);
					
					if (el.initialized) return;

					const $select = $(el);
					const isMultiple = !!$select.prop('multiple');
					const closeOnSelect = !isMultiple;
					const size = $select.data('select-size') || 'default';
					const placeholder =
						$select.data('select-placeholder') ||
						$select.attr('placeholder') ||
						false;
					const $form = $select.closest('form');
					const hasSearch = $select.data('select-search');
					const search = hasSearch ? 0 : Infinity;
					const searchPlaceholder =
						$select.data('search-placeholder') || 'Поиск';
					const minCount = $select.data('min-count') || 0;

					const texts = $select.data('texts') || false;
					const hasValueCheck = el.closest('[data-form-has-value]');

					if ($select.ps && $select.ps.destroy()) {
						$select.ps.destroy();
						$select.ps = null;
					}

					// Icon class
					const icon = $select.data('select-icon');
					let iconClass = '';

					if ($form) {
						$form.on('form:reset', () => {
							$select.val(null).trigger('change');
						});
					}

					if (icon) {
						iconClass = ` select2--icon-${icon}`;
					}

					const containerCssClass = `select2-selection--${size}${iconClass}`;
					const dropdownCssClass = `select2-dropdown--${size}`;

					const config = {
						width: $select.data('width') || '100%',
						theme: $select.data('select-theme') || '',
						containerCssClass,
						dropdownCssClass,
						placeholder,
						dropdownPosition: 'below',
						minimumResultsForSearch: search,
						closeOnSelect,
						language: {
							noResults: () => 'Совпадений не найдено',
						},
					};

					if (!isMultiple) {
						config.templateSelection = (data, container) => {
							if (data.element) {
								if (data.element.dataset.href) {
									$(container).attr(
										'data-href',
										`${data.element.dataset.href}`
									);
									return data.text;
								}
							}
							return data.text;
						};
					} else {
						const { lang } = document.documentElement;
						config.templateSelection = (data) => {
							if (data.selected.length === 1) {
								return data.selected[0].text;
							}

							if (data.selected.length !== data.all.length) {
								if (data.selected.length > 1) {
									return `${data.selected[0].element.innerText.trim()} +${
										data.selected.length - 1
									}`;
								}
							}

							if (lang === 'ru') {
								return 'Выбрано все';
							}

							return 'All selected ';
						};
						config.dropdownAdapter = DropdownAdapter;
						config.selectionAdapter = SelectionAdapter;
						config.resultsAdapter = ResultsAdapter;
						config.texts = texts;
					}

					$select.select2(config);

					$select.on('select2:unselecting', (event) => {
						if ($select.selectedOptions?.length == minCount) {
							event.preventDefault();
						}
					});

					$select
						.next()
						.find('.select2-selection')
						.addClass(containerCssClass);

					if (hasSearch) {
						$select.on('select2:open', () => {
							$('input.select2-search__field').prop(
								'placeholder',
								searchPlaceholder
							);
						});
					}

					this.removeTitle($select);

					$select.on('select2:select', () => {
						this.removeTitle($select);
					});

					$select.on('select2:open', () => {
						setTimeout(() => {
							const content = document.querySelector(
								'.select2-results__options'
							);
							if ($select.ps && $select.ps.update) {
								// console.log('update on open');
								$select.ps.update();
							} else {
								// console.log('init on open');
								$select.ps = new PerfectScrollbar(content, {
									suppressScrollX: true, // disable scrollX
									minScrollbarLength: 32,
								});
							}
						}, 10);
					});

					$select.on('select2:closing', () => {
						if ($select.ps && $select.ps.update) {
							// console.log('update on close');
							$select.ps.update();
						}
					});

					if (hasValueCheck) {
						const buttonReset = hasValueCheck.querySelector(
							'[data-reset]'
						);
						if (buttonReset) {
							const hasValueSelect = Array.from(
								hasValueCheck.querySelectorAll('select')
							).filter((item) => item.value);
							if (hasValueSelect.length) {
								buttonReset.classList.remove('disabled');
							} else {
								buttonReset.classList.add('disabled');
							}
						}
					}

					$select.on('change', (e) => {
						//  console.log($select);
						// $select.trigger('input')
						if (e.detail?.cancel) return;
						if ($select[0]) {
							// $select[0].dispatchEvent(
							// 	new CustomEvent('change', {
							// 		bubbles: true,
							// 		detail: {
							// 			cancel: true,
							// 		},
							// 	})
							// );
						}
						if ($select.attr('multiple')) {
							if ($select[0].value) {
								$select.addClass('something-selected');
							} else {
								$select.removeClass('something-selected');
							}
							const $placeholder = $select.attr(
								'data-select-placeholder'
							);
							const $field = $select
								.closest('.control')
								.find('input');
							setTimeout(() => {
								$field.attr('placeholder', $placeholder);
							}, 50);
						}

						if (hasValueCheck) {
							const buttonReset = hasValueCheck.querySelector(
								'[data-reset]'
							);
							if (buttonReset) {
								const hasValueSelect = Array.from(
									hasValueCheck.querySelectorAll('select')
								).filter((item) => item.value);
								if (hasValueSelect.length) {
									buttonReset.classList.remove('disabled');
								} else {
									buttonReset.classList.add('disabled');
								}
							}
						}
					});

					$select.on('select2:selecting', () => {
						if ($select.attr('multiple')) {
							const $placeholder = $select.attr(
								'data-select-placeholder'
							);
							const $field = $select
								.closest('.control')
								.find('input');
							setTimeout(() => {
								$field.attr('placeholder', $placeholder);
							}, 50);
						}
					});

					el.initialized = true;
				});
			}
		);
	},
	removeTitle(el) {
		const title = el
			.closest('.field__control')[0]
			.querySelector('.select2-selection__rendered');

		if (!title) return;
		title.removeAttribute('title');
	},
};
