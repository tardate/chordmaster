/*
 * 
 *
 */

jtab.chordList = function() {
	var list = [];
	for (var key in jtab.Chords) {
		list.push( key );
	}
	return list;
}

jtab.easychordList = function() {
	var list = [];
	var re = /sus|dim|aug|add|\d|m|b|#/;
	for (var key in jtab.Chords) {
		if ( ! re.test( key ) )  list.push( key );
	}
	return list;
}

jtab.intermediatechordList = function() {
	var list = [];
	var re = /sus|dim|aug|add|\d/;
	for (var key in jtab.Chords) {
		if ( ! re.test( key ) ) list.push( key );
	}
	return list;
}

jtab.advancedchordList = function() {
	var list = [];
	var re = /aug|add|13|5/;
	for (var key in jtab.Chords) {
		if ( ! re.test( key ) )  list.push( key );
	}
	return list;
}

var ct = {
	Settings : {
		play : true, 
		flashMode : false, // flashMode else practiceMode
		showingChordDiagram : true,
		difficulty : 2,
		speed : 5,
		chord : '',
		delay : function() {
			return ( 17500 - ( this.speed * 1500 )  );
		}
	},
	
	chordlist : [],	
	
	nextChord : function() {
		var pos = Math.floor(Math.random() * (this.chordlist.length));
		this.Settings.chord = this.chordlist[pos];
		return this.Settings.chord;
	},

	run : function() {
		setTimeout("ct.run()",this.Settings.delay() );
		if ( ! this.Settings.play ) return;
		if ( this.Settings.flashMode )  this.Settings.showingChordDiagram = ! this.Settings.showingChordDiagram;
		if ( this.Settings.showingChordDiagram ) {
			jtab.render('chord',this.Settings.chord);
			this.nextChord();
		} else {
			$('chord').innerHTML = '<div class="label">' + this.Settings.chord + '</div>';
			//$('chord').innerHTML = this.Settings.chord;
		}
	},
	
	toggleMode : function() {
		this.Settings.flashMode = ! this.Settings.flashMode;
		this.Settings.showingChordDiagram = true;
		if ( this.Settings.flashMode ) {
			$('mode').setStyle( { backgroundPosition :  "0 -62px" } );
		} else {
			$('mode').setStyle( { backgroundPosition :  "0 0" } );
		}
	},
	
	setSpeed : function(value) {
		this.Settings.speed = value;
		var bg_offset = (value - 1 ) * 54;
		$('speed').setStyle( { backgroundPosition :  "0 -" + bg_offset + "px" } );
	},
	
	setDifficulty : function(value) {
		this.Settings.difficulty = value;
		switch (value) {
			case 2:
				this.chordlist = jtab.intermediatechordList();
				break;
			case 3:
				this.chordlist = jtab.advancedchordList();
				break;
			case 4:
				this.chordlist = jtab.chordList();
				break;
			default:
				this.chordlist = jtab.easychordList();
		}		
		
	},
	
	start : function() {
		$('play').setStyle( { backgroundPosition :  "0 0" } );
		Effect.Appear('crt', { duration: 1.0, transition: Effect.Transitions.spring } );
		this.Settings.play = true;
		this.Timer.start();
	},
	pause : function() {
		$('play').setStyle( { backgroundPosition :  "0 -39px" } );
		this.Settings.play = false;
		this.Timer.pause();
	},
	togglePause : function() {
		if ( this.Settings.play ) {
			this.pause();
		} else {
			this.start();
		}
	},
	stop : function() {
		$('play').setStyle( { backgroundPosition :  "0 -78px" } );
		Effect.SwitchOff('crt');
		this.Settings.play = false;
		this.Timer.stop();
	},

	Timer : {
		running : false,
		paused : false,
		lastElapsedms : 0,
		lastStartms : 0,
		withLeadingZero: function(n) {
			return "0".substring(n >= 10) + n;
		},
		drawTime : function(elapsedms) {
			var elapseds = Math.round(elapsedms/1000);
			var hh = Math.floor(elapseds/3600);
			var mm = Math.floor( (elapseds - hh * 3600)/60);
			var ss = elapseds - hh * 3600 - mm * 60;
			$('timer').innerHTML = hh + 'h:' + this.withLeadingZero(mm) + 'm:' + this.withLeadingZero(ss) + 's';
		},
		run : function() {
			if ( ( ! this.running ) || ( this.paused ) ) return;
			var nowms = new Date().getTime();
			this.lastElapsedms += nowms - this.lastStartms;
			this.lastStartms = nowms;
			this.drawTime( this.lastElapsedms );
			setTimeout("ct.Timer.run()", 1000 );
		},
		start : function() {
			this.running = true;
			if ( this.paused ) {
				this.paused = false;
			} else {
				this.lastElapsedms = 0;
			}
			this.lastStartms = new Date().getTime();
			this.run();
			//setTimeout("ct.Timer.run()", 50 );
		},
		pause : function() {
			this.paused = true;
		},
		stop : function() {
			this.running = false;
			this.paused = false;
			this.lastElapsedms = 0;
			this.lastStartms = 0;
			this.drawTime(0);
		}
	},
	
	
	init_onload : function() {
		this.setDifficulty( 1 );
		this.nextChord();

		new Control.Slider( 'diffHandle', 'diffTrack', 
				{
					range: $R(1,4),
					values : [1, 2, 3, 4],
					sliderValue  : ct.Settings.difficulty,
					onChange:function(value) {
						ct.setDifficulty( value );
					}
				}
			);
		var sS = new Control.Slider( 'speedhandle', 'speedtrack', 
				{
					range: $R(1,11),
					values : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
					onChange:function(value) {
						ct.setSpeed( value );
					},
					onSlide:function(value) {
						ct.setSpeed( value );
					}
				}
			);
		sS.setValue( ct.Settings.speed );
		
		$('mode').observe('click', function(e) { ct.toggleMode(); } );
		$('start').observe('click', function(e) { ct.start(); } );
		$('pause').observe('click', function(e) { ct.pause(); } );
		$('stop').observe('click', function(e) { ct.stop(); } );
		Event.observe( window, 'keypress', function(e){
			var asc = !e.keyCode ? (!e.which ? e.charCode : e.which) : e.keyCode;
			//alert(asc);
			if ( asc == 32 ) {
				Event.stop(e);
				ct.togglePause();
			}    
		});
  
		this.start();
		setTimeout("ct.run()", 100 );
	}
}


// initialize  ct - setup to run on window.onload
ct.init = function() {
	if (typeof window.onload != 'function') {
		window.onload =  ct.init_onload();
	} else {
		var oldonload = window.onload;
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			ct.init_onload();
		}
	}
}

// bootstrap jtab
ct.init();