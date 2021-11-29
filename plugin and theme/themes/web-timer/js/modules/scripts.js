/*This file includes all the REST api call to add update the vistors countdown*/

function currentDateTime(){
    var d = new Date();
    var Y = d.getFullYear();
    var M = (d.getMonth()+1);
    var D = d.getDate();
    var hh = d.getHours();
    var ii = d.getMinutes();
    var ss = d.getSeconds();
    if(M<10){ M = "0"+M;}
    if(D<10){ D = "0"+D;}
    if(hh<10){ hh = "0"+hh;}
    if(ii<10){ ii = "0"+ii;}
    if(ss<10){ ss = "0"+ss;}
    var currentdate=Y+"-"+M+"-"+D+" "+ hh + ":" + ii + ":" + ss; 
    return currentdate;

}

function subTime(newdate,h,m,s){
    
    newdate.setHours(newdate.getHours()-h);
    newdate.setMinutes(newdate.getMinutes()-m);
    newdate.setSeconds(newdate.getSeconds()-s);
    var Y = newdate.getFullYear();
    var M = (newdate.getMonth()+1);
    var D = newdate.getDate();
    var hh= newdate.getHours();
    var mm= newdate.getMinutes();
    var ss= newdate.getSeconds();
    if(M<10){ M = "0"+M;}
    if(D<10){ D = "0"+D;}
    if(hh<10){ hh = "0"+hh;}
    if(mm<10){ mm = "0"+mm;}
    if(ss<10){ ss = "0"+ss;}
    return Y+"-"+M+"-"+D+" "+ hh + ":" + mm + ":" + ss; 
} 
function addTime(newdate,h,m,s){
    
    newdate.setSeconds(+newdate.getSeconds() + +s);
    newdate.setMinutes(+newdate.getMinutes() + +m);
    newdate.setHours(+newdate.getHours() + +h);
    var Y = newdate.getFullYear();
    var M = (+(newdate.getMonth()) + +1);
    var D = newdate.getDate();
    var hh= newdate.getHours();
    var mm= newdate.getMinutes();
    var ss= newdate.getSeconds();
    if(M<10){ M = "0"+M;}
    if(D<10){ D = "0"+D;}
    if(hh<10){ hh = "0"+hh;}
    if(mm<10){ mm = "0"+mm;}
    if(ss<10){ ss = "0"+ss;}
    return Y+"-"+M+"-"+D+" "+ hh + ":" + mm + ":" + ss; ;
} 
function calculate_countdown_date() {
  var calculate_countdownDate = visitor_object.countdown_time_left;
      if(visitor_object.countdown_time_left==null){
        calculate_countdownDate = visitor_object.set_time;
      }
      calculate_countdownDate_arr = calculate_countdownDate.split(":");
      var d = new Date();///
      var Y = d.getFullYear();
      var M = d.getMonth();
      var D = d.getDate();
      d.setSeconds(+(d.getSeconds()) + +calculate_countdownDate_arr[2]);
      d.setMinutes(+(d.getMinutes()) + +calculate_countdownDate_arr[1]);
      d.setHours(+(d.getHours()) + +calculate_countdownDate_arr[0]);
      var newcountDownDate = new Date(d).getTime();
      return newcountDownDate;
}

function subtractTimeForIncorrectCode(code_entered) {
 
  // Get todays date and time
  if(code_entered!= visitor_object.code_to_stop_timer){
    subtract_time_for_every_incorrect_entry = visitor_object.subtract_time_for_every_incorrect_entry;
    subtractTimeArray = subtract_time_for_every_incorrect_entry.split(":");
    //
    var calculate_countdownDate = document.getElementById("countdown_time_left_value").value;
      calculate_countdownDate_arr = calculate_countdownDate.split(":");
      var d = new Date();///
      var Y = d.getFullYear();
      var M = d.getMonth();
      var D = d.getDate();
      d.setSeconds(+(d.getSeconds()) + +calculate_countdownDate_arr[2]);
      d.setMinutes(+(d.getMinutes()) + +calculate_countdownDate_arr[1]);
      d.setHours(+(d.getHours()) + +calculate_countdownDate_arr[0]);
      var countdown_stops_at = new Date(d).getTime();
    var countDownSubDate = new Date(countdown_stops_at);
    var dateSub= subTime(countDownSubDate,subtractTimeArray[0], subtractTimeArray[1],subtractTimeArray[2]);
   //console.log(dateSub);
   // get countdown time left

   var now = new Date().getTime();
   var currentdate = currentDateTime();

  // Find the distance between now and the count down date
  var distance = (new Date(dateSub).getTime()) - now;
  //console.log(distance);
  // Time calculations for days, hours, minutes and seconds
  var actions = visitor_object.actions;
  if(distance < 0){
    hours = "00";
    minutes = "00";
    seconds = "00";
    dateSub = currentdate;
    actions = "Pause";
    
  }else{
    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if(hours<10){ hours = "0"+hours;}
    if(minutes<10){ minutes = "0"+minutes;}
    if(seconds<10){ seconds = "0"+seconds;}

  }
  //

////
  

  var data_to_post = {
    "post_id" : visitor_object.post_id ,
    "visitor_alive_time" : currentdate,
    "countdown_stops_at" : dateSub,
    "countdown_time_left" : hours + ":" + minutes + ":" + seconds,
    "number_of_incorrect_entries_entered": (+visitor_object.number_of_incorrect_entries_entered + +1),
    "actions" : actions

  };
  updateVisitorObject(data_to_post);
  //play file
  if(distance < 0){
    var clock = document.getElementById("demo"); 
    var clock_val = document.getElementById("countdown_time_left_value");
    clock.innerHTML = clock_val.value =  "00:00:00";
    playExpireTimeFile();
    clearInterval(x);
    clearInterval(execute_actions);
    clearInterval(keep_alive);
  }else{
    playIncorrectFile();
  }
  
  return;
      

  }else{
    
  
  }

}
function playCorrectFile(){
  if(visitor_object.file_for_correct_entry != null){
    var file_for_correct_entry = visitor_object.file_for_correct_entry;
    var file_ext = file_for_correct_entry.split(".");
    var file_ext_length = file_ext.length;
    if(file_ext[file_ext_length-1]=='mp3' || file_ext[file_ext_length-1]=='mp4'){
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', file_for_correct_entry);
      audioElement.play();
    }else{
      if( file_ext[file_ext_length-1]=='mp4'){
            document.getElementById("topleft").innerHTML='<div><video id="myVideo" height="400" width="400" autoplay controls><source id="ss"  type="video/mp4"></video></div>';
            var videoPlayer = document.getElementById("ss");
            var video = document.getElementById("myVideo");
            videoPlayer.setAttribute("src", file_for_correct_entry);
            video.play();
            video.onended = function() {
                document.getElementById("topleft").innerHTML="";
            };

        }else{
          if(file_ext[file_ext_length-1]=='png' || file_ext[file_ext_length-1]=='jpeg' || file_ext[file_ext_length-1]=='jpg'){
            var img = jQuery('<img id="dynamic">'); 
            img.attr('src', file_for_correct_entry);
            img.appendTo('#topleft');
            setTimeout(function(){
              document.getElementById("topleft").innerHTML = "" ;
            }, 5000);
          }

        } 
    }
    
  }
}
function playIncorrectFile(){
  if(visitor_object.file_for_incorrect_entry != null){
      var file_for_incorrect_entry = visitor_object.file_for_incorrect_entry;
      var file_ext = file_for_incorrect_entry.split(".");
      var file_ext_length = file_ext.length;
      if(file_ext[file_ext_length-1]=='mp3' ){
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', file_for_incorrect_entry);
        audioElement.play();
      }else{
        if( file_ext[file_ext_length-1]=='mp4'){
            document.getElementById("topleft").innerHTML='<div><video id="myVideo" height="400" width="400" autoplay controls><source id="ss"  type="video/mp4"></video></div>';
            var videoPlayer = document.getElementById("ss");
            var video = document.getElementById("myVideo");
            videoPlayer.setAttribute("src", file_for_incorrect_entry);
            video.play();
          video.onended = function() {
              document.getElementById("topleft").innerHTML="";
          };

        }else{
          if(file_ext[file_ext_length-1]=='png' || file_ext[file_ext_length-1]=='jpeg' || file_ext[file_ext_length-1]=='jpg'){
            var img = jQuery('<img id="dynamic">'); 
            img.attr('src', file_for_incorrect_entry);
            img.appendTo('#topleft');
            setTimeout(function(){
              document.getElementById("topleft").innerHTML = "" ;
            }, 5000);
          }
          
        }

      }
      
      
    }
}
function playExpireTimeFile(){
  if(visitor_object.file_for_expire_time != null){
      var file_for_expire_time = visitor_object.file_for_expire_time;
      var file_ext = file_for_expire_time.split(".");
      var file_ext_length = file_ext.length;
      if(file_ext[file_ext_length-1]=='mp3' ){
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', file_for_expire_time);
        audioElement.play();
      }else{
        if( file_ext[file_ext_length-1]=='mp4'){
            document.getElementById("topleft").innerHTML='<div><video id="myVideo" height="400" width="400" autoplay controls><source id="ss"  type="video/mp4"></video></div>';
            var videoPlayer = document.getElementById("ss");
            var video = document.getElementById("myVideo");
            videoPlayer.setAttribute("src", file_for_expire_time);
            video.play();
          video.onended = function() {
              document.getElementById("topleft").innerHTML="";
          };

        }else{
          if(file_ext[file_ext_length-1]=='png' || file_ext[file_ext_length-1]=='jpeg' || file_ext[file_ext_length-1]=='jpg'){
            var img = jQuery('<img id="dynamic">'); 
            img.attr('src', file_for_expire_time);
            img.appendTo('#topleft');
            setTimeout(function(){
              document.getElementById("topleft").innerHTML = "" ;
            }, 5000);
          }
          
        }

      }
      
      
    }
}
function countDownStart() { 
  var clock = document.getElementById("demo"); 
  var clock_val = document.getElementById("countdown_time_left_value");
  if(visitor_object.hide_keypad==0 || visitor_object.hide_keypad==''){
    jQuery('.half-right').css({"display":"display"});
    jQuery('#timer').addClass("half-left");
  }
  //check if countdown is paused
  if(visitor_object.actions=="Pause"){ 
    jQuery('.half-right').css({"display":"none"});
    jQuery('#timer').removeClass("half-left");
    clock.innerHTML = clock_val.value = visitor_object.countdown_time_left;
    if(visitor_object.countdown_time_left==''){
      clock.innerHTML = clock_val.value = visitor_object.set_time;
    }
    clock.innerHTML = clock_val.value = visitor_object.countdown_time_left;
    return false; 
  }else{
    if(visitor_object.timer_starts_automatically_when_page_is_opened==""){
      jQuery('.half-right').css({"display":"none"});
      jQuery('#timer').removeClass("half-left");
      clock.innerHTML = clock_val.value = visitor_object.countdown_time_left;
      return false;

    }else{
      if(visitor_object.countdown_time_left=="00:00:00"){
        jQuery('.half-right').css({"display":"none"});
        jQuery('#timer').removeClass("half-left");
        clock.innerHTML = clock_val.value = "00:00:00";
        return false; 
      }

    }
    
  }
  
  // Get todays date and time
  var now = new Date().getTime(); 

  // Find the distance between now and the count down date
  var distance = visitor_object.countDownDate - now;
  //var distance = nd - now;

  
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if(hours<10){ hours = "0"+hours;}
  if(minutes<10){ minutes = "0"+minutes;}
  if(seconds<10){ seconds = "0"+seconds;}
  // If the count down is finished, write some text
var time_expires = 0; 
  if (distance < 0) {
    time_expires =1;
    countDownDismiss(time_expires);
  }else{
    // Display the result in the element with id="demo"
    clock.innerHTML = clock_val.value =  hours + ":"
    + minutes + ":" + seconds;
    //updateVisitorVisibility();
  }
}


function countDownActions() { 
  //console.log('actions');
  jQuery.ajax({
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);
    },
    url: webTimerData.root_url + '?rest_route=/wp/v2/visitor/' + visitor_object.post_id,
    type: 'GET',
    success: (response) => {
      var old_action = visitor_object.actions;
      var old_timer_starts_automatically_when_page_is_opened = visitor_object.timer_starts_automatically_when_page_is_opened;
       //return;
      visitor_object.actions = response.actions;
      visitor_object.reset= response.reset;
      visitor_object.code_to_stop_timer= response.code_to_stop_timer;
      visitor_object.countdown_post_id= response.countdown_post_id;
      visitor_object.countdown_start_at= response.countdown_start_at;
      visitor_object.countdown_stops_at= response.countdown_stops_at;
      visitor_object.countdown_time_left= response.countdown_time_left;
      visitor_object.countdown_token= response.countdown_token;
      visitor_object.file_for_correct_entry= response.file_for_correct_entry;
      visitor_object.file_for_incorrect_entry= response.file_for_incorrect_entry;
      visitor_object.number_of_incorrect_entries= response.number_of_incorrect_entries;
      visitor_object.number_of_incorrect_entries_entered= response.number_of_incorrect_entries_entered;
      visitor_object.set_time= response.set_time;
      visitor_object.subtract_time_for_every_incorrect_entry= response.subtract_time_for_every_incorrect_entry;
      visitor_object.timer_starts_automatically_when_page_is_opened= response.timer_starts_automatically_when_page_is_opened;
      visitor_object.visitor_alive_time= response.visitor_alive_time;
      var update_left_time_only = 1;
      //Reset Block
      if(response.reset=="Reset" ){ //console.log("Reset done");
        var currentdate=currentDateTime();
        var re_countdown_start_at = currentdate;
        var addTimeArray = (response.set_time).split(":");
        var re_countdown_stops_at = addTime(new Date(),addTimeArray[0], addTimeArray[1],addTimeArray[2]);
        var data_to_post = {
          "post_id" : response.id,
          "countdown_time_left":response.set_time,
          "visitor_alive_time":currentdate,
          "countdown_stops_at":re_countdown_stops_at,
          "countdown_start_at":re_countdown_start_at,
          "reset":"",
        };
        updateVisitorObject(data_to_post);
        update_left_time_only = 0;
        return;
      }else{
          update_left_time_only = 1;
        }
      //End Reset
      //Stat timer_starts_automatically_when_page_is_opened;
      if(response.timer_starts_automatically_when_page_is_opened == ""){
          var currentdate=currentDateTime();
          if(response.timer_starts_automatically_when_page_is_opened != old_timer_starts_automatically_when_page_is_opened){
            //console.log("timer_starts_automatically_when_page_is_opened done");
            var pa_countdown_stops_at = "";
            var pa_countdown_start_at = currentdate;
            if(response.countdown_start_at != ""){
              pa_countdown_start_at =response.countdown_start_at;
            }
            var pa_countdown_time_left = document.getElementById("countdown_time_left_value").value;
            
            //update
            var data_to_post = {
              "post_id" : response.id,
              "countdown_time_left":pa_countdown_time_left,
              "visitor_alive_time":currentdate,
              "countdown_stops_at":pa_countdown_stops_at,
              "countdown_start_at":pa_countdown_start_at,
              "actions":"Pause"
            };
            updateVisitorObject(data_to_post);
            update_left_time_only = 0;
            //clearInterval(x);
            //clearInterval(execute_actions);

          }else{
            //clearInterval(x);
            //clearInterval(execute_actions);
          }
          return;
      }else{
          // just to reload automatically
          if(old_timer_starts_automatically_when_page_is_opened == ""){
              location.reload();
              return;
          }
          //start Play
          if(response.actions=="Play"){
            var currentdate=currentDateTime();
            if(response.actions != old_action){ //console.log("Play done");

              var addTimeArray = (response.set_time).split(":");
              if(response.countdown_time_left!=''){
                addTimeArray = (response.countdown_time_left).split(":");
              }
              var pa_countdown_stops_at = addTime(new Date(),addTimeArray[0], addTimeArray[1],addTimeArray[2]);
              var pa_countdown_start_at = currentdate;
              if(response.countdown_start_at != ""){
                pa_countdown_start_at =response.countdown_start_at;
              }
              var pa_countdown_time_left = response.countdown_time_left;
              if(response.countdown_time_left==""){
                pa_countdown_time_left = response.set_time;
              }
              //update
              var data_to_post = {
                "post_id" : response.id,
                "countdown_time_left":pa_countdown_time_left,
                "visitor_alive_time":currentdate,
                "countdown_stops_at":pa_countdown_stops_at,
                "countdown_start_at":pa_countdown_start_at,
              };
              updateVisitorObject(data_to_post);
              update_left_time_only = 0;
              

            }else{
              update_left_time_only = 1;
            }

          }else{
            //start Pause
            if(response.actions=="Pause"){
              var currentdate=currentDateTime();
              if(response.actions != old_action){ //console.log("Pause done");
                var pa_countdown_stops_at = "";
                var pa_countdown_start_at = currentdate;
                if(response.countdown_start_at != ""){
                  pa_countdown_start_at =response.countdown_start_at;
                }
                var pa_countdown_time_left = document.getElementById("countdown_time_left_value").value;
                
                //update
                var data_to_post = {
                  "post_id" : response.id,
                  "countdown_time_left":pa_countdown_time_left,
                  "visitor_alive_time":currentdate,
                  "countdown_stops_at":pa_countdown_stops_at,
                  "countdown_start_at":pa_countdown_start_at,
                  "actions":"Pause"
                };
                updateVisitorObject(data_to_post);
                update_left_time_only = 0;
                

              }else{
                update_left_time_only = 1;
              }

            }
            // End Pause
          }
          // End Play
      }
      // End timer_starts_automatically_when_page_is_opened
      

      if(update_left_time_only ==1){
        var time_left = document.getElementById("countdown_time_left_value").value;
        var data_to_post = {
          "post_id" : response.id,
          "countdown_time_left":time_left,
          "visitor_alive_time":currentdate,
        };
        updateVisitorObject(data_to_post);
      }
      
    },
    
    error: (response) => {
      
      console.log("Sorry");
      console.log(response);
      
    }
  });
}

function updateVisitorObject(postData) {
  
  jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);
      },
      url: webTimerData.root_url + '?rest_route=/wp/v2/visitor/' + postData.post_id,
      type: 'PUT',
      data:postData,
      success: (response) => {
        if(response.countdown_start_at=="" || response.countdown_stops_at == ""){
          //location.reload();
          //return;
        }

        visitor_object.actions= response.actions;
        visitor_object.reset= response.reset;
        visitor_object.code_to_stop_timer= response.code_to_stop_timer;
        visitor_object.countdown_post_id= response.countdown_post_id;
        visitor_object.countdown_start_at= response.countdown_start_at;
        visitor_object.countdown_stops_at= response.countdown_stops_at;
        visitor_object.countdown_time_left= response.countdown_time_left;
        visitor_object.countdown_token= response.countdown_token;
        visitor_object.file_for_correct_entry= response.file_for_correct_entry;
        visitor_object.file_for_incorrect_entry= response.file_for_incorrect_entry;
        visitor_object.number_of_incorrect_entries= response.number_of_incorrect_entries;
        visitor_object.number_of_incorrect_entries_entered= response.number_of_incorrect_entries_entered;
        visitor_object.set_time= response.set_time;
        visitor_object.subtract_time_for_every_incorrect_entry= response.subtract_time_for_every_incorrect_entry;
        visitor_object.timer_starts_automatically_when_page_is_opened= response.timer_starts_automatically_when_page_is_opened;
        visitor_object.visitor_alive_time= response.visitor_alive_time;
        

        var calculate_countdownDate = visitor_object.countdown_time_left;
        if(visitor_object.countdown_time_left==null){
          calculate_countdownDate = visitor_object.set_time;
        }
          calculate_countdownDate_arr = calculate_countdownDate.split(":");
          var d = new Date();///
          var Y = d.getFullYear();
          var M = d.getMonth();
          var D = d.getDate();
          d.setSeconds(+(d.getSeconds()) + +calculate_countdownDate_arr[2]);
          d.setMinutes(+(d.getMinutes()) + +calculate_countdownDate_arr[1]);
          d.setHours(+(d.getHours()) + +calculate_countdownDate_arr[0]);
           
          visitor_object.countDownDate = new Date(d).getTime();
          
          //console.log(response.hide_keypad);
          if(response.hide_keypad==1){
            jQuery('.half-right').css({"display":"none"});
            jQuery('#timer').removeClass("half-left");
            return;
          }

          if(response.actions=="Pause" || response.timer_starts_automatically_when_page_is_opened==""){
            jQuery('.half-right').css({"display":"none"});
            jQuery('#timer').removeClass("half-left");
            return;
          }else{
            if(response.actions!="Pause" && response.timer_starts_automatically_when_page_is_opened!=""){
              jQuery('.half-right').css({"display":"block"});
              jQuery('#timer').addClass("half-left");
              
            }
          }
          
          
        
        
      },
      error: (response) => {
        
        console.log("Sorry");
        console.log(response);
        
      }
    });
  }
function updateVisitorVisibility() { //console.log('updateVisitorVisibility');
    var currentdate=currentDateTime();
    var time_left = document.getElementById("countdown_time_left_value").value;
    var postData = {
      "post_id" : visitor_object.post_id ,
      "visitor_alive_time" : currentdate,
      
    };
    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);
      },
      url: webTimerData.root_url + '?rest_route=/wp/v2/visitor/' + postData.post_id,
      type: 'PUT',
      data:postData,
      success: (response) => {
      },
      error: (response) => {
        
        console.log("Sorry");
        console.log(response);
        
      }
    });
  }

function countDownStop() {
    var currentdate = currentDateTime();
    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);
      },
      url: webTimerData.root_url + '?rest_route=/wp/v2/visitor/' + visitor_object.post_id,
      type: 'PUT',
      data:{"countdown_time_left" : document.getElementById("countdown_time_left_value").value,
            "visitor_alive_time" : currentdate ,
            "countdown_stops_at" : currentdate ,
            "actions" : "Pause" ,
      },
      success: (response) => {
        clearInterval(x);
        clearInterval(execute_actions);
        clearInterval(keep_alive);
        jQuery('.half-right').css({"display":"none"});
        jQuery('#timer').removeClass("half-left");
        //document.getElementById("demo").innerHTML = "00:00:00";
        
      },
      error: (response) => {
        
        console.log("Sorry");
        console.log(response);
      }
    });
  }

function countDownDismiss(time_expires) {
  var currentdate = currentDateTime();
  jQuery.ajax({
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);
    },
    url: webTimerData.root_url + '?rest_route=/wp/v2/visitor/' + visitor_object.post_id,
    type: 'PUT',
    data:{"countdown_time_left" : "00:00:00",
          "visitor_alive_time" : currentdate ,
          "countdown_stops_at" : currentdate ,
          "actions" : "Pause" ,
    },
    success: (response) => {
      clearInterval(x);
      clearInterval(keep_alive);
      clearInterval(execute_actions);
      if(time_expires==1){
        playExpireTimeFile();
      }else{
        playIncorrectFile();
      }
      
      document.getElementById("demo").innerHTML = "00:00:00";
      jQuery('.half-right').css({"display":"none"});
      jQuery('#timer').removeClass("half-left");
      
    },
    error: (response) => {
      
      console.log("Sorry");
      console.log(response);
    }
  });
}

function updateVisitorForReset(visitor_post_reset_data) { 
  visitor_post_reset_object = jQuery.parseJSON( visitor_post_reset_data );
  var currentdate = currentDateTime();
  var postData = {
    "post_id" : visitor_post_reset_object.post_id,
    "countdown_start_at":visitor_post_reset_object.countdown_start_at,
    "countdown_time_left":visitor_post_reset_object.countdown_time_left,
    "visitor_alive_time":currentdate,
    "countdown_stops_at":visitor_post_reset_object.countdown_stops_at,
    "reset":"",
  }
  jQuery.ajax({
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);
    },
    url: webTimerData.root_url + '?rest_route=/wp/v2/visitor/' + postData.post_id,
    type: 'PUT',
    data:postData,
    success: (response) => {
      location.reload();
        return;
      
    },
    error: (response) => {
      
      console.log("Sorry");
      console.log(response);
      
    }
  });
}

function updateVisitorForPlay(visitor_post_reset_data) { 
  visitor_post_reset_object = jQuery.parseJSON( visitor_post_reset_data );
  var currentdate = currentDateTime();
  var postData = {
    "post_id" : visitor_post_reset_object.post_id,
    "countdown_time_left":visitor_post_reset_object.countdown_time_left,
    "visitor_alive_time":currentdate,
    "countdown_stops_at":visitor_post_reset_object.countdown_stops_at,
  }
  jQuery.ajax({
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);
    },
    url: webTimerData.root_url + '?rest_route=/wp/v2/visitor/' + postData.post_id,
    type: 'PUT',
    data:postData,
    success: (response) => {
      location.reload();
        return;
      
    },
    error: (response) => {
      
      console.log("Sorry");
      console.log(response);
      
    }
  });
}



function createVisitor(visitor_post_data) { 
  visitor_post_object = jQuery.parseJSON( visitor_post_data );
  
    var currentdate = currentDateTime();
    var ourNewvisitor = {
      "title": visitor_post_object.post_title,
      "status": "publish",
      "countdown_token":visitor_post_object.countdown_token,
      "countdown_post_id":visitor_post_object.countdown_post_id,
      "set_time":visitor_post_object.set_time,
      "countdown_start_at":visitor_post_object.countdown_start_at,
      "countdown_time_left":visitor_post_object.set_time,
      "code_to_stop_timer" : visitor_post_object.code_to_stop_timer,
      "number_of_incorrect_entries":visitor_post_object.number_of_incorrect_entries,
      "number_of_incorrect_entries_entered":visitor_post_object.number_of_incorrect_entries_entered,
      "timer_starts_automatically_when_page_is_opened":visitor_post_object.timer_starts_automatically_when_page_is_opened,
      "subtract_time_for_every_incorrect_entry":visitor_post_object.subtract_time_for_every_incorrect_entry,
      "visitor_alive_time":currentdate,
      "file_for_incorrect_entry":visitor_post_object.file_for_incorrect_entry,
      "file_for_correct_entry":visitor_post_object.file_for_correct_entry,
      "countdown_stops_at":visitor_post_object.countdown_stops_at,
      "actions": visitor_post_object.actions,
      "reset": visitor_post_object.reset,
      "hide_keypad": visitor_post_object.hide_keypad,
      "file_for_expire_time" : visitor_post_object.file_for_expire_time
      
    }//return;
    jQuery.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', webTimerData.nonce);

      },
      url: webTimerData.root_url + '/?rest_route=/wp/v2/visitor/',
      type: 'POST',
      data:ourNewvisitor,
      success: (response) => {
        
        location.reload();
        return;
      },
      error: (response) => {
        
        console.log("Sorry");
        console.log(response);
        return;
      }
    });


  };

jQuery(document).ready(function() { 
  if(visitor_object.actions!="Play" || visitor_object.timer_starts_automatically_when_page_is_opened==""){
      jQuery('.half-right').css({"display":"none"});
      jQuery('#timer').removeClass("half-left");
    }
  if(visitor_object.hide_keypad==1){
    jQuery('.half-right').css({"display":"none"});
    jQuery('#timer').removeClass("half-left");
  }else{
    //console.log('saba');
  }
  jQuery('.code-button li').on('click', function(evt) {
    var buttonPressed = jQuery(this).html();
    var input = jQuery('#code_to_stop_timer');
    
    if (buttonPressed === "C" || buttonPressed === "Clear" || buttonPressed === "Cancel") {
      input.val('');
    } else if (buttonPressed === "Enter") {
      if(input.val()!=''){
          if(visitor_object.code_to_stop_timer != input.val() && 
            (visitor_object.number_of_incorrect_entries==''|| visitor_object.number_of_incorrect_entries==0)){
            //alert("Number of incorrect entries were set to 0.") ;
            var time_expires = 0;
            countDownDismiss(time_expires);
            return;
          }
          if(visitor_object.number_of_incorrect_entries_entered==""){
            visitor_object.number_of_incorrect_entries_entered=0;
          }
          if( visitor_object.code_to_stop_timer != input.val() &&
            visitor_object.number_of_incorrect_entries != null &&
            parseInt(visitor_object.number_of_incorrect_entries) > parseInt(visitor_object.number_of_incorrect_entries_entered)
            ){
                if(visitor_object.subtract_time_for_every_incorrect_entry == ''){
                  visitor_object.subtract_time_for_every_incorrect_entry = '00:00:00';
                }
                subtractTimeForIncorrectCode(input.val());
                
             }else{
              if( visitor_object.code_to_stop_timer == input.val()){
                countDownStop();
                // play File
                playCorrectFile();
                
              }else{
                /*document.getElementById("topleft").innerHTML = "You have already achieved your limit of code entry tries." ;
                setTimeout(function(){
                  document.getElementById("topleft").innerHTML = "" ;
                }, 2000);*/
                var time_expires = 1;
                countDownDismiss(time_expires);
                
                //countDownDismiss();
              }
                /*if(visitor_object.number_of_incorrect_entries!=null && visitor_object.number_of_incorrect_entries!= 0){
                  alert('You have achieved your limit of code entry tries which was '+visitor_object.number_of_incorrect_entries);
                }else{
                  countDownDismiss();
                }*/
                
                input.val('');
                return false;
             }
       }else{
          alert('Please enter code');
          return false;
       }
       input.val('');
     
      //input.val(input.val()+buttonPressed);
    } else {
        input.val(input.val()+buttonPressed);
    } 

    
    //updateScreen(currentEntry);
  });

  

});



