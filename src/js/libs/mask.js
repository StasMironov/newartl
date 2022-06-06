export default {
	initMask() {
		function removeInputMask(target) {
			target.inputmask('remove');
		}

		function applyInputMasks(target, maskOpts) {
			target.inputmasks(maskOpts);
		}

		if ($('.js-mask-tel, [data-mask-tel], [mask-tel]').length > 0) {
			try {
				// плагин Inputmask не работает с input[type=email]
				// вместо этого можно использовать input[type=text] и data-parsley-type="email"
				let $tel = $('.js-mask-tel, [data-mask-tel], [mask-tel]');
				const dataArray = $tel.data('mask').split(',');
				let listArray = [];
				dataArray.forEach((element) => {
					let objesctData = {};
					objesctData.mask = element;
					listArray.push(objesctData);
				});
				const maskOpts = {
					inputmask: {
						definitions: {
							'#': {
								validator: '[0-9]',
								cardinality: 1,
							},
						},
						showMaskOnHover: false,
						autoUnmask: true,
						clearMaskOnLostFocus: true,
					},
					list: listArray,
					match: /[0-9]/,
					replace: '#',
					listKey: 'mask',
					onMaskChange: function (maskObj, completed) {
						if (completed) {
							$tel.blur(function () {
								$(this).parsley().validate();
							});
							if ($(this).val()) {
								
								$(this).addClass('not-empty');
							} else {
								$(this).removeClass('not-empty');
							}
						} else {
							if ($(this).val()) {
								
								$(this).addClass('not-empty');
							} else {
								$(this).removeClass('not-empty');
							}
						}
					},
				};

				$tel.each(function () {
					let $this = $(this);

					$this.change(function (e) {
						let $this = $(this);
						removeInputMask($this);
						applyInputMasks($this, maskOpts);
					});

					removeInputMask($this);
					applyInputMasks($this, maskOpts);
				});
			} catch (err) {
				console.log(err);
			}
		}
	},
};
