(function ($) {
  Drupal.behaviors.webform_feedback = {
    attach: function (context, settings) {
        $('#block-webform-client-block-' + Drupal.settings.webform_feedback.key).addClass('webform-feedback-block');
        $('#block-webform-feedback-webform-feedback-ajax-link a').click(function() {
          $('#mask-bg').show();
        });
        $('a.webform-feedback-close').click(function() {
          $('#mask-bg').hide();
          $('#webform-feedback-block').slideToggle();
          $('#formclose').slideToggle(750);
          return false;
        });
        if($(window).width() < 820) {
          $('#webform-feedback-block').addClass('small');
        }
        $('#webform-feedback-block  .form-actions').append('<div id="ajax-loader"></div>');
        $('#webform-feedback-block input[type=submit]').click(function() {
          $(this).hide();
          $('#webform-feedback-block #ajax-loader').show();
        });

    }
  };
}(jQuery));
