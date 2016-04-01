(function ($) {
  $(document).ready(function(){
    // On page load, loop through each term block and select default product.
    $('.product-grid li .action').each(function(index) { 
      // Find the default product.
      var pdef = null;

      $(this).find('.dropdown-menu li').each(function(index) {
        // Get the id of the default product.
        // Do this only once for each product type.
        if (typeof ($(this).find('a.default-product').attr('id')) != "undefined") {
          pdef = $(this).find('a.default-product').attr('id');
          // Once we get one, break loop.
          return false;
        }
      });

      // If there is a default product, select it.
      if (pdef !== null) {
        // Since the click handler is attached via $(document).ready(), wait
        // 10ms for the handler to be attached.
        setTimeout(function() {
          $('#' + pdef).click();
        },10);
      }

    });

    // Forces from and to, only to accept numeric values
    $('.field-year-start,.field-year-end').keydown(function(evt){
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      return !(charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105));
    });

    var productFrequency =  $.trim($('.product-frequency').val());
    var dpMode, dpFormat;

    if (productFrequency) {
      switch (productFrequency.toLowerCase()) {
        case 'yearly':
          dpMode = 'years';
          dpFormat = 'YYYY';
          break;
        case 'monthly':
          dpMode = 'years';
          dpFormat = 'YYYY-MM';
          break;
        case 'weekly':
          dpMode = 'years';
          dpFormat = 'YYYY-MM';
          break;
        case 'numerical':
          $('.filter-container').hide();
          break;
        // No need to check for daily. It will default to this.
        default:
          dpMode = 'years';
          dpFormat = 'YYYY-MM-DD';
      }
    } else {
      // If product frequency does not exist, set date picker to years.
      // This is to avoid the MM/DD/YYYY HH:MM AM/PM format.
      dpMode = 'years';
      dpFormat = 'YYYY';
    }

    $('.field-year-start').datetimepicker({
      viewMode: dpMode,
      format: dpFormat
    });

    $('.field-year-end').datetimepicker({
      viewMode: dpMode,
      format: dpFormat
    });

    // On form submit, validate.
    $('#product-filter-form .submit-button').click(function(e){
      var btn = $(document.activeElement);
      var startDate = $('.field-year-start').val();
      var endDate = $('.field-year-end').val();

      // Validate empty filters.
      if ($.trim(startDate).length < 4 || $.trim(endDate).length < 4) {
        alert('Invalid request. Please provide both a start and an end date.')
        return false;
      } else {
        // Validate that end date is not earlier than start date.
        if (startDate > endDate) {
          alert('Invalid range. End date must be later than start date.');
          return false;
        }
        return true;
      }
    });

    // Fetch latest download link.
    $('.product-list-item').click(function(e) {
      e.preventDefault();
      var link = $(this);
      var id = link.attr('id');
      var downloadButton = link.closest('div').parent().find('.download-button');
      var apiurl = link.closest('div').parent().find('.api-url').attr('href');
      var latestReleaseLabel = downloadButton.parent().find('.latest-release');

      var url = apiurl + id + '/latest';

      var latestUrl;

      // Indicate progress on download button.
      downloadButton.text('Fetching....');

      // Truncate product name if it is longer than 30 chars.
      var pname = $(this).text();
      if (pname.length > 38) {
        pname = $(this).text().substring(0, 38) + '...';
      }
      
      // Show selected item in dropdown.
      $(this).parents('.action').find('.btn-default').text(pname);
      $(this).parents('.action').find('.btn-default').val(pname);
      // Append the caret so users know it is a dropdown.
      $(this).parents('.action').find('.btn-default').append(' <span class="caret"></span>');

      if(id) {
        $.ajax({
          type : "GET",
          url :url,
          success : function(data){
            if (data.productFiles[0]['fileDownloadUrl']) {
              latestUrl = data.productFiles[0]['fileDownloadUrl'];

              // Show size of download on "Download latest" button.
              downloadButton.text('Download latest (' + formatBytes(data.productFiles[0]['fileSize'], 2) + ')' );
              downloadButton.attr('href',latestUrl);
              downloadButton.removeClass('disabled');
              downloadButton.prepend('<span class="fa fa-download"></span> ');

              latestReleaseLabel.attr('style','visibility: visible');

              filename = data.productFiles[0]['fileName'];
              if (filename.length > 12) {
                filename = data.productFiles[0]['fileName'].substring(0, 12) + '...';
              }

              var releaseDate = new Date(data.productFiles[0]['releaseDate']);
              latestReleaseLabel.text(
                "Latest release: " +
                filename + ' | ' +
                getMonthName(releaseDate.getMonth()) +' '+
                releaseDate.getDate()+', '+
                releaseDate.getFullYear()
              );
            } else {
              downloadButton.text('Download latest');
              downloadButton.prepend('<span class="fa fa-download"></span> ');
            }
          },
          error : function(httpReq,status,exception){
            downloadButton.text('Download latest');
            downloadButton.prepend('<span class="fa fa-download"></span> ');
          }
        });
      }
    });

    function getMonthName (monthIndex){
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";
      return month[monthIndex];
    }

    function formatBytes(bytes, precision){
      if(bytes == 0)
        return '0 Byte';
       var k = 1000;
       var dm = precision + 1 || 3;
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
       var i = Math.floor(Math.log(bytes) / Math.log(k));
       return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
    }

  });
})(jQuery);
