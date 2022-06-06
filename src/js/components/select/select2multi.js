
/**
 * jQuery Select2 Multi checkboxes
 * - allow to select multi values via normal dropdown control
 *
 * author      : wasikuss
 * repo        : https://github.com/wasikuss/select2-multi-checkboxes/tree/amd
 * inspired by : https://github.com/select2/select2/issues/411
 * License     : MIT
 */

/* global define jQuery */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
})((jQuery) => {
	if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
		define = jQuery.fn.select2.amd.define;
	}
	let define;
	window.PerfectScrollbar = require('perfect-scrollbar').default;


	/* global define */
	define('select2/multi-checkboxes/dropdown', [
		'select2/utils',
		'select2/dropdown',
		// 'select2/dropdown/search',
		'select2/dropdown/attachBody',
	], (Utils, Dropdown, AttachBody) => {
		function SelectAll() {}

		SelectAll.prototype.render = function (decorated) {
			const self = this;
			const $el = self.$element;

			const $rendered = decorated.call(this);
			if (!$el[0].hasAttribute('data-select-all')) return $rendered;
			if (!this.$element.prop('multiple')) return $rendered;
			const { lang } = document.documentElement;
			const selectAllText = lang === 'ru' ? 'Выбрать все' : 'Select all';
			const unselectAllText =
				lang === 'ru' ? 'Очистить все' : 'Clear all';

			const $selectAll = $(
				`<button type="button" class="select2-results__btn select2-results__btn--select">${selectAllText}</button>`
			);
			const $btnContainer = $(
				'<div class="select2-results__actions"></div>'
			).append($selectAll);
			$rendered.find('.select2-dropdown').prepend($btnContainer);
			$selectAll.on('click', (e) => {
				if (
					$el.find('option:selected').length ===
					$el.find('option').length
				) {
					$el.find('option').prop('selected', null);

					$selectAll.removeClass('is-selected');
				} else {
					$el.find('option').prop('selected', 'selected');

					$selectAll.addClass('is-selected');
				}

				$el.trigger('change');
				$el.select2('close');
			});

			const selectedItems = Array.from(
				$el[0].querySelectorAll('option:not([data-placeholder])')
			).filter((item) => item.selected);
			const id = $el.attr('id');
			if ($el.children().length === selectedItems.length) {
				$selectAll.text(unselectAllText);
			} else {
				$selectAll.text(selectAllText);
			}
			$el.on('change', (e) => {
				const selectedItems = Array.from(
					e.target.querySelectorAll('option:not([data-placeholder])')
				).filter((item) => item.selected);
				const id = $el.attr('id');
				window.dispatchEvent(
					new CustomEvent('select:change', {
						detail: {
							selected: selectedItems,
							id,
						},
					})
				);

				if (e.target.children.length === selectedItems.length) {
					$selectAll.text(unselectAllText);
					$selectAll.addClass('is-selected');
				} else {
					$selectAll.text(selectAllText);
					$selectAll.removeClass('is-selected');
				}
			});

			return $rendered;
		};

		// let adapter = Utils.Decorate(Dropdown, DropdownSearch);
		let adapter = Utils.Decorate(Dropdown, AttachBody);
		adapter = Utils.Decorate(adapter, SelectAll);

		return adapter;
	});

	/* global define */
	define('select2/multi-checkboxes/results', [
		'jquery',
		'select2/utils',
		'select2/results',
	], ($, Utils, _Results) => {
		function Results() {
			Results.__super__.constructor.apply(this, arguments);
		}

		Utils.Extend(Results, _Results);

		Results.prototype.highlightFirstItem = function () {
			this.ensureHighlightVisible();
		};

		Results.prototype.bind = function (container) {
			container.on('open', function () {
				const $options = this.$results.find(
					'.select2-results__option[aria-selected]'
				);
				const $selected = $options.filter('[aria-selected=true]');
				const $optionToScrollTo = ($selected.length > 0
					? $selected
					: $selected
				).first();
				$optionToScrollTo.trigger('mouseenter');


				setTimeout(() => {
					// const content = document.querySelector(
					// 	'.select2-results__options'
					// );
					// if (container.ps && container.ps.update) {
					// 	// console.log('update on open');
					// 	container.ps.update();
					// } else {
					// 	// console.log('init on open');
					// 	window.PerfectScrollbar = new PerfectScrollbar(content, {
					// 		suppressScrollX: true, // disable scrollX
					// 		minScrollbarLength: 32,
					// 	});
					// }
				}, 10);
			});
			Results.__super__.bind.apply(this, arguments);
		};

		Results.prototype.template = function (result, container) {
			const template = this.options.get('templateResult');
			const escapeMarkup = this.options.get('escapeMarkup');

			const content = template(result, container);
			$(container).addClass('multiselect-option');

			if (content == null) {
				container.style.display = 'none';
			} else if (typeof content === 'string') {
				container.innerHTML = escapeMarkup(content);
			} else {
				$(container).append(content);
			}
		};

		return Results;
	});

	/* global define */
	define('select2/multi-checkboxes/selection', [
		'select2/utils',
		'select2/selection/multiple',
		'select2/selection/placeholder',
		'select2/selection/single',
		'select2/selection/eventRelay',
	], (Utils, MultipleSelection, Placeholder, SingleSelection, EventRelay) => {
		let adapter = Utils.Decorate(MultipleSelection, Placeholder);
		adapter = Utils.Decorate(adapter, EventRelay);

		adapter.prototype.render = function () {
			return SingleSelection.prototype.render.call(this);
		};

		adapter.prototype.update = function (data) {
			const $rendered = this.$selection.find(
				'.select2-selection__rendered'
			);
			let formatted = '';

			const itemsData = {
				selected: data || [],
				all: this.$element.find('option') || [],
			};

			if (data.length === 0) {
				formatted = `<span class='select2-prefix'>${this.options.get(
					'placeholder'
				)}</span>`;
			} else {
				formatted = `<span class='select2-prefix'>${this.options.get(
					'placeholder'
				)}</span> ${data.length}`;
			}

			// if (data.length === 0) {
			// 	formatted = this.options.get('placeholder') || '';
			// } else {
			// 	const itemsData = {
			// 		selected: data || [],
			// 		all: this.$element.find('option') || [],
			// 	};
			// 	formatted = this.display(itemsData, $rendered);
			// }

			$rendered.empty().append(formatted);
			$rendered.prop('title', formatted);
		};

		return adapter;
	});
});
