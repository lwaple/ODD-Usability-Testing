function include(file) {
  var script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);
}

if (window.location.hostname.toLowerCase() == "developer-sit.etc.uspto.gov" ||
    window.location.hostname.toLowerCase() == "developer-fqt.etc.uspto.gov" ||
    window.location.hostname.toLowerCase() == "developer-pvt.etc.uspto.gov") {
  include(window.location.protocol + '//itw-components.etc.uspto.gov/js/ais/31-devhub.js');
}
else if(window.location.hostname.toLowerCase() == "developer.uspto.gov") {
  include(window.location.protocol + '//components.uspto.gov/js/ais/31-devhub.js');
}

