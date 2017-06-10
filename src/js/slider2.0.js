$(document).ready(function() {	
	eaeSlider();
});
var eaeGlobalSettings = {
	changeDuration: 500,
	changeDelay: 0,
	changeMode: 'slide',
	imageCrop: 'cover',
	imagePos: 'center center',
	descColor: '#696969',
	descFontSize: '20px',
	descPadding: 20,
	descWidth:'100%',
	enableCtrl: 'false',
	ctrlColor: 'rgba(255, 255, 255, 0.75)',
	ctrlWidth: '50px',
	ctrlHeight: '100%',
	ctrlLeftUrl: '',
	ctrlRightUrl: '',
	enableTouch: 'true',
	bgColor: 'transparent'
}
var eaeSettings = {};
var eaeRestore = function() {
	eaeSettings = jQuery.extend({}, eaeGlobalSettings);
}

var eaeSlider = function() {
	eaeRestore();
	//for every slider:
	$('.eaeSlider').each(function() {
		var imgTemp = [];
		var linkTemp = [];
		var descTemp = [];
		var uqid = uniqId(); //create UNIQUE EAE-ID	
		var tempSlider = '.eaeSlider[eae-id="' + uqid + '"]';
		var tempAmount = 0;
		var appendImgTo = "";
		
		//SET SLIDER ID
		$(this).attr('eae-id', uqid);
		
		//if there are unique settings - GET AND SET THEM
		var eaeTempSettings = $(this).attr('eae-settings');
		if(eaeTempSettings) {
			eaeUniqueSettings(eaeTempSettings);
		}
				
		// count img in slider, add there src and possible URLs to arrays - remove them afterwards
		$(tempSlider + ' img').each(function() {
			imgTemp.push($(this).attr('src'));
			linkTemp.push($(this).attr('eae-link'));
			descTemp.push($(this).attr('eae-desc'));
			$(this).remove();
			tempAmount++;
		});
		
		eaeBuildViewfinder(tempSlider, tempAmount)
		
		if(eaeSettings.changeMode == "slide") {
			eaeBuildContainer(tempSlider, tempAmount)
			appendImgTo = tempSlider + ' .eaeContainer';
		} else {
			appendImgTo = tempSlider + ' .eaeViewFinder';
		}

		eaeBuildSlides(linkTemp, imgTemp, descTemp, appendImgTo, uqid, tempAmount, tempSlider);
		
		if(eaeSettings.enableCtrl === 'true') eaeAddArrows(tempSlider, uqid);
		
		if(eaeSettings.enableTouch === 'true') eaeAddTouch(tempSlider, uqid);
		
		if(eaeSettings.changeDelay > 0){
			if(eaeSettings.changeMode == 'slide') {
				eaeAddAutoChange(tempSlider, uqid, 'slide');
			} else {
				eaeAddAutoChange(tempSlider, uqid, 'fade');
			}
		} 
		
		eaeRestore();
	})
	
}

var eaeChange = function(uqid, cm, dir) {
	var tempSlider = '.eaeSlider[eae-id="' + uqid + '"]';
	var pos = $(tempSlider + ' .eaeViewFinder').attr('eae-pos');
	var amount = $(tempSlider + ' .eaeViewFinder').attr('eae-count');
	
	(dir) ? pos++ : pos--;
	
	switch(pos) {
		case -1:
		case (amount-0):
			return;
		break;
		case (amount-1):
			$(tempSlider + ' .eaeCtrlRight').hide();
			$(tempSlider + ' .eaeViewFinder').attr('eae-dir', 1);
		break;
		case 0:
			$(tempSlider + ' .eaeCtrlLeft').hide();
			$(tempSlider + ' .eaeViewFinder').attr('eae-dir', 0);
		break;
		default:
			$(tempSlider + ' .eaeCtrl').show();
		break;
	}
	
	if(cm == "slide") {
		changeMove(pos, tempSlider, amount);
	} else {
		changeFade(pos, tempSlider, amount);
	}
	$(tempSlider + ' .eaeViewFinder').attr('eae-pos', pos);
}
var changeMove = function(pos, tempSlider, amount) {
	$(tempSlider + ' .eaeContainer').css('left', '-' + 100*pos+'%');
}
var changeFade = function(pos, tempSlider, amount) {
	$(tempSlider + ' .eaeImgSlide').css({'opacity':'0','z-index':'1'});
	$(tempSlider + ' #eae-s'+ pos).css({'opacity':'1','z-index':'2'});
}

var eaeAddArrows = function(tempSlider, uqid) {
	$(tempSlider + ' .eaeViewFinder')
	//.append("<div onclick='eaeChange(\""+ uqid + "\",\"" + eaeSettings.changeMode + "\", false)' class='eaeCtrl eaeCtrlLeft'></div><div onclick='eaeChange(\""+ uqid + "\",\"" + eaeSettings.changeMode + "\", true)' class='eaeCtrl eaeCtrlRight'></div>");
	.append("<div class='eaeCtrl eaeCtrlLeft'></div><div class='eaeCtrl eaeCtrlRight'></div>");


	$(tempSlider + ' .eaeCtrl').css({
		'position':'absolute',
		'top':'50%',
		'width':eaeSettings.ctrlWidth,
		'height':eaeSettings.ctrlHeight,
		'background-color':eaeSettings.ctrlColor,
		'background-position':'center center',
		'background-size':'50%',
		'background-repeat':'no-repeat',
		'cursor':'pointer',
		'transform':'translateY(-50%)',
		'-webkit-transform':'translateY(-50%)',
		'-ms-transform':'translateY(-50%)',
		'z-index':'3'
	});
	$(tempSlider + ' .eaeCtrlLeft').css({
		'left':'0px',
		'background-image':'url(' + eaeSettings.ctrlLeftUrl + ')',
		'display':'none'
	});
	$(tempSlider + ' .eaeCtrlRight').css({
		'right':'0px',
		'background-image':'url(' + eaeSettings.ctrlRightUrl + ')'
	});
	
	if(eaeSettings.changeMode == 'slide') {
		$(tempSlider + ' .eaeCtrlRight').on('click' , function(){
			eaeChange(uqid, 'slide', true)
		});
		$(tempSlider + ' .eaeCtrlLeft').on('click' , function(){
			eaeChange(uqid, 'slide', false)
		});
	} else {
		$(tempSlider + ' .eaeCtrlRight').on('click' , function(){
			eaeChange(uqid, 'fade', true)
		});
		$(tempSlider + ' .eaeCtrlLeft').on('click' , function(){
			eaeChange(uqid, 'fade', false)
		});
	}
}
var eaeAddTouch = function(tempSlider, uqid) {
	if(eaeSettings.changeMode == 'slide') {
		$(tempSlider + ' .eaeViewFinder').on('swipeleft' , function(){
			eaeChange(uqid, 'slide', true);
		});
		$(tempSlider + ' .eaeViewFinder').on('swiperight' , function(){
			eaeChange(uqid, 'slide', false);
		});
	} else {
		$(tempSlider + ' .eaeViewFinder').on('swiperight' , function(){
			eaeChange(uqid, 'fade', false);
		});
		$(tempSlider + ' .eaeViewFinder').on('swipeleft' , function(){
			eaeChange(uqid, 'fade', true);
		});
	}
}
var eaeAddAutoChange = function(tempSlider, uqid, cm) {
	setInterval(function() {
		var dir = $(tempSlider + ' .eaeViewFinder').attr('eae-dir');
		
		if(dir == 0) {
			eaeChange(uqid, cm, true);
		} else {
			eaeChange(uqid, cm, false);
		}
	}, eaeSettings.changeDelay);
}

var eaeBuildViewfinder = function(tempSlider, tempAmount) {
	//SET AND STYLE VIEWFINDER - START
	$(tempSlider).append('<div class="eaeViewFinder" eae-count="' + tempAmount + '" eae-pos="0" eae-dir="0"></div>');
	$(tempSlider + ' .eaeViewFinder').css({
		'height':'100%',
		'width':'100%',
		'position':'relative',
		'overflow':'hidden',
		'background-color':eaeSettings.bgColor
	});
	//SET AND STYLE VIEWFINDER - END
}

var eaeBuildContainer = function(tempSlider, tempAmount) {
	//SET AND STYLE CONTAINER - START
	$(tempSlider + ' .eaeViewFinder').append('<div class="eaeContainer"></div>');
	$(tempSlider + ' .eaeContainer').css({
		'transition':'all '+eaeSettings.changeDuration+'ms ease',
		'-webkit-transition':'all '+eaeSettings.changeDuration+'ms ease',
		'-moz-transition':'all '+eaeSettings.changeDuration+'ms ease',
		'-ms-transition':'all '+eaeSettings.changeDuration+'ms ease',
		'-o-transition':'all '+eaeSettings.changeDuration+'ms ease',
		'height':'100%',
		'width': tempAmount * 100 +'%',
		'position':'absolute',
		'left':'0%'
	});
	//SET AND STYLE CONTAINER - END
}

var eaeBuildSlides = function(linkTemp, imgTemp, descTemp, appendImgTo, uqid, tempAmount, tempSlider) {
	var desc = false;
	$.each( linkTemp, function( i, v ) {
		if(v) {
			$(appendImgTo).append('<a class="eaeImgSlide" id="eae-s'+ i +'" href="'+ v +'"></a>');
		} else {
			$(appendImgTo).append('<div class="eaeImgSlide" id="eae-s'+ i +'"></div>');
		}
		
		if(descTemp[i]) {
			$(tempSlider + ' #eae-s'+ i).append('<div class="eaeDescBox"><div class="eaeDesc">' + descTemp[i] + '</div></div>');
			desc = true;
		}
		
		$(tempSlider + ' #eae-s'+ i).css({
			'background-image':'url(' + imgTemp[i] + ')',
			'background-position':eaeSettings.imagePos,
			'background-size':eaeSettings.imageCrop,
			'background-repeat':'no-repeat',
			'text-decoration':'none',
			'z-index': i < 1 ? 2 : 1
		});
	});
	
	if(desc) {
		$(tempSlider + ' .eaeDescBox').css({
			'width':'100%',
			'height':'100%',
			'position':'relative'
		});
		$(tempSlider + ' .eaeDesc').css({
			'bottom':'0px',
			'position':'absolute',
			'background-color':eaeSettings.ctrlColor,
			'padding':eaeSettings.descPadding + 'px',
			'color':eaeSettings.descColor,
			'font-size':eaeSettings.descFontSize,
			'width':'calc('+ eaeSettings.descWidth +' - '+ 2*eaeSettings.descPadding +'px)',
		});
	}
	
	if(eaeSettings.changeMode == 'slide') {
		$(tempSlider + ' .eaeImgSlide').css({
			'width': 100/tempAmount + '%',
			'height':'100%',
			'display':'block',
			'float':'left'
		});
	} else {
		$(tempSlider + ' .eaeImgSlide').css('opacity','0');
		$(tempSlider + ' #eae-s0').css('opacity','1');
		$(tempSlider + ' .eaeImgSlide').css({
			'height': '100%',
			'width':'100%',
			'display':'block',
			'position':'absolute',
			'top':'0px',
			'left':'0px',
			'transition':'all '+eaeSettings.changeDuration+'ms ease',
			'-webkit-transition':'all '+eaeSettings.changeDuration+'ms ease',
			'-moz-transition':'all '+eaeSettings.changeDuration+'ms ease',
			'-ms-transition':'all '+eaeSettings.changeDuration+'ms ease',
			'-o-transition':'all '+eaeSettings.changeDuration+'ms ease'
		});
		
	}
}

var eaeUniqueSettings = function(eaeTempSettings) {
	var eaeTempSettingsList =  eaeTempSettings.split(";");
	$.each(eaeTempSettingsList, function(i,v){
		var eaeTempSettingsListSplit = v.split(":");
		eaeSettings[eaeTempSettingsListSplit[0]] = eaeTempSettingsListSplit[1];
	});
}

var uniqId = function() {
  return "eae" + Math.round(new Date().getTime() / (Math.random() * 100));
}