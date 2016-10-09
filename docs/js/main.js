$(document).ready(function(){
	hidden = false;
	
	setSlide();
	
	
	
});

$( window ).resize(function() {
	setSlide();
});

var setSlide = function() {
	var vpw = $('.headerContent').width();
	
	if(vpw <= 767) {
		hidden = true;
		$('#default .grid-2-3').hide();
		$('.smallopen').next('.grid-2-3').show();
		$('#default .grid-1-3').unbind();
		$('#default .grid-1-3').on('click', function(){
			$(this).stop(true,true).next('.grid-2-3').slideToggle();
			$(this).toggleClass('smallopen')
		});
	} else {
		$('#default .grid-2-3').show();
		$('#default .grid-1-3').unbind();
	}
}