(function ($) {
  Drupal.behaviors.uspto_odd_share_work = {
    attach: function(context, settings) {

      var formName, formURL, thankYou, errorMessage;

      if ($('#share-your-work-modal').length > 0) {
        $('#share-your-work-modal').on('hidden.bs.modal', function () {
          $('#share-your-work-modal .modal-content').css('text-align', 'left');
          $('#ajax-message').html('');
          $("button#submit").show();
          $("button#close-button").addClass('btn-default');
          $("button#close-button").removeClass('btn-success');
          $("button#close-button").text('Close');
        });

        $("#share-your-work-modal").on("show.bs.modal", function(e) {
          $('#share-your-work-modal').find('.modal-body').html('Loading form....');
          $.ajax({
            type: "GET",
            url: '/form/share-your-work',
            dataType: 'json',
            success: function(data){
              $('#share-your-work-modal').find('.modal-body').html('');

              $('#share-your-work-modal').find('.modal-body').html(data.block_content);
              // TODO: Remove from Drupal side.
              $('.form-actions').hide();

              formName = $("#share-your-work-modal form");
              formName.find('input.form-text,textarea.form-textarea').each(function() {
                $(this).attr('data-error', 'This field is required.');

                if ($(this).attr('type') == 'email') {
                  $(this).attr('data-error', 'Invalid email address.');
                }
                else if ($(this).attr('id') == 'edit-submitted-share-work-desc') {
                  $(this).attr('data-error', 'This field is required and limited to 512 chararacters.');
                }
                $('<div class="help-block with-errors"></div>').insertAfter(this);
              });

              formName.validator().on('submit', function (e) {
                if (e.isDefaultPrevented()) {
                  // Nothing happens here.
                } else {
                  e.preventDefault(); // avoid to execute the actual submit of the form.

                  var data = formName.serialize();
                  var formObject = JSON.stringify(formName.serializeArray());

                  // Convert form to JSON.
                  var shareForm = formName.serializeArray();
                  var formObject = {};
                  $.each(shareForm,
                    function(i, v) {
                      formObject[v.name] = v.value;
                    }
                  );

                  $.ajax({
                    type: "POST",
                    url: "/webform/share-your-work-us",
                    data: data,
                    success: function(responseData) {

                      var postedData = {
                        title : "Share with Us",
                        type: "community_feed",
                        body : {und : [{value: formObject["submitted[share_work_name]"] + formObject["submitted[share_work_desc]"]}]},
                        field_comm_feed_author : {und : [{value: formObject["submitted[share_work_user_name]"]}]},
                        field_comm_created_date :
                          {
                            und : [
                            {
                              value: {
                                day : moment().format('DD'),
                                month : moment().format('MM'),
                                year : moment().format('YYYY'),
                                hour : moment().format('h'),
                                minute : moment().format('mm'),
                                ampm : moment().format('a')
                              }
                            }
                          ]
                        },
                        field_comm_source_type : {und : 'Our community'},
                        field_comm_community_type : {und : 'Share with us'},
                        field_comm_feed_post_detail_url : {und : formObject["submitted[share_work_link]"]},
                        field_comm_email : {und : formObject["submitted[share_work_user_email]"]}

                      }

                      // It's now handeled from the Drupal side. uspto_odd_share_work_webform_submission_insert().
                      // processSubmitedForm(postedData);

                      modalBody = $('#share-your-work-modal').find('.modal-body');
                      ajaxMessage = $('#share-your-work-modal').find('#ajax-message');
                      submitButton = $("button#submit");

                      thankYou = $('.alert.alert-block.alert-success', responseData);
                      errorMessage = $('.alert.alert-block.alert-danger.messages.error', responseData);

                      if(thankYou.length > 0) {
                        modalBody.html(thankYou.html());
                        ajaxMessage.html('');
                        $('#share-your-work-modal .modal-content').css('text-align', 'center');
                        $('a.close').hide();
                        $("button#submit").hide();
                        $("button#close-button").removeClass('btn-primary');
                        $("button#close-button").addClass('btn-success');
                        $("button#close-button").text('Done');
                      }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                      // Error submitting data to form.
                      console.log(errorThrown);
                    }
                  });
                }
              });

            }
          });
        });

        $("button#submit").click(function(){
          formName.submit();
        });


        // Change the title header to h4.
        changeTitleh2();

        // Add required notice.
        requiredNotice();

        // Add placeholders.
        addPlaceholders();

        // Update submit button text.
        updateSubmitBtn();

        // @todo: Load js/css on validation.

        // Hide button added by TBB at bottom of page.
        var selector = 'button.btn.btn-link.btn-lg';
        $(selector).hide();
      }
    }
  };

  function processSubmitedForm(formData) {

    $.ajax({
      type: "POST",
      url: "/social/node",
      dataType: 'json',
      data: JSON.stringify(formData),
      contentType: "application/json; charset=utf-8",
    }).done(function() {
      console.log('success....');
    }).fail(function(error) {
      console.log( error.statusText );
    });



  }

  function updateSubmitBtn() {
    // First update close button.
    var btnclose = '.TBB-processed .modal-footer .btn';
    $(btnclose).addClass('pull-left').addClass('btn-default');
    $(btnclose).html('Cancel');

    // Add class to submit button.
    var selector = '.TBB-processed .modal-content .webform-submit';
    $(selector).addClass('btn-primary').removeClass('btn-default');

    // Change text.
    $(selector).html('Share it!&nbsp; <i class="icon icon-gift">');

    // Move button into modal-footer.
    $(selector).detach().insertAfter('.TBB-processed .modal-footer .btn');
  }

  function requiredNotice() {
    var selector = '.TBB-processed .webform-component--share-work-name';
    $(selector).prepend('<p>* indicates a required field</p>');
  }

  function changeTitleh2() {
    var selector = '.TBB-processed .modal-header';
    $(selector).find('h2').replaceWith(function() {
      return '<h4>' + $(this).text() + '</h4>';
    });
  }

  function addPlaceholders() {
    // Get text for label of desc field.
    var lbltxt = '';
    if ($('label[for="edit-submitted-share-work-desc"]').text() !== undefined) {
      if ($('label[for="edit-submitted-share-work-desc"]').text().length > 0) {
        lbltxt = $('label[for="edit-submitted-share-work-desc"]').text();

        // Remove label.
        $('label[for="edit-submitted-share-work-desc"]').remove();

        // Add label text as placeholder.
        $('#edit-submitted-share-work-desc').attr("placeholder", lbltxt);
      }
    }

    // Add placeholder to link field.
    $('#edit-submitted-share-work-link').attr("placeholder", "http://");
  }

})(jQuery);
