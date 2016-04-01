(function ($) {
  $(document).ready(function() {
    $(document).ajaxComplete(function() {
      // @todo: This needs to be refactored. I assume it is for the feedback form.
      // But it would have to be more specific to that webform.
      // Commenting out for now so it does not interfer with Share with Us.
      //$('.webform-feedback-close').text('Cancel');
      //$('.webform-submit.button-primary').text('Send');
    });
  });
})(jQuery);
