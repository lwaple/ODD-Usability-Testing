(function($) {
  Drupal.behaviors.uspto_odd_external_link = {
    attach: function(context, settings) {
      // Alter height of extlink_extra modal.
      var extlink_height = '75%';
      if (Drupal.settings.extlink_extra.colorboxSettings) {
        Drupal.settings.extlink_extra.colorboxSettings.height = extlink_height;
        Drupal.settings.extlink_extra.colorboxSettings.initialHeight = extlink_height;
      }
      else {
        // Fallback: Copied from extlink_extra.js.
        Drupal.settings.extlink_extra.colorboxSettings = {
          href: Drupal.settings.extlink_extra.extlink_alert_url + ' .extlink-extra-leaving',
          height: extlink_height,
          width: '50%',
          initialWidth: '50%',
          initialHeight: extlink_height,
          className: 'extlink-extra-leaving-colorbox',
          onComplete: function () {
            // Note - drupal colorbox module automatically attaches drupal
            // behaviors to loaded content.
            // Allow our cancel link to close the colorbox.
            jQuery('div.extlink-extra-back-action a').click(function(e) {jQuery.colorbox.close(); return false;})
            extlink_extra_timer();
          },
          onClosed: extlink_stop_timer
        };
      }

      // Remove no-touch if this is a touch device.
      if ('ontouchstart' in document) {
        $('body').removeClass('no-touch');
      }
      $(document).keydown(function(e) {
        if (e.keyCode == 27) {
          $('#tiptip_holder').hide();
          $('#glossaryTip').fadeOut(200);
          $.colorbox.close();
        }
      });
      // Move close button to top right.
      $(document).ready(function(e) {
        $('#colorbox.extlink-extra-leaving-colorbox #cboxClose').css('top', 0);
        $('#colorbox.extlink-extra-leaving-colorbox #cboxClose').css('bottom', 'auto');
      });
    }
  };
  // See http://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
  // NEW selector
  jQuery.expr[':'].Contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
  };

})(jQuery);

