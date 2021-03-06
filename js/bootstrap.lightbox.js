// Generated by CoffeeScript 1.6.3
/*
Lightbox for Bootstrap
by Dan Jones - http://djinteractive.co.uk

Attribution
=================
Forked from Lightbox v2.51 - http://lokeshdhakar.com/projects/lightbox2/

Thanks
- Scott Upton(uptonic.com), Peter-Paul Koch(quirksmode.com), and Thomas Fuchs(mir.aculo.us) for ideas, libs, and snippets.
- Artemy Tregubenko (arty.name) for cleanup and help in updating to latest proto-aculous in v2.05.

Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
- free for use in both personal and commercial projects
- attribution requires leaving author name, author link, and the license info intact


Table of Contents
=================
LightboxOptions

Lightbox
- constructor
- init
- enable
- build
- start
- changeImage
- setTitle
- sizeContainer
- showImage
- updateNav
- updateDetails
- preloadNeigbhoringImages
- enableKeyboardNav
- disableKeyboardNav
- keyboardAction
- end

options = new LightboxOptions
lightbox = new Lightbox options
*/


(function() {
  var $, Lightbox, LightboxOptions;

  $ = jQuery;

  LightboxOptions = (function() {
    function LightboxOptions() {
      this.fileLoadingImage = "images/loader.svg";
      this.resizeDuration = 700;
      this.fadeDuration = 500;
      this.labelImage = "Image";
      this.labelOf = "of";
    }

    return LightboxOptions;

  })();

  Lightbox = (function() {
    function Lightbox(options) {
      this.options = options;
      this.album = [];
      this.currentImageIndex = void 0;
      this.init();
    }

    Lightbox.prototype.init = function() {
      this.enable();
      return this.build();
    };

    Lightbox.prototype.enable = function() {
      var _this = this;
      return $("body").on("click", ".thumbnails[data-toggle^=lightbox] .thumbnail", function(e) {
        _this.start($(e.currentTarget));
        return false;
      });
    };

    Lightbox.prototype.build = function() {
      var $lightbox,
        _this = this;
      $("<div/>", {
        id: "lightboxOverlay"
      }).appendTo($("body"));
      $("<div/>", {
        id: "lightbox"
      }).append($("<div/>", {
        "class": "lb-outerContainer"
      }).append($("<button/>", {
        "class": "close",
        type: "button",
        "aria-hidden": "true"
      }).html("&times;"), $("<div/>", {
        "class": "lb-container"
      }).append($("<img/>", {
        "class": "lb-image"
      }), $("<div/>", {
        "class": "lb-nav"
      }).append($("<a/>", {
        "class": "lb-prev"
      }), $("<a/>", {
        "class": "lb-next"
      })), $("<div/>", {
        "class": "lb-loader"
      }).append($("<a/>", {
        "class": "lb-cancel"
      }).append($("<img/>", {
        src: this.options.fileLoadingImage
      })))), $("<div/>", {
        "class": "lb-dataContainer"
      }).append($("<div/>", {
        "class": "lb-data"
      }).append($("<h4/>", {
        "class": "lb-caption"
      }), $("<p/>", {
        "class": "lb-description"
      }), $("<p/>", {
        "class": "close"
      }).text("Close"), $("<p/>", {
        "class": "lb-number"
      }))))).appendTo($("body"));
      $("#lightboxOverlay").hide().on("click", function(e) {
        _this.end();
        return false;
      });
      $lightbox = $("#lightbox");
      $lightbox.hide().on("click", function(e) {
        if ($(e.target).attr("id") === "lightbox") {
          _this.end();
        }
        return false;
      });
      $lightbox.find(".lb-outerContainer").on("click", function(e) {
        if ($(e.target).attr("id") === "lightbox") {
          _this.end();
        }
        return false;
      });
      $lightbox.find(".lb-prev").on("click", function(e) {
        _this.changeImage(_this.currentImageIndex - 1);
        return false;
      });
      $lightbox.find(".lb-next").on("click", function(e) {
        _this.changeImage(_this.currentImageIndex + 1);
        return false;
      });
      $lightbox.find(".lb-loader, .close").on("click", function(e) {
        _this.end();
        return false;
      });
      $lightbox.find(".lb-caption").on("click", "a", function(e) {
        if (_this.album[_this.currentImageIndex].titleLink[0] === "#") {
          _this.end();
          window.location.hash = "";
          window.location.hash = _this.album[_this.currentImageIndex].titleLink;
        } else {
          window.open(_this.album[_this.currentImageIndex].titleLink);
        }
        return false;
      });
    };

    Lightbox.prototype.start = function($link) {
      var $lightbox, $window, a, current, i, imageNumber, left, top, _i, _len, _ref;
      if (!$link.attr("href") && !$link.attr("data-target")) {
        return;
      }
      $(window).on("resize", this.sizeOverlay);
      $("select, object, embed").css({
        visibility: "hidden"
      });
      $("#lightboxOverlay").width($(document).width()).height($(document).height()).fadeIn(this.options.fadeDuration);
      this.album = [];
      imageNumber = 0;
      current = 0;
      if ($link.parents(".thumbnails").attr("data-toggle") === "lightbox" && $link.parents(".thumbnails").find(".thumbnail").length) {
        _ref = $link.parents(".thumbnails").find(".thumbnail");
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          a = _ref[i];
          if (!$(a).attr("href") && !$(a).attr("data-target")) {
            continue;
          }
          this.album.push({
            link: $(a).attr("href") || $(a).attr("data-target"),
            title: $(a).attr("title") || $(a).attr("data-title"),
            titleLink: $(a).attr("data-title-link"),
            description: $(a).attr("data-description")
          });
          if ($link.attr("href") && $(a).attr("href") === $link.attr("href") || $link.attr("data-target") && $(a).attr("data-target") === $link.attr("data-target")) {
            imageNumber = current;
          }
          ++current;
        }
      } else {
        this.album.push({
          link: $link.attr("href") || $link.attr("data-target"),
          title: $link.attr("title") || $link.attr("data-title"),
          titleLink: $(a).attr("data-title-link"),
          description: $link.attr("data-description")
        });
      }
      $window = $(window);
      top = $window.scrollTop() + $window.height() / 10;
      left = $window.scrollLeft();
      $lightbox = $("#lightbox");
      $lightbox.css({
        top: top + "px",
        left: left + "px"
      }).fadeIn(this.options.fadeDuration);
      this.changeImage(imageNumber);
    };

    Lightbox.prototype.changeImage = function(imageNumber) {
      var $image, $lightbox, preloader,
        _this = this;
      this.disableKeyboardNav();
      $lightbox = $("#lightbox");
      $image = $lightbox.find(".lb-image");
      this.sizeOverlay();
      $("#lightboxOverlay").fadeIn(this.options.fadeDuration);
      $(".lb-loader").fadeIn("slow");
      $lightbox.find(".lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption, .lb-description").hide();
      $lightbox.find(".lb-outerContainer").addClass("animating");
      preloader = new Image;
      preloader.onload = function() {
        $image.attr("src", _this.album[imageNumber].link);
        $image.width = preloader.width;
        $image.height = preloader.height;
        return _this.sizeContainer(preloader.width, preloader.height);
      };
      preloader.src = this.album[imageNumber].link;
      this.currentImageIndex = imageNumber;
    };

    Lightbox.prototype.setTitle = function($title, $titleLink) {
      if (typeof $titleLink !== "undefined" && $titleLink !== "") {
        $title = $("<a/>").attr({
          "href": $titleLink,
          "title": $title
        }).text($title);
      }
      return $title;
    };

    Lightbox.prototype.sizeOverlay = function() {
      return $("#lightboxOverlay").width($(document).width()).height($(document).height());
    };

    Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
      var $container, $lightbox, $outerContainer, containerBottomPadding, containerLeftPadding, containerRightPadding, containerTopPadding, newHeight, newWidth, oldWidth,
        _this = this;
      $lightbox = $("#lightbox");
      $outerContainer = $lightbox.find(".lb-outerContainer");
      oldWidth = $outerContainer.outerWidth();
      $container = $lightbox.find(".lb-container");
      containerTopPadding = parseInt($container.css("padding-top"), 10);
      containerRightPadding = parseInt($container.css("padding-right"), 10);
      containerBottomPadding = parseInt($container.css("padding-bottom"), 10);
      containerLeftPadding = parseInt($container.css("padding-left"), 10);
      newWidth = imageWidth + containerLeftPadding + containerRightPadding;
      newHeight = imageHeight + containerTopPadding + containerBottomPadding;
      if (newWidth !== oldWidth) {
        $outerContainer.animate({
          width: newWidth
        }, this.options.resizeDuration, "swing");
      }
      setTimeout(function() {
        $lightbox.find(".lb-prevLink").height(newHeight);
        $lightbox.find(".lb-nextLink").height(newHeight);
        _this.showImage();
      }, this.options.resizeDuration);
    };

    Lightbox.prototype.showImage = function() {
      var $lightbox;
      $lightbox = $("#lightbox");
      $lightbox.find(".lb-loader").hide();
      $lightbox.find(".lb-image").fadeIn("slow");
      this.updateNav();
      this.updateDetails();
      this.preloadNeighboringImages();
      this.enableKeyboardNav();
    };

    Lightbox.prototype.updateNav = function() {
      var $lightbox;
      $lightbox = $("#lightbox");
      $lightbox.find(".lb-nav").show();
      if (this.currentImageIndex > 0) {
        $lightbox.find(".lb-prev").show();
      }
      if (this.currentImageIndex < this.album.length - 1) {
        $lightbox.find(".lb-next").show();
      }
    };

    Lightbox.prototype.updateDetails = function() {
      var $lightbox,
        _this = this;
      $lightbox = $("#lightbox");
      if (typeof this.album[this.currentImageIndex].title !== "undefined" && this.album[this.currentImageIndex].title !== "") {
        $lightbox.find("h4").html(this.setTitle(this.album[this.currentImageIndex].title, this.album[this.currentImageIndex].titleLink)).fadeIn("fast");
      }
      if (typeof this.album[this.currentImageIndex].description !== "undefined" && this.album[this.currentImageIndex].description !== "") {
        $lightbox.find(".lb-description").html(this.album[this.currentImageIndex].description).fadeIn("fast");
      }
      if (this.album.length > 1) {
        $lightbox.find(".lb-number").html(this.options.labelImage + " " + (this.currentImageIndex + 1) + " " + this.options.labelOf + "  " + this.album.length).fadeIn("fast");
      } else {
        $lightbox.find(".lb-number").hide();
      }
      $lightbox.find(".lb-outerContainer").removeClass("animating");
      $lightbox.find(".lb-dataContainer").fadeIn(this.resizeDuration, function() {
        return _this.sizeOverlay();
      });
    };

    Lightbox.prototype.preloadNeighboringImages = function() {
      var preloadNext, preloadPrev;
      if (this.album.length > this.currentImageIndex + 1) {
        preloadNext = new Image;
        preloadNext.src = this.album[this.currentImageIndex + 1].link;
      }
      if (this.currentImageIndex > 0) {
        preloadPrev = new Image;
        preloadPrev.src = this.album[this.currentImageIndex - 1].link;
      }
    };

    Lightbox.prototype.enableKeyboardNav = function() {
      $(document).on("keyup.keyboard", $.proxy(this.keyboardAction, this));
    };

    Lightbox.prototype.disableKeyboardNav = function() {
      $(document).off(".keyboard");
    };

    Lightbox.prototype.keyboardAction = function(event) {
      var KEYCODE_ESC, KEYCODE_LEFTARROW, KEYCODE_RIGHTARROW, key, keycode;
      KEYCODE_ESC = 27;
      KEYCODE_LEFTARROW = 37;
      KEYCODE_RIGHTARROW = 39;
      keycode = event.keyCode;
      key = String.fromCharCode(keycode).toLowerCase();
      if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
        this.end();
      } else if (key === "p" || keycode === KEYCODE_LEFTARROW) {
        if (this.currentImageIndex !== 0) {
          this.changeImage(this.currentImageIndex - 1);
        }
      } else if (key === "n" || keycode === KEYCODE_RIGHTARROW) {
        if (this.currentImageIndex !== this.album.length - 1) {
          this.changeImage(this.currentImageIndex + 1);
        }
      }
    };

    Lightbox.prototype.end = function() {
      this.disableKeyboardNav();
      $(window).off("resize", this.sizeOverlay);
      $("#lightbox").fadeOut(this.options.fadeDuration);
      $("#lightboxOverlay").fadeOut(this.options.fadeDuration);
      return $("select, object, embed").css({
        visibility: "visible"
      });
    };

    return Lightbox;

  })();

  $(function() {
    var lightbox, options;
    options = new LightboxOptions;
    return lightbox = new Lightbox(options);
  });

}).call(this);
