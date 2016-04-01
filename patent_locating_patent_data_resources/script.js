/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {
  Drupal.behaviors.usptoOddCustom = {
    attach: function(context, settings) {

      // Toggle footer.
      // @todo: We need to change the anchor names here and in the styles.
      $( "#hide-menu-button" ).click(function() {
        $( "#but1" ).click();
      });

      $('.myLinkToTop').click(function () {
        $('html, body').animate({scrollTop:$(document).height()}, 'slow');
        return false;
      });

      // Remove well class from left-sidebar.
      $('.region-sidebar-first').removeClass('well');

      latestPostOffset();
    }
  };

  function latestPostOffset() {
    // Add offset class to latest community posts.
    $('#block-views-latest-community-posts-block-1 #views-bootstrap-grid-1 .row div:first').addClass('col-lg-offset-1');
  }
})(jQuery, Drupal, this, this.document);
