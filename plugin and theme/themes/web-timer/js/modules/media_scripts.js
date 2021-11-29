/*
This file is used to get unique permalinks from admin side
*/
jQuery(document).ready(function() {
  
  
  

  jQuery('#unique-countdown-permalink-button').on('click', function(evt) {
  	var post_ID=jQuery('#post_ID').val(); 
  	var token =Math.floor((Math.random() * 10000000000000) + 1)+"_cd_"+post_ID;
    var permalink= webTimerDataAdmin.site_root_url+"/?token="+ token;
    wp.media.editor.insert('[ '+permalink+' ] ');
  });

  jQuery("input[value='Reset']").click(function(){
  	var r = confirm("Are you sure you want to reset the timer for this visitor?");
	if (r == true) {
		jQuery(this).attr('checked',true);
		//jQuery("input[value='Reset']").parent().slideUp();
	    var csa = jQuery("[data-name='countdown_start_at'] :input");
		for(var i = 0; i< csa.length; i++){ 
			csa[i].value='';
		}

		var csta = jQuery("[data-name='countdown_stops_at'] :input");
		for(var i = 0; i< csta.length; i++){ 
			csta[i].value='';
		}

		var ctl = jQuery("[data-name='countdown_time_left'] :input");
		for(var i = 0; i< ctl.length; i++){ 
			ctl[i].value='';
		}

		var niee = jQuery("[data-name='number_of_incorrect_entries_entered'] :input");
		for(var i = 0; i< niee.length; i++){ 
			niee[i].value = 0;
		}

		var vat = jQuery("[data-name='visitor_alive_time'] :input");
		for(var i = 0; i< vat.length; i++){ 
			vat[i].value='';
		}
	}else{
		jQuery(this).attr('checked',false);
		var parentLabel = jQuery(this).parent();
	  	parentLabel.css({"color":"#000 !important"});
	  	parentLabel.css({"background-color":"#fff !important"});
	  	parentLabel.css({"border-color":"#ccc !important"});
	}
	
});
jQuery("input[value='Play']").click(function(){
	var csta = jQuery("[data-name='countdown_stops_at'] :input");
	for(var i = 0; i< csta.length; i++){ 
		csta[i].value='';
	}
	var ctl = jQuery("[data-name='countdown_time_left'] :input");
	for(var i = 0; i< ctl.length; i++){ 
		if(ctl[i].value=="00:00:00"){
			ctl[i].value='';
		}
	}

});

});






