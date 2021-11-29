<?php get_header(); ?>

  <div class="bgimg">
  <div class="topleft">
    <p></p>
  </div>
  <div class="middle">
    <?php echo date_default_timezone_get(); ?>
    <hr>
    Date From Jquery
    <p id="date_by_jquey">
      
    </p>
    <hr>
    <?php
    $countDownInfoArray= "00:00:00";
    $time_to_add_array = explode(":",$countDownInfoArray);
    $h_to_add = $time_to_add_array[0];
    $minutes_to_add = $time_to_add_array[1];
    $s_to_add = $time_to_add_array[2];
    $time = new DateTime(); //Here you can also pass your Dynamic Variable like DateTime($variable);
    $time->add(new DateInterval('PT' . $h_to_add . 'H'));
    $time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
    $time->add(new DateInterval('PT' . $s_to_add . 'S'));
    $countdown_stops_at = $time->format('Y-m-d H:i:s');
    echo $countdown_stops_at;
    ?>
  </div>
  <div class="bottomleft">
    <p></p>
  </div>
</div>
<script type="text/javascript">
  var currentdate = currentDateTime();
  document.getElementById("date_by_jquey").innerHTML = currentdate;
</script>
<?php get_footer(); ?>