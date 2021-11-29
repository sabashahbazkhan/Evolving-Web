<?php
date_default_timezone_set(get_option('timezone_string'));
function countdown_template_redirect()
{
  global $wp_query;
  if(is_front_page()){    
    $token = sanitize_text_field(get_query_var('token'));
    $get_countdown_id = explode("_cd_",$token);
    $countdown_id = $get_countdown_id[1];
    $countDownInfo = wp_get_single_post($countdown_id);
    if(isset($countDownInfo->post_content) && !empty($countDownInfo->post_content) ){
       $content= $countDownInfo->post_content;
        $pos = strpos($content, $token); 
        if ($pos === false){ 
          $wp_query->set_404();
          status_header( 404 );
          get_template_part( 404 );
          exit();
        }
    }
    //
        
    if( ! is_user_logged_in() ) {
      
      //Check if user exist 
      $user_name = $token."_".$countdown_id;
      if ( !username_exists( $user_name ) ){
          $user_password = $token;
          $user_email= $token."@webtimer.com";
          $user_name= $user_name;
          $user_id = wp_create_user($user_name,$user_password,$user_email);
          wp_update_user([
            'ID' => $user_id,
            'nickname' => $token
          ]);
          # so, now we may load newly created user
          $ready_user = new \WP_User( $user_id );
          # set its role (I used subscriber)
          $ready_user->set_role('subscriber');
      }else{
        $user_password = $token;
        $user_email= $token."@webtimer.com";

      }
           
      // login user
      
      $user =wp_signon(array('user_login'=>$user_email, 'user_password'=>$user_password,'remember'=>true),false);
      if ( is_wp_error($user) ) {
          global $wp_query;
          $wp_query->set_404();
          status_header( 404 );
          get_template_part( 404 );
          exit();
      }else{

        $id=$user->data->ID;
        var_dump($id);
        wp_clear_auth_cookie();
        wp_set_current_user( $id );
        wp_set_auth_cookie( $id );
        if (is_user_logged_in()){
          wp_redirect(site_url('/?token='.$token));
          exit;
        }
      }
    
    }else{
      $current_user = wp_get_current_user();
      if($current_user->user_login !== $token."_".$countdown_id){
        $wp_query->set_404();
        status_header( 404 );
        get_template_part( 404 );
        exit();

      } 
    }
  }
    
}
add_action( 'template_redirect', 'countdown_template_redirect' );
function webtimer_files() {
  wp_enqueue_script('jquery', get_theme_file_uri('/js/modules/jquery-3.3.1.min.js'), array(), null, true);
  wp_enqueue_script('main-webtimer-js', get_theme_file_uri('/js/modules/scripts.js'), NULL, '1.0', false);
  
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('webtimer_main_styles', get_stylesheet_uri());
  wp_enqueue_style('timer-fonts', get_theme_file_uri('/css/fonts/webfontkit-20181124-020830/stylesheet.css'));
  wp_localize_script('main-webtimer-js', 'webTimerData', array(
    'root_url' => get_site_url(),
    'theme_url' => get_theme_file_uri(),
    'nonce' => wp_create_nonce('wp_rest'),
    'logout_url' => wp_logout_url( home_url() )
  ));

}

add_action('wp_enqueue_scripts', 'webtimer_files');
add_action('wp_enqueue_media', 'include_media_button_js_file');
function include_media_button_js_file() {
    wp_enqueue_script('media_button', get_theme_file_uri('/js/modules/media_scripts.js'), array('jquery'), '1.0', true);
    wp_localize_script('media_button', 'webTimerDataAdmin', array(
    'site_root_url' => get_site_url(),
    
  ));
}
function add_media_button() {
        echo '<a  class="button countdown-permalink-button" id="unique-countdown-permalink-button">
          <span class="wp-media-buttons-icon dashicons dashicons-admin-links"></span> Generate Unique Permalinks
        </a>';
}
add_action( 'media_buttons', 'add_media_button' );
function webTimerQueryVars($vars) {
  $vars[] = 'token';
  return $vars;
}

add_filter('query_vars', 'webTimerQueryVars');
function webtimer_features() {
  add_theme_support('title-tag');
}

add_action('after_setup_theme', 'webtimer_features');
// Redirect subscriber accounts out of admin and onto homepage
add_action('admin_init', 'redirectSubsToFrontend');

function redirectSubsToFrontend() {
  $ourCurrentUser = wp_get_current_user();

  if (count($ourCurrentUser->roles) == 1 AND $ourCurrentUser->roles[0] == 'subscriber') {
    $token = sanitize_text_field(get_query_var('token'));
    wp_redirect(site_url('/?token='.$token));
    exit;
  }
}
add_action('wp_loaded', 'noSubsAdminBar');

function noSubsAdminBar() {
  $ourCurrentUser = wp_get_current_user();

  if (count($ourCurrentUser->roles) == 1 AND $ourCurrentUser->roles[0] == 'subscriber') {
    show_admin_bar(false);
  }
}
// Visitor Post Type
  register_post_type('visitor', array(
    'show_in_rest' => true,
    'capability_type' => array('visitor'),
    'map_meta_cap' => true,
    'supports' => array('title'),
    'public' => true,
    'show_ui' => true,
    'labels' => array(
      'name' => 'Visitors',
      'add_new_item' => 'Add New Visitor',
      'edit_item' => 'Edit Visitor',
      'all_items' => 'All Visitors',
      'singular_name' => 'Visitor'
    ),
    'menu_icon' => 'dashicons-groups'
  ));
add_action('admin_init','visitor_add_role_caps');
function visitor_add_role_caps() {

  // Add the roles you'd like to administer the custom post types
  $roles = array('subscriber','administrator');

// Loop through each role and assign capabilities
  foreach($roles as $the_role) { 

       $role = get_role($the_role);
    
             $role->add_cap( 'read' );
             $role->add_cap( 'read_visitor');
             $role->add_cap( 'read_private_visitors' );
             $role->add_cap( 'add_visitor' );
             $role->add_cap( 'add_visitors' );
             $role->add_cap( 'create_visitor' );
             $role->add_cap( 'create_visitors' );
             $role->add_cap( 'edit_visitor' );
             $role->add_cap( 'edit_visitors' );
             $role->add_cap( 'edit_others_visitors' );
             $role->add_cap( 'edit_published_visitors' );
             $role->add_cap( 'publish_visitors' );
             $role->add_cap( 'delete_others_visitors' );
             $role->add_cap( 'delete_private_visitors' );
             $role->add_cap( 'delete_published_visitors' );

  }
}

add_action( 'rest_api_init', 'create_visitor_meta_field' );

function create_visitor_meta_field() {

 register_rest_field( 'visitor', 'countdown_token', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'set_time', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'countdown_start_at', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'countdown_time_left', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'number_of_incorrect_entries', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'number_of_incorrect_entries_entered', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'timer_starts_automatically_when_page_is_opened', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'subtract_time_for_every_incorrect_entry', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'visitor_alive_time', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );

 register_rest_field( 'visitor', 'file_for_incorrect_entry', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'file_for_correct_entry', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'countdown_post_id', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'code_to_stop_timer', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'countdown_stops_at', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'actions', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'reset', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'hide_keypad', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
 register_rest_field( 'visitor', 'file_for_expire_time', array(
   'get_callback' => 'get_post_meta_for_api',
   'update_callback'   => 'update_post_meta_for_ctl',
   'schema' => null,
   )
 );
}


function update_post_meta_for_ctl($value, $object, $fieldName ) {
    
    //var_dump($fieldName);var_dump($value);var_dump($object);
    $havemetafield  = get_post_meta($object->ID, $fieldName, false);
    if ($havemetafield) {
        $ret = update_post_meta($object->ID, $fieldName, $value );
    } else {
        $ret = add_post_meta( $object->ID, $fieldName, $value ,true );
    }
    return true;
}

function get_post_meta_for_api( $object , $fieldName) {
 $post_id = $object['id'];

    $meta = get_post_meta( $post_id );

    if ( isset( $meta[$fieldName] ) && isset( $meta[$fieldName ][0] ) ) {
        //return the post meta
        return $meta[$fieldName ][0];
    }

    // meta not found
    return false;
}

add_action('wp_trash_post', 'my_wp_trash_post');
function my_wp_trash_post($postid){
    global $post;
    if ( $post->post_type == 'visitor' && $post->post_author != get_current_user_id()) {
     wp_delete_user($post->post_author);
    }

}

/*function action_check_to_perform_on_visitor( $data, $postarr ) {
  if($data["post_type"]=='visitor'){
    echo "<pre>";
    //var_dump($data);
    $post_id = $postarr['ID'];
    $action_meta = reset($_POST['acf']);

    var_dump($action_meta);
    //var_dump($_POST);die();
    if($action_meta=='Reset'){
      //echo "IN";die();
      //update_post_meta( 76, 'my_key', 'Steve' );
    }
    //die();
  }
  
    //$data['post_name'] = sanitize_title( $data['post_title'] );
    return $data;
}
add_filter( 'wp_insert_post_data', 'action_check_to_perform_on_visitor', 99, 2 );

*/

?>