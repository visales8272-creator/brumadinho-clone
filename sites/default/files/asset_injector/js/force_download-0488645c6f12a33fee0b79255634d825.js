(function ($, drupalSettings) {
	
  var fileExtensionPattern = /\.(pdf|docx?|xlsx?|pptx?|txt|zip|rar|mp3|mp4|png|jpg|jpeg|gif)$/i;
  // Iterate over all anchor tags with the class 'download-link'
  $('a.force-download-link').each(function() {
    var href = $(this).attr('href');
    // Check if the href matches the file extension pattern
    if (fileExtensionPattern.test(href)) {
      $(this).attr('download', '').attr('target', '_blank');
    }
  });
  
  $('.field--name-field-imagem-download a').each(function() {
    $(this).text('Baixar Imagem');
  });
  
})(jQuery, drupalSettings);