/* Author:

*/
// Enable the passage of the 'this' object through the JavaScript timers
 
var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
 
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};
 
window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

// isSet function...just because
 
function isSet( $elem ) {
	return typeof obj.$elem == 'undefined';
}

//AddressNav Class

function AddressNav( $menuElem, $items ){
	this.isDropped = false;
	this.mainElem = $($menuElem+" li").filter( ":first" )
	this.display = this.mainElem.find( "input" );
	this.dropdown = this.mainElem.children( "ul.dropdown" );
	var sections = $('section.linked');
	for (value of $items){
		//console.log("<a href='#"+value+">"+value+"</a>");
		this.dropdown.append("<li><a href='#"+value+"'>"+value+"</a></li>");
	}
}

AddressNav.prototype.revealDrop = function(){
	this.mainElem.addClass('visible');
	//console.log("drop called");
	this.isDropped = true;
};

AddressNav.prototype.hideDrop = function(){
	setTimeout.call( this, function() {
		this.mainElem.removeClass('visible');
	}, 250);
	this.isDropped = false;
};

AddressNav.prototype.setDisplayText = function( $text ){

	function addNext(i, textString, textArray, that){
		if (i <$text.length){
			setTimeout.call( that, function(){
				textString += textArray[i];
				i++;
				this.display.val(textString);
				addNext(i, textString, textArray, that);
			}, 125 );
		}
	}	
	
	var textArray = $text.split("");
	var textString = "";
	var i = 0;
	addNext(i, textString, textArray, this);

};

var mainMenu = new AddressNav("nav#main",["resume", "work", "contact"]);


/* ======================================
 * YTrip class
 *
 */
function YTrip(){
	this.currentTripper;
	this.trippers = [];
}

YTrip.prototype.add = function(yTripper){
	this.trippers.push(yTripper);
}
YTrip.prototype.initCurrentTripper = function( currentSY ){
//console.log("CurY: "+ currentSY+ " | last: "+this.trippers[this.trippers.length-1].y);
	for (i = 0; i<this.trippers.length-1; i++) {
		if( this.trippers[i].y < currentSY && this.trippers[i+1].y > currentSY){
			this.currentTripper = i;
		}
	}
	if( currentSY > this.trippers[this.trippers.length-1].y){
		this.currentTripper = this.trippers.length-1;
	}
	this.trippers[this.currentTripper].downFunc();
	//console.log(this.currentTripper,this.trippers[this.currentTripper].downFunc);
}
YTrip.prototype.checkTrippers = function(sY, oldSY, direction){
	//console.log("check t " + direction);
	if (direction == "down"){
		//@TODO fix this for lasi item...might be necessary to change
		//function assignment for last item
			if (oldSY-1 < this.trippers[this.currentTripper+1].y &&
			  sY+90 > this.trippers[this.currentTripper+1].y) {
				this.currentTripper++;
				this.trippers[this.currentTripper].downFunc();
			}
		//}
	}else{
		if (this.currentTripper != 0 ){
			if (oldSY+90 > this.trippers[this.currentTripper].y &&
			  sY < this.trippers[this.currentTripper].y) {
				this.trippers[this.currentTripper].upFunc();
				this.currentTripper--;
			}  
		}	
	}
}

/* --------------------------------------
 * YTripper class
 */
function YTripper($y, dF, uF){
	this.y = $y;
	this.downFunc = dF;
	this.upFunc = uF;
}	
 
var tList = new YTrip();

 /*=======================================
  * DOCREADY
  */
  
$(document).ready(function () {

	console.log("document.documentElement.scrollTop = "+document.documentElement.scrollTop);
	console.log("$('div[role=\"main\"]').children().eq(1).offset().top; = "+$('div[role="main"]').children().eq(1).offset().top);
	
	//Set up function trippers
	var sections = $('section.linked');
	sections.each(function(i){
		var offset = sections.eq(i).offset();
		var ID = sections.eq(i).attr('id').toString();
		var lastID = sections.eq(i-1).attr('id').toString();
			var dF = function(){ mainMenu.setDisplayText(ID); };
			//console.log(ID+" df: "+ ID);
		if ( i != 0 ){
			var uF = function(){ mainMenu.setDisplayText(lastID); };
			//console.log(ID+" uf: "+lastID);
		} else {
			var uF = function(){ mainMenu.setDisplayText(lastID); };
			//console.log(ID+" uf: "+lastID);
		}		
		tList.add( new YTripper(offset.top, dF, uF) );
	});
	tList.initCurrentTripper(scrollY()+100);

	
	//Link up Main Menu
	mainMenu.display.focus( function(){
		//console.log("focused");
		mainMenu.revealDrop();
	});
	mainMenu.display.blur( function(){
		mainMenu.hideDrop();
	});
	mainMenu.mainElem.children( 'svg' ).on( 'click', function(evt){
		for(var p in evt){
			//console.log(p+" = "+evt[p]);
		}
		if (mainMenu.isDropped) {
			mainMenu.hideDrop();
		} else {
			mainMenu.revealDrop();
		}
	});	
	
	
		/**
	 * Local Scrolling
	 *
	 *
	 */
	 
	var didScroll = false;
	var docElem = document.documentElement;
	var theWindow = $('div[role="main"]');
	theWindow.scroll( scrollHandler );
	
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
				var scrollTo = offset.top-89+scrollY();
				console.log(anchor, offset.top);
				didScroll = true;
				theWindow.animate( {scrollTop: scrollTo}, 500, function(){
					didScroll = false;
				});
			}	
			mainMenu.setDisplayText(anchor);
		}).trigger( "scroll", window );

	})( theWindow );	

	function scrollHandler(){
		if( !didScroll ) {
			didScroll = true;
			var sy = scrollY();
			setTimeout( scrollPage, 250, sy );
		}
	};
	
	function scrollPage(oldSY) {
		var sY = scrollY();
		var direction = 0;
		//console.log(sY);
		if (sY > oldSY) {
			direction = "down";
		} else {
			direction = "up";
		}
		tList.checkTrippers(sY, oldSY, direction);
        didScroll = false;
    }
 
    function scrollY() {
        return -1*$('div[role="main"]').children().eq(0).offset().top;
    }
});




