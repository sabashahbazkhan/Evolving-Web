<?php get_header(); ?>

  <div class="bgimg">
  <div class="topleft">
    <p></p>
  </div>
  <div class="middle">
    <div class="half-left">
      <?php
        while ( have_posts() ) : the_post();

          the_title();

        endwhile; // End of the loop.
      ?>
        <hr>
    </div>
    <div class="half-right">
      <ul class="code-button">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
        <li>0</li>
        <li>C</li>
        <li>#</li> 
      </ul>
    </div>
  </div>
  <div class="bottomleft">
    <p></p>
  </div>
</div>
<?php get_footer();