(function ($) {
    "use strict";


    /*---------------------
     TOP Menu Stick
    --------------------- */
    const s = $("#sticker");
    const pos = s.position();
    $(window).on('scroll', function () {
        const windowpos = $(window).scrollTop();
        if (windowpos > pos.top) {
            s.addClass("stick");
        } else {
            s.removeClass("stick");
        }
    });

    /*----------------------------
        tooltip
    ------------------------------ */
    $(function () {
        $('[data-bs-toggle="tooltip"]').tooltip();
    });
    /*jQuery MeanMenu*/
    jQuery('nav#dropdown').meanmenu();

    /* wow js active */
    new WOW().init();

    /*product-crousel */
    $(".product-crousel").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 3,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        itemsDesktop: [1199, 3],
        itemsTablet: [992, 2],
        itemsMobile: [767, 1],
    });
    /* product-crousel */
    $(".features-crousel").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 4,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        itemsDesktop: [1199, 3],
        itemsTablet: [992, 2],
        itemsMobile: [767, 1],
    });
    $(".best-seller-crousel").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 1,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        singleItem: true,
    });
    $(".brand-crousel").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 6,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        itemsDesktop: [1199, 5],
        itemsDesktopSmall: [980, 4],
        itemsTablet: [768, 3],
        itemsMobile: [479, 1],
    });
    $(".recent-post-crousel").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 4,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [980, 3],
        itemsTablet: [768, 2],
        itemsMobile: [479, 1],
    });
    /*product-crousel */
    $(".new-product-crousel").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 3,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [980, 2],
        itemsTablet: [767, 1],
        itemsMobile: [479, 1],
    });

    $(".product-crousel-2").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: false,
        navigation: true,
        items: 4,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [980, 3],
        itemsTablet: [768, 2],
        itemsMobile: [576, 1],
    });

    $(".single-product-crousel").owlCarousel({
        autoPlay: false,
        slideSpeed: 2000,
        pagination: true,
        navigation: false,
        items: 1,
        /* transitionStyle : "fade", */    /* [This code for animation ] */
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        singleItem: true,
    });
    /*price-slider active */
    $("#slider-range").slider({
        range: true,
        min: 40,
        max: 600,
        values: [60, 570],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));

    /*--------------------------
        Category Menu
    ---------------------------- */
    $('.rx-parent').on('click', function () {
        $('.rx-child').slideToggle();
        $(this).toggleClass('rx-change');

    });

    $(".embed-responsive iframe").addClass("embed-responsive-item");
    $(".carousel-inner .item:first-child").addClass("active");

    /*--------------------------
        category left menu
    ---------------------------- */
    $('.category-heading').on('click', function () {
        $('.category-menu-list').slideToggle(300);
    });
    /*--------------------------
     scrollUp
    ---------------------------- */
    $.scrollUp({
        // scrollText: '<i class="fa fa-angle-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });
    /*---------------------
     elevateZoom
    --------------------- */
    $('.zoom1').elevateZoom();
    /*----- cart-plus-minus-button -----*/
    $(".cart-plus-minus").append('<div class="dec qtybutton">-</div><div class="inc qtybutton">+</div>');
    $(".qtybutton").on("click", function () {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() == "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find("input").val(newVal);
    });

})(jQuery); 