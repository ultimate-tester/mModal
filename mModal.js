(function($) {
	$.fn.mModal = function(options) {
		var settings = $.extend({
			modal: 0,
			closeButton: true
		}, options);
		
		if(settings.modal == 0 || typeof settings.modal == 'undefined') {
			console.error('The given modal was not set or found!');
			return false;
		}
		
		var modalLink = $(this);
		var modalButtons = settings.modal.find('.mModal-buttons').children();
		var modalCloseButton = (settings.closeButton) ? $('<div class="mModal-close"></div>').appendTo(settings.modal) : null;
		
		settings.modal.hide();
		modalButtons.outerWidth(settings.modal.width() / modalButtons.length);
		
		settings.modal.openModal = function() {
			var modalCover = settings.modal.wrap($('<div class="mModal-cover"></div>')).parent();
			modalCover.hide();
			settings.modal.show();
			modalCover.fadeIn('fast');
			
			modalButtons.off('click').click(function(e) {
				e.preventDefault();

				var modalButtonClass = $(this).attr('class');
				if(typeof modalButtonClass == 'undefined') {
					return false;
				}
				
				modalButtonCallback = modalButtonClass.split('-')[1];
				if(typeof settings[modalButtonCallback] != 'undefined') {
					settings[modalButtonCallback](settings.modal);
				}
			});
		};
		
		settings.modal.centerModal = function() {
			var modalPositionLeft = ($(window).outerWidth() / 2) - (settings.modal.outerWidth() / 2);
			var modalPositionTop = ($(window).outerHeight() / 2) - (settings.modal.outerHeight() / 2);
			settings.modal.css({ left: modalPositionLeft, top: modalPositionTop });
		};
		
		settings.modal.closeModal = function() {
			settings.modal.parent().fadeOut('fast', function(){
				settings.modal.hide();
				settings.modal.unwrap();
			});
		};

		modalLink.click(function(e) {
			e.preventDefault();
			settings.modal.openModal();
		});
		
		modalCloseButton.off('click').click(function(e) {
			e.preventDefault();
			settings.modal.closeModal();
		});
		
		$(window).off('resize').resize(function(e) {
			settings.modal.centerModal();
		}).trigger('resize');
	};
} (jQuery));