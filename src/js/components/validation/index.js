import 'parsleyjs';
import './parsley-ru';
import './parsley-uz';

export default {
	init() {
		window.addEventListener('init.validation', () => {
			const $lang = $('html').attr('lang');
			const $forms = $(
				'[data-parsley-validate]:not([data-parsley-initialized])'
			);
			$forms.each((index, form) => {
				const $form = $(form);
				$form.parsley({
					errorClass: 'parsley-error',
					successClass: 'parsley-success',
				});

				$form.on('submit', (e) => {
					
					if (form.hasAttribute('data-ajax-form')) {
						e.preventDefault();

						if($(form).find('[data-filetextres]') && $(form).find('[data-upload-file]')){
							let checkFile = function(){
								if($(form).find('[data-filetextres]').hasClass('error')){
									return false;
								} else {
									return true;
								}
							}

							if(checkFile()){
								window.dispatchEvent(
									new CustomEvent('form:submit', { detail: e })
								);
							}
						} else {
							window.dispatchEvent(
								new CustomEvent('form:submit', { detail: e })
							);
						}
						

						
					}
				});

				$form.attr('data-parsley-initialized', '');

				window.Parsley.setLocale(`${$lang}`);
			});
		});
		window.dispatchEvent(new CustomEvent('init.validation'));
	},
};
