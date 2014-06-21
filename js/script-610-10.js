/* Author:

*/

$(document).ready(function () {

	$('input#nav').on( 'focus', function(e){
		$(this).parents( 'li' ).addClass('visible');
		$('.visible svg').one( 'click' , function(e){
			e.preventDefault();
			$('input#nav').trigger( 'blur' );
		});
	});
	
	$('input#nav').on( 'blur', function(e){
		setTimeout( function(e) {
			$(this).parents( 'li' ).removeClass('visible');
		}, 250);	
	});
	
	$('#main ul ul li a').click( function(e) {
		e.preventDefault();
		var html = $(this).html();
		$('input#nav').html( '' ).append( 'html' );
	});

	$('article.thumb').on( 'click', function(e) {
		if (!$(this).hasClass( 'selected' )) {
			$('li.selected').removeClass( 'selected' );
			$(this).parent( 'li' ).addClass( 'selected' );
		}
	});
	
	
		/**
	 * Local Scrolling
	 *
	 *
	 */
	 
 var didScroll = false;
	var docElem = document.documentElement;
	window.addEventListener('scroll', scrollHandler, false);
	
	(function ( window ) {
		$('a').filter( function(i) {
			var href = $(this).attr("href");
			if ( href && href.charAt(0) == '#'){
				return true;
			}
		}).on('click', function(e){
			e.preventDefault();
			$( '#main li' ).removeClass('visible');
			var anchor = $(this).attr("href").slice(1); 
			if ( anchor != "" ){
				var offset = $('section#'+anchor).offset();
				console.log(anchor, offset.top);
				$('html,body').animate( {scrollTop: offset.top-90}, 500);
			}	
		}).trigger( "scroll", window );

	})( window );	

	function scrollHandler(){
		if( !didScroll ) {
			didScroll = true;
			setTimeout( scrollPage, 250 );
		}
	};
	
	function scrollPage() {
		console.log(scrollY);
		var sy = scrollY();
        if ( sy >= 100 ) {
            $('header').addClass('shrink');
        }
        else {
            $('header').removeClass('shrink');
        }
        didScroll = false;
    }
 
    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
    }
});




