<?php
/*
Plugin Name: Web Countdown Timer
Plugin URI: http://www.devbysaba.arsalanahmad.com
Description: This clock counts down to 0. When the correct code is entered using the keypad, the clock stops and an image is displayed or a video or sound file is played. When an incorrect code is entered, a different image or a video or sound file is played, 
Author: Saba
Version: 0.1
Author URI: http://www.devbysaba.arsalanahmad.com
*/
// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
  die;
}

function web_timer_post_types() {
// countdown Post Type
  register_post_type('countdown', array(
    //'show_in_rest' => true,
    'supports' => array('title','editor'),
    'public' => true,
    'labels' => array(
      'name' => 'Countdowns',
      'add_new_item' => 'Add New Countdown',
      'edit_item' => 'Edit Countdown',
      'all_items' => 'All Countdowns',
      'singular_name' => 'Countdown'
    ),
    'menu_icon' => 'dashicons-clock',
  ));
  
  
  

}
//adding custom post type for countdown
add_action('init', 'web_timer_post_types');


// Shortcode
add_shortcode( 'countdown', 'countdown_listing_shortcode1' );
function countdown_listing_shortcode1( $atts ) {
    ob_start();
    $query = new WP_Query( array(
       'post_type' => 'countdown',
        'posts_per_page' => -1,
        'order' => 'DESC'
    ) );
    if ( $query->have_posts() ) { ?>
        <ul class="countdown-listing">
            <?php while ( $query->have_posts() ) : $query->the_post(); ?>
            <li id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?>, <i>Set Time: <?php echo get_field('set_time') ?></i> , <i>Code to stop: <?php echo get_field('code_to_stop_timer') ?></i></a>
            </li>
            <?php endwhile;
            wp_reset_postdata(); ?>
        </ul>
    <?php $myvariable = ob_get_clean();
    return $myvariable;
    }
}

add_filter( 'manage_countdown_posts_columns', 'custom_countdown_columns' );
function custom_countdown_columns( $columns ) {
  
   $columns = array(
            
            "cb"            => '<input type="checkbox" />',
            "title"         => __( 'Title', 'countdown' ),
            'countdown' => __( 'Shortcode' , 'countdown' ),
            'Author' => __( 'Author', 'countdown' ),
            "date"          => __( 'Date', 'countdown' )

        );



        return $columns;

}

add_action( 'manage_countdown_posts_custom_column', 'custom_countdown_columns_value', 10, 2);
function custom_countdown_columns_value( $column, $post_id ) {
  // Image column
  if ( 'countdown' === $column ) {
    //echo get_the_post_thumbnail( $post_id, array(80, 80) );
    printf( '[countdown p=%d]', $post_id );
  }
}

?>