$("#myButtons :input").change(function() {
	var keyword = this.id.replace('keyword-','');

	if (keyword == 'all') {
		// Show all of the papers
		$('.publication-badge').show();
	}
	else {
		// Show papers with the keyword
		$('.publication-badge').filter(function(){
	       return $(this).attr('data-keywords').indexOf(keyword) !== -1;
	    }).show();
	    $('.publication-badge').filter(function(){
	       return $(this).attr('data-keywords').indexOf(keyword) == -1;
	    }).hide();
	}
});