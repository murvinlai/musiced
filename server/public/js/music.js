
/*
 * Make a MM plug-in
 * 
 */

var MM = {
	custList:	[],
	currIndex: 	-1,
	checkInt:	false,
	current:	false,
	currentMObj:	false,
	
	config: {
		duration: 8.3
	},
	
	settings: {
		numberOfMeasures: 20,
		playDom:	'myMusic',
		hiddenDom:	'hiddenDom',
		playButtonDomId:	'playCust',
		stopButtonDomId:	'pauseCust',
		checkboxControl: 'm_checkbox_control',
		checkboxListId:	'm_checkbox',
		checkListPrefix:	'm_',
		playClassId:	'PlayClass',
		videoPrefix	: '',
		domPrefix:	'MM_',
	},
	
	init: function() {
		if ( $('#'+MM.settings.hiddenDom).html() == undefined) {
			$('body').append("<div id='"+MM.settings.hiddenDom+"' class='Hidden'></div>");
		}
		MM.setInitImage();
		MM.setCheckboxControl();
	},
	
	setInitImage: function(){
		$('#'+MM.settings.playDom).append('<div id="initImage"></div>');
	},
	
	setLoadingImage: function(){
		$('#'+MM.settings.playDom).append('<div id="loadingImage"></div>');
	},
	
	setCheckboxControl: function() {
		if (MM.settings.checkboxControl != '') {
			var checkBoxControl = $('#'+MM.settings.checkboxControl);
			var html 	= "<ul id='"+MM.settings.checkboxListId+ "'>";
			for (var i=1; i<=MM.settings.numberOfMeasures; i++) {
				html += '<li><input type="checkbox" id="m_' + i+ '" class="MM_PlayClass">M'+i+'</li>';
			}
			html += '</ul>';
			checkBoxControl.html(html);
		}
	},
	
	playFromSlider: function(start, end){
		MM.currIndex = -1;
		if (MM.checkInt != false) {
			clearInterval(MM.checkInt);
		}
		MM.setCustList(start, end);
		MM.playCustList();
		MM.checkInt = setInterval( MM.checkEnded, 60);
	},
	
	playCust:	function () {
		MM.currIndex = -1;
		if (MM.checkInt != false) {
			clearInterval(MM.checkInt);
		}
		MM.setCustList();
		MM.playCustList();
		MM.checkInt = setInterval( MM.checkEnded, 60);
	},
	
	checkEnded:	function () {
		if (MM.current != false) {
			
			if (MM.currentMObj.ended) {
				MM.playNext();
			}
		}				
	},
	
	setCustList: function(start, end) {
		// clean up dom
		if (MM.current != false) {
			//var cDom = document.getElementById(MM.current.domId);
			//cDom.pause();
			MM.currentMObj.pause();
			// remove from parent
			$('#'+MM.current.domId).remove();
		}
		$('#'+MM.settings.playDom).empty();
		
		MM.current = false;
		// clean up hidden
		$('#'+MM.settings.hiddenDom).empty();
		MM.custList = [];
		
		// clean up title
		$('#title').html('Loading...');
		
		if (start == undefined && end == undefined) {
			var hiddenDom = document.getElementById(MM.settings.hiddenDom);
			for (var i=1; i<=MM.settings.numberOfMeasures; i++) {
				if ( document.getElementById(MM.settings.checkListPrefix+i).checked) {
					MM.setCustObj(hiddenDom, i);
				}
			} 
		} else if (start != undefined && end != undefined) {
			var startIndex = parseInt(start, 10);
			var endIndex = parseInt(end, 10);
			var hiddenDom = document.getElementById(MM.settings.hiddenDom);
			
			for (var i=startIndex; i<= endIndex; i++) {
				MM.setCustObj(hiddenDom, i);
			}
			
		}
	},	
	
	setCustObj: function(hiddenDom, i) {
		var temp = {pid:i, domId: MM.settings.domPrefix+i, length:8.3, start:(i-1)*8.3, end:(i-1)*8.3+8.3};
		MM.custList.push(temp);
		// now create the object ,in hiddenDOm, and then stop playing it.
		var hiddenDom = document.getElementById(MM.settings.hiddenDom);
		var musicObj = document.createElement('video');
		musicObj.id = temp.domId;
		musicObj.src = '/video/'+ MM.settings.videoPrefix + temp.pid + ".mp4";
		musicObj.height = '500';
		musicObj.preload = "auto";
		//musicObj.controls = 'controls';
		musicObj.pause();
		hiddenDom.appendChild(musicObj);
	},
	
	playCustList: function() {
		if (MM.custList.length > 0) {
			MM.setLoadingImage();
			
			setTimeout(MM.playNext, 500);
		} else {
			MM.setInitImage();
			$('#title').html("Please select from below");
		}
	},
	
	playNext: function() {
		if (MM.currIndex == -1) {	
			MM.currIndex = 0;
		} else {
			MM.currIndex++;
			
		if (MM.currIndex >= MM.custList.length){
				MM.currIndex = 0;
			}
		}
		
		
		// see if current
		if (MM.current != false) {
			var hiddenDom = document.getElementById(MM.settings.hiddenDom);
			var currentDom = document.getElementById(MM.current.domId);
			hiddenDom.appendChild(currentDom);
		}
		$('#'+MM.settings.playDom).empty();
		
		// now set the new current
		MM.current = MM.custList[MM.currIndex];
		var playDom = document.getElementById(MM.settings.playDom);
		var currentDom = document.getElementById(MM.current.domId);
		playDom.appendChild(currentDom);
		currentDom.play();
		MM.currentMObj = currentDom;

		$('#title').html("Playing measure "+MM.current.pid);
		
	},
	
	pause: function() {
		if (MM.current != false) {
			MM.currentMObj.pause();
		}
	},
	resume: function() {
		if (MM.current != false) {
			MM.currentMObj.play();
		}
	}
	
}

$(document).ready(function() {
	
	//myMusic.oncanplay = musicInit();
	MM.init();
	$('.MM_PlayClass').click(MM.playCust);
	$('#'+MM.settings.playButtonDomId).click(MM.resume);
	$('#'+MM.settings.stopButtonDomId).click(MM.pause);
	
	
});
