<?php get_header(); 
$ourCurrentUser = wp_get_current_user();

if ($ourCurrentUser->roles[0] !== 'administrator') {
    global $wp_query;
    $wp_query->set_404();
    status_header( 404 );
    get_template_part( 404 );
    exit();
}
$id= get_the_ID();
?>



<div class="bgimg">
  <div class="topleft">
    <p></p>
  </div>
  <div class="middle">
    Who's Online on <?php the_title();?>
    <p>Visitors Alive Time is 15 minute</p>
    <table id="visitors">
      <tr>
        <th>#</th>
        <th>Visitor</th>
        <th>Start At</th>
        <th>Time Left</th>
        <th>State</th>
        <th>Link</th>
        <th>Alive</th>
      </tr>
      <?php
        $date_past_visitor_alive_time = date('Y-m-d H:i:s',time() - 15 * 60);
        $visitor_alive = new WP_Query(array(
                    'post_type' => 'visitor',
                    'meta_query' => array(
                      'relation' => 'AND',
                      array(
                        'key' => 'countdown_post_id',
                        'value'   => $id,
                        'compare' => 'like'
                      ),
                      array(
                        'key' => 'visitor_alive_time',
                        'compare' => '>',
                        'value' => $date_past_visitor_alive_time
                      )

                      
                    )
                  ));
        while($visitor_alive->have_posts()) {
        $visitor_alive->the_post();
        $i=1;
      ?>
      <tr>
        <td><?php echo $i; ?></td>
        <td><?php the_title()." "; ?></td>
        <td><?php echo get_field('countdown_start_at'); ?></td>
        <td><?php echo get_field('countdown_time_left'); ?></td>
        <td><?php echo get_field('actions'); ?></td>
        <td><?php echo site_url('/?token='.get_field('countdown_token')); ?></td>
        <td><?php echo get_field('visitor_alive_time'); ?></td>
      </tr>
      <?php 
      $i++;
      }
      wp_reset_postdata();
      ?>
    </table>
  </div>
  <div class="bottomleft">
    <p></p>
  </div>
</div>
<?php

 get_footer(); ?>