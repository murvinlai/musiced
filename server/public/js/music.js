
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
		playDom:	'myMusic',
		hiddenDom:	'hiddenDom',
		playButtonDomId:	'playCust',
		stopButtonDomId:	'stopPlayCust',
		playClassId:	'PlayClass',
		checkListPrefix:	'm_',
		domPrefix:	'MM_',
	},
	
	init: function() {
		if ( $('#'+MM.settings.hiddenDom).html() == undefined) {
			$('body').append("<div id='"+MM.settings.hiddenDom+"' class='Hidden'></div>")
		}
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
	
	setCustList: function() {
		// clean up dom
		if (MM.current != false) {
			//var cDom = document.getElementById(MM.current.domId);
			//cDom.pause();
			MM.currentMObj.pause();
			// remove from parent
			$('#'+MM.current.domId).remove();
		}
		MM.current = false;
		// clean up hidden
		$('#'+MM.settings.hiddenDom).empty();
		MM.custList = [];
		
		// clean up title
		$('#title').html('');
		
		for (var i=1; i<=5; i++) {
			if ( document.getElementById(MM.settings.checkListPrefix+i).checked) {
				var temp = {pid:i, domId: MM.settings.domPrefix+i, length:8.3, start:(i-1)*8.3, end:(i-1)*8.3+8.3};
				MM.custList.push(temp);
				// now create the object ,in hiddenDOm, and then stop playing it.
				var hiddenDom = document.getElementById(MM.settings.hiddenDom);
				var musicObj = document.createElement('video');
				musicObj.id = temp.domId;
				musicObj.src = '/video/'+temp.pid + ".mp4";
				musicObj.height = '500';
				musicObj.controls = 'controls';
				musicObj.pause();
				hiddenDom.appendChild(musicObj);
				
			}
		} 
	},	
	
	playCustList: function() {
		if (MM.custList.length > 0) {
			MM.playNext();
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
		
		// now set the new current
		MM.current = MM.custList[MM.currIndex];
		var playDom = document.getElementById(MM.settings.playDom);
		var currentDom = document.getElementById(MM.current.domId);
		playDom.appendChild(currentDom);
		currentDom.play();
		MM.currentMObj = currentDom;

		$('#title').html("M"+MM.current.pid);
		
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
	
	
});
