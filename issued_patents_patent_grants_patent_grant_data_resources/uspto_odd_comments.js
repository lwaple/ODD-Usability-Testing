(function ($) {
  Drupal.behaviors.uspto_odd_comments = {
    attach: function (context, settings) {
      // Add placeholder text.
      addPlaceholders();

      // Update error message on ajaxComplete.
      $('#comment-abuse-complaint-form--2', context).ajaxComplete(function(event, xhr, settings) {
        updateErrorMsg();
      });

      // move comment field above name field.
      moveCommentFieldAboveName();

      // @todo: Uncomment when necessary.
      //expandReply();

      // Change complaint modal window.
      //updateModal();

      // Add placeholder text.
      addPlaceholders();

      // This line is added to make sure Drupal module morecomments works.
      // Bootstrap Drupal theme only adds class 'pagination'.
      // Morecomments module requires a 'pager' class to be available in the pagination ul.
      $("#comments .pagination").addClass('pager');

      // Add button style to ajax pager.
      updatePagerStyle();
    }
  };

  function updatePagerStyle() {
    // Add btn-block style to "Load comments" link.
    // This will need to be called after the button is loaded.
    var checkExist = setInterval(function() {
      if ($("#comments .morecomments-button").length) {
        console.log("Exists.");
        $("#comments .morecomments-button").addClass('btn btn-block');
        clearInterval(checkExist);
      }
    }, 100);
  }

  function moveCommentFieldAboveName() {
    var comment = $('.ajax-comments-form-reply .field-name-comment-body');

    if ($('.ajax-comments-form-reply .form-item-name').length == 0) {
      var name = $('.ajax-comments-form-reply .form-item a.username').parent();
      comment.insertBefore(name);
    } else {
      var name = $('.ajax-comments-form-reply .form-item-name');
      comment.insertBefore(name);
    }
  }

  function updateErrorMsg() {
    if ($('#modalContent div.comment-abuse div.error').html() !== undefined) {
      // Remove error close icon.
      $('#modalContent div.comment-abuse div.alert a.close').remove();

      // Prepend error label text.
      $('#modalContent div.comment-abuse div.alert').prepend('Error: ');

      // Prepend error icon.
      $('#modalContent div.comment-abuse div.alert').prepend('<i class="alert-icon alert-icon-danger"></i>');
    }
  }

  function addPlaceholders() {
    // Add placeholder text for comment field.
    $('#edit-comment-body-und-0-value').attr("placeholder", "Type your comment here.");

    // Add placeholder text for name field.
    $('#edit-name').attr("placeholder", "Enter your name");

    // Add placeholder text for email field.
    $('#edit-mail').attr("placeholder", "Enter your email");
  }

  function updateModal() {
    // TODO: This is not being used and can be removed.
    // Add a modal footer.
    $('#modal-content').after('<div id="mfooter" class="modal-footer"></div>');

    // Move button into modal footer.
    var btnSubmit = $('#edit-submit--2').detach();
    btnSubmit.appendTo('#mfooter');

    // Change button class.
    $('#edit-submit--2').removeClass('btn-default').addClass('btn-primary');

    // Change button text.
    $('#edit-submit--2').html('Send');
  }

  function expandReply() {
    // TODO: This is not being used due to conflicts.
    // Hide replies on page load.
    $('.indented').each(function(){
     $(this).addClass('indented-reply');
     $('.indented-reply').hide();
    });

    // Hides show/hide link if the comment doesn't have replies.
    $('.comment-reply-show').each(function() {
      if (!$(this).parent().parent().parent().hasClass('has-reply')) {
        $(this).hide();
      }
    });

    $('.comment-reply-show').find('a').click(function (e) {
      // Remove link behaviors.
      e.preventDefault();

      // Toggle replies visiblity (show/hide).
      $(this).parent().parent().parent().parent().next('.indented-reply').toggle('show');

      // Toggle link text (show/hide).
      if ($(this).find('a').text() === 'View all replies') {
        $(this).find('a').text('Hide replies');
      } else {
        $(this).find('a').text('View all replies');
      }

    });

    // When reply is clicked, add a new class to the anchor tag.
    // Since it is wrapped by 'indented' class, it is hidden by above logic.
    $('.comment-reply').find('a').click(function(e) {
      e.preventDefault();
      $(this).addClass('new-reply');
    });

    // Once the reply request is done, show new div.indented.
    $(document).ajaxComplete(function(e, xhr, settings) {
      // Show the new form wrapped in 'indented'.
      $('.new-reply').parent().parent().parent().parent().next('.indented').show();

      // Now remove it so that it is good for next request.
      $('.new-reply').removeClass('new-reply');
    });

    $(".comment-complaint div").each(function() {
      var $this = $(this);
      $this.html($this.html().replace(/&nbsp;/g, ''));
    });
  }

})(jQuery);
