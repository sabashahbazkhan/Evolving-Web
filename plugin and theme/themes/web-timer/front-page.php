<?php
get_header();

$token = sanitize_text_field(get_query_var('token'));
$countdownMessage ='';
$showCountdown = true;
$get_countdown_id = explode("_cd_",$token);
$countdown_id = $get_countdown_id[1];

$countdownQuery = new WP_Query(array(
  'post_type' => 'countdown',
  'post__in' => array($countdown_id)
));

if($countdownQuery->have_posts()){ 
  while($countdownQuery->have_posts()) {
      $countdownQuery->the_post();
      $countDownInfoArray = array(
        'post_id' => get_the_ID(),
        'post_content' => get_the_content(),
        'set_time' => get_field('set_time_c'),
        'code_to_stop_timer' => get_field('code_to_stop_timer_c'),
        'number_of_incorrect_entries' => get_field('number_of_incorrect_entries_c'),
        'timer_starts_automatically_when_page_is_opened' => get_field('timer_starts_automatically_when_page_is_opened_c'),
        'file_for_incorrect_entry' => get_field('file_for_incorrect_entry_c'),
        'file_for_correct_entry' => get_field('file_for_correct_entry_c'),
        'subtract_time_for_every_incorrect_entry'=>get_field('subtract_time_for_every_incorrect_entry_c'),
        'post_permalink' => get_the_permalink(),
        'hide_keypad' => get_field('hide_keypad_c'),
        'file_for_expire_time' => get_field('file_for_expire_time_c'),

     );      
  }
  wp_reset_postdata();
}


$visitor = new WP_Query(array(
      'post_type' => 'visitor',
      'meta_query' => array(
        array(
          'key' => 'countdown_token',
          'compare' => '=',
          'value' => $token
        )
      )
    ));
if($visitor->have_posts()){ 
  while($visitor->have_posts()) {
      $visitor->the_post(); 
      //check if timer is paused
      $timer_starts_automatically = get_field('timer_starts_automatically_when_page_is_opened');
      $time_to_add_array = explode(":",get_field('set_time'));
      $countdown_time_left = get_field('set_time');
      if(get_field('reset')=="" && get_field('countdown_time_left')!="" && get_field('countdown_time_left')!="00:00:00"  && get_field('set_time') != get_field('countdown_time_left')){
        $time_to_add_array = explode(":",get_field('countdown_time_left'));
        $countdown_time_left = get_field('countdown_time_left');
      }
      
      $h_to_add = $time_to_add_array[0];
      $minutes_to_add = $time_to_add_array[1];
      $s_to_add = $time_to_add_array[2];
      $time = new DateTime(); 
      $startTime = $time;
      $countdown_time_start_at = $startTime->format('Y-m-d H:i:s');
      $time->add(new DateInterval('PT' . $h_to_add . 'H'));
      $time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
      $time->add(new DateInterval('PT' . $s_to_add . 'S'));
      $countdown_stops_at = $time->format('Y-m-d H:i:s');

      $visitor_post_data =  array(
        'post_id' => get_the_ID(),
        'countdown_token' => get_field('countdown_token'),
        'set_time' => get_field('set_time'),
        'code_to_stop_timer' => get_field('code_to_stop_timer'),
        'number_of_incorrect_entries' => get_field('number_of_incorrect_entries'),
        'number_of_incorrect_entries_entered' => get_field('number_of_incorrect_entries_entered'),
        'timer_starts_automatically_when_page_is_opened' => get_field('timer_starts_automatically_when_page_is_opened'),
        'file_for_incorrect_entry' => get_field('file_for_incorrect_entry'),
        'file_for_correct_entry' => get_field('file_for_correct_entry'),
        'subtract_time_for_every_incorrect_entry'=>get_field('subtract_time_for_every_incorrect_entry'),
        'countdown_post_id' => get_field('countdown_post_id'),
        'countdown_time_left' => get_field('countdown_time_left'),
        'visitor_alive_time' => get_field('visitor_alive_time'),
        'countdown_start_at'=> get_field('countdown_start_at'),
        'countdown_stops_at' => get_field('countdown_stops_at'),
        'actions' => get_field('actions'),
        'reset' => get_field('reset'),
        'hide_keypad' => get_field('hide_keypad'),
        'file_for_expire_time' => get_field('file_for_expire_time')
      );
      
      //Reset block
        if($timer_starts_automatically[0] == "Yes" && 
          $visitor_post_data['reset']=="Reset"){  
          $visitor_post_reset_object =  array(
          'post_id' => get_the_ID(),
          'countdown_start_at' => $countdown_time_start_at,
          'countdown_stops_at' => $countdown_stops_at,
          'countdown_time_left' => get_field('set_time'),
          );
        $json_visitor_post_data = json_encode($visitor_post_reset_object,true);
        ?>
          <script> 
          var updateVisitor = updateVisitorForReset('<?php echo $json_visitor_post_data; ?>'); 
          </script>
      <?php
      }else{ 
        if(get_field('actions')=="Play" &&
          $timer_starts_automatically[0] == "Yes" &&
          $visitor_post_data['countdown_stops_at']==""){ 
            $visitor_post_play_object =  array(
            'post_id' => get_the_ID(),
            'countdown_stops_at' => $countdown_stops_at,
            'countdown_time_left' => $countdown_time_left,
            );
            $json_visitor_post_data = json_encode($visitor_post_play_object,true);
            ?>
              <script> 
              var updateVisitor = updateVisitorForPlay('<?php echo $json_visitor_post_data; ?>'); 
              </script>
          <?php
        }
      }
       
      if($timer_starts_automatically[0] != "Yes" ){ 
        //$showCountdown = false;
        //$countdownMessage = get_field('countdown_time_left');

      }
      wp_reset_postdata();

    }
        
}else{ 
  ///////////////////////
  //if visitor dont have countdown started
  ////////

  $showCountdown = false;
  $countdownMessage = $countDownInfoArray['set_time'];
  //calculate start and stop
  $time_to_add_array = explode(":",$countDownInfoArray['set_time']);
  $h_to_add = $time_to_add_array[0];
  $minutes_to_add = $time_to_add_array[1];
  $s_to_add = $time_to_add_array[2];
  $time = new DateTime(); //Here you can also pass your Dynamic Variable like DateTime($variable);
  $startTime = $time;
  $countdown_time_start_at = $startTime->format('Y-m-d H:i:s');
  $time->add(new DateInterval('PT' . $h_to_add . 'H'));
  $time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
  $time->add(new DateInterval('PT' . $s_to_add . 'S'));
  $countdown_stops_at = $time->format('Y-m-d H:i:s');
  $countdown_time_left = $countDownInfoArray['set_time'];
  // end 
  $file_for_incorrect_entry='';
  $file_for_correct_entry='';
  $file_for_expire_time = '';
  if($countDownInfoArray['file_for_correct_entry']==true){
    $file_for_correct_entry = $countDownInfoArray['file_for_correct_entry']["url"];
  }
  if($countDownInfoArray['file_for_incorrect_entry']==true){
    $file_for_incorrect_entry = $countDownInfoArray['file_for_incorrect_entry']["url"];
  }
  if($countDownInfoArray['file_for_expire_time']==true){
    $file_for_expire_time = $countDownInfoArray['file_for_expire_time']["url"];
  }
  if($countDownInfoArray['timer_starts_automatically_when_page_is_opened'][0] != "Yes"){
    $countdown_stops_at="";
  }
  if($countDownInfoArray['hide_keypad']==true){
    $countDownInfoArray['hide_keypad']=1;
  }else{
    $countDownInfoArray['hide_keypad']=0;
  }
    $visitor_post_data = array(
        'post_status'   =>  'publish',
        'post_type'   =>  'visitor',
        'post_title'    =>  $token,
        'post_author'   =>  get_current_user_id(),
        'countdown_token' => $token,
        'countdown_post_id' => $countDownInfoArray['post_id'],
        'set_time' => $countDownInfoArray['set_time'],
        'code_to_stop_timer' => $countDownInfoArray['code_to_stop_timer'],
        'number_of_incorrect_entries' => $countDownInfoArray['number_of_incorrect_entries'],
        'number_of_incorrect_entries_entered' => 0,
        'timer_starts_automatically_when_page_is_opened' => $countDownInfoArray['timer_starts_automatically_when_page_is_opened'],
        'file_for_incorrect_entry' => $file_for_incorrect_entry,
        'file_for_correct_entry' => $file_for_correct_entry,
        'subtract_time_for_every_incorrect_entry'=>$countDownInfoArray['subtract_time_for_every_incorrect_entry'],
        'countdown_start_at'=> $countdown_time_start_at,
        'countdown_stops_at' => $countdown_stops_at,
        'countdown_time_left'=> $countdown_time_left,
        'countdown_post_id' => $countDownInfoArray['post_id'],
        'visitor_alive_time' => date("Y-m-d h:i:s"),
        'actions' => "Play",
        'reset' => "",
        'hide_keypad' => $countDownInfoArray['hide_keypad'],
        'file_for_expire_time' => $file_for_expire_time,
        
      );
    $json_visitor_post_data = json_encode($visitor_post_data,true);
    ?>
      <script> 
        var newVisitor = createVisitor('<?php echo $json_visitor_post_data; ?>');
      </script>
    <?php
    //die();
}
  
?>
<script>
    /*const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = new Date();
    var Y = d.getFullYear();
    var M = monthNames[d.getMonth()];
    var D = d.getDate();
    var completeDate= "<?php //echo $visitor_post_data['countdown_stops_at'] ?>";
    var countDownDate = new Date(completeDate).getTime(); */

    var visitor_object = {
      "post_id": "<?php echo $visitor_post_data['post_id']; ?>",
      "post_author": "<?php echo $visitor_post_data['post_author']; ?>",
      "countdown_post_id": "<?php echo $visitor_post_data['countdown_post_id']; ?>",
      "countdown_token": "<?php echo $visitor_post_data['countdown_token']; ?>",
      "set_time": "<?php echo $visitor_post_data['set_time']; ?>",
      "code_to_stop_timer": "<?php echo $visitor_post_data['code_to_stop_timer']; ?>",
      "number_of_incorrect_entries": "<?php echo $visitor_post_data['number_of_incorrect_entries']; ?>",
      "number_of_incorrect_entries_entered": "<?php echo $visitor_post_data['number_of_incorrect_entries_entered']; ?>",
      "timer_starts_automatically_when_page_is_opened": "<?php echo $visitor_post_data['timer_starts_automatically_when_page_is_opened'][0]; ?>",
      "subtract_time_for_every_incorrect_entry": "<?php echo $visitor_post_data['subtract_time_for_every_incorrect_entry']; ?>",
      "countdown_start_at": "<?php echo $visitor_post_data['countdown_start_at']; ?>",
      "countdown_stops_at": "<?php echo $visitor_post_data['countdown_stops_at']; ?>",
      "countdown_time_left": "<?php echo $visitor_post_data['countdown_time_left']; ?>",
      "visitor_alive_time": "<?php echo $visitor_post_data['visitor_alive_time']; ?>",
      "countDownDate": "",
      "file_for_incorrect_entry":"<?php echo $visitor_post_data['file_for_incorrect_entry']; ?>",
      "file_for_correct_entry":"<?php echo $visitor_post_data['file_for_correct_entry']; ?>",
      "actions":"<?php echo $visitor_post_data['actions']; ?>",
      "reset":"<?php echo $visitor_post_data['reset']; ?>",
      "hide_keypad":"<?php echo $visitor_post_data['hide_keypad']; ?>",
      "file_for_expire_time":"<?php echo $visitor_post_data['file_for_expire_time']; ?>",
      };
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
      //update user visibility after every 5 minutes
    var keep_alive = setInterval(updateVisitorVisibility, 300000);
</script>
    
    <?php if($showCountdown){ ?>
      <script type="text/javascript">
        var execute_actions = setInterval(countDownActions, 15000);
        // Update the count down every 1 second
        var x = setInterval(countDownStart, 1000);
      </script>
      
  <?php } ?>
    



<div class="bgimg">
  <div class="topleft" id="topleft">
  </div>
  <div class="middle">
    <div id="timer" class="half-left">
      <h1 id="demo"><?php echo $countdownMessage; ?> </h1>
      <input type="hidden" id="countdown_time_left_value" value="">
    </div>

    <?php if($visitor_post_data['hide_keypad']==0 || $visitor_post_data['actions']=="Play"){ 
        get_template_part('template-parts/content-keypad');
      }
    
    ?>
  </div>
  <div style="clear: both;"></div>
  <div class="bottomleft">
    <p></p>
  </div>
  <div class="bottomright">
    <p><a href="<?php echo esc_url( wp_logout_url(site_url()) ); ?>">Logout</a></p>
    <br>
  </div>
</div>
<?php get_footer(); ?>