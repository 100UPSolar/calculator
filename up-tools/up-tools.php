<?php
/**
 * Plugin Name: 100UP Internal Tools
 * Plugin URI: https://100up.com.au/100-up
 * Description: 100UP interactive tools and calculators. Add Custom Tool shortcodes to any page, assets load only where needed.
 * Developed by Brighter Websites
 * Mathematical methodology: 100up
 * Author: 100up + Brighter Websites
 * Author URI: https://brighterwebsites.com/
 * License: Client Owned
 * Version: 1.0.0
 * 
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'UP_TOOLS_VERSION', '1.0.0' );
define( 'UP_TOOLS_URL', plugin_dir_url( __FILE__ ) );
define( 'UP_TOOLS_PATH', plugin_dir_path( __FILE__ ) );

// ─────────────────────────────────────────────
// Registry — add new tools here as they are built
// Each tool: shortcode slug => asset file prefix
// ─────────────────────────────────────────────
function up_tools_registry() {
    return [
        'up_solar_optimiser' => 'up-solar-optimiser',
        // 'up_power_sizer'  => 'up-power-sizer',   // future tools go here
    ];
}

// ─────────────────────────────────────────────
// Conditional asset loading
// Scans post content for registered shortcodes
// Only enqueues assets for tools actually on the page
// ─────────────────────────────────────────────
function up_tools_enqueue_assets() {
    global $post;

    if ( ! is_a( $post, 'WP_Post' ) ) return;

    $registry = up_tools_registry();

    foreach ( $registry as $shortcode => $prefix ) {
        if ( has_shortcode( $post->post_content, $shortcode ) ) {
            up_tools_enqueue_tool( $prefix );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'up_tools_enqueue_assets' );

function up_tools_enqueue_tool( $prefix ) {
    $css_path = UP_TOOLS_PATH . "assets/{$prefix}.css";
    $js_path  = UP_TOOLS_PATH . "assets/{$prefix}.js";

    if ( file_exists( $css_path ) ) {
        wp_enqueue_style(
            $prefix,
            UP_TOOLS_URL . "assets/{$prefix}.css",
            [],
            UP_TOOLS_VERSION
        );
    }

    if ( file_exists( $js_path ) ) {
        wp_enqueue_script(
            $prefix,
            UP_TOOLS_URL . "assets/{$prefix}.js",
            [],
            UP_TOOLS_VERSION,
            true // load in footer
        );
    }
}

// ─────────────────────────────────────────────
// Shortcode registration
// ─────────────────────────────────────────────
function up_tools_register_shortcodes() {
    $registry = up_tools_registry();
    foreach ( $registry as $shortcode => $prefix ) {
        add_shortcode( $shortcode, 'up_tools_render_shortcode' );
    }
}
add_action( 'init', 'up_tools_register_shortcodes' );

function up_tools_render_shortcode( $atts, $content, $tag ) {
    $registry = up_tools_registry();
    $prefix   = $registry[ $tag ] ?? null;

    if ( ! $prefix ) return '<!-- UP Tools: unknown shortcode ' . esc_html( $tag ) . ' -->';

    $template = UP_TOOLS_PATH . "templates/{$prefix}.php";

    if ( ! file_exists( $template ) ) {
        return '<!-- UP Tools: missing template for ' . esc_html( $prefix ) . ' -->';
    }

    ob_start();
    include $template;
    return ob_get_clean();
}

// ─────────────────────────────────────────────
// LiteSpeed Cache — exclude UP tool scripts from
// minification and combination.
// Wildcard: up-*.js covers all current and future tools.
// In LiteSpeed Cache > JS Settings > JS Excludes, add:
//   up-
// (prefix match covers all up-*.js files)
// ─────────────────────────────────────────────
