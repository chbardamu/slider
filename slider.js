// Generated by CoffeeScript 1.12.2

/*

slider.coffee

An orbit-like slider, made primarily for the homepage of the Taxibeat Wordpress theme

*/

(function() {
  var root, slider;

  slider = {
    slides: null,
    period: 10,
    container: null,
    header: null,
    subHeader: null,
    currentIndex: 0,
    previousIndex: -1,
    timeout: -1,
    timer: 0,
    currentItem: {},
    loader: null,
    pager: null,
    debug: false,
    swipe: {
      start: {
        x: null,
        y: null
      },
      threshold: 50,
      fast: false
    },
    trace: function(message) {
      if (this.console) {
        return console.log("[home slider] " + message);
      }
    },
    touchStart: function(touchEvent) {
      var touch;
      touch = touchEvent.changedTouches[0];
      this.swipe.start.x = touch.pageX;
      this.swipe.start.y = touch.pageY;
      this.trace("touchstart triggered (" + touch.pageX + ", " + touch.pageY + ")");
    },
    touchMove: function(touchEvent) {
      touchEvent.preventDefault();
    },
    touchEnd: function(touchEvent) {
      var touch;
      touch = touchEvent.changedTouches[0];
      this.resetCurrent();
      if (touch.pageX - this.swipe.start.x >= this.swipe.threshold) {
        this.showPrevious();
        this.trace("touchend triggered (Previous Slide)");
      } else if ((touch.pageX - this.swipe.start.x) <= (-1 * this.swipe.threshold)) {
        this.showNext();
        this.trace("touchend triggered (Next Slide)");
      }
    },
    setup: function(config) {
      var self, slice;
      if (!config.pager) {
        throw "Pager is not set";
      }
      if (!config.header) {
        throw "Header is not set";
      }
      this.pager = config.pager;
      this.container = config.container;
      this.header = config.header;
      this.subHeader = config.subHeader;
      if (!this.container.tagName.match(/UL|OL/)) {
        if (this.container.children[0].tagName.match(/UL|OL/)) {
          this.container = this.container.children[0];
        } else {
          throw "Slide list cannot be found.";
        }
      }
      this.slides = this.container.children;
      slice = Array.prototype.slice.call(this.slides, 0);
      self = this;
      slice.forEach((function(_this) {
        return function(slide, index) {
          if (index > 0) {
            slide.classList.add("off");
          }
          if (self.swipe.fast) {
            slide.classList.add("fast");
          }
          slide.addEventListener("touchstart", self.touchStart.bind(self), false);
          slide.addEventListener("touchmove", self.touchMove.bind(self), false);
          return slide.addEventListener("touchend", self.touchEnd.bind(self), false);
        };
      })(this));
      this.updateSlide();
      return this;
    },
    updateSlide: function() {
      var currentSlide, imageURL, prevSlide, self;
      imageURL = this.slides[this.currentIndex].getAttribute("data-url");
      prevSlide = this.container.querySelector(":nth-child(" + (this.previousIndex + 1) + ")");
      currentSlide = this.container.querySelector(":nth-child(" + (this.currentIndex + 1) + ")");
      this.trace("previous slide: " + (this.previousIndex + 1) + " -> " + "current slide: " + (this.currentIndex + 1));
      currentSlide.style.backgroundImage = "url('" + imageURL + "')";
      if (prevSlide) {
        prevSlide.className = "off" + (this.swipe.fast ? " fast" : "");
      }
      currentSlide.classList.add("on");
      self = this;
      setTimeout(function() {
        self.header.innerHTML = self.slides[self.currentIndex].getAttribute("data-header");
        if (self.subHeader) {
          self.subHeader.innerHTML = self.slides[self.currentIndex].getAttribute("data-sub-header");
        }
      }, 750);
    },
    showPrevious: function() {
      this.previousIndex = this.currentIndex;
      this.currentIndex -= 1;
      if (this.currentIndex < 0) {
        this.currentIndex = this.slides.length - 1;
        this.previousIndex = 0;
      }
      this.updateSlide();
      return this;
    },
    showNext: function() {
      this.previousIndex = this.currentIndex;
      this.currentIndex += 1;
      if (this.currentIndex >= this.slides.length) {
        this.currentIndex = 0;
        this.previousIndex = this.slides.length - 1;
      }
      this.updateSlide();
      return this;
    },
    resetCurrent: function() {
      this.timer = 0;
      this.currentItem.classList.remove("loading");
      this.currentItem.querySelector("a").className = "";
      this.currentItem.removeChild(this.loader);
      this.loader = null;
    },
    change: function() {
      var _22;
      this.timer += 1;
      this.trace(this.timer + "s");
      try {
        this.getCurrentLoader();
        if (this.timer > this.period) {
          this.showNext();
          this.resetCurrent();
        }
      } catch (error) {
        _22 = error;
        console.error(_22);
      }
      return this.loop();
    },
    getCurrentLoader: function() {
      var self;
      this.currentItem = this.pager.querySelector(":nth-child(" + (this.currentIndex + 1) + ")");
      if (!this.currentItem.className.match("loading")) {
        this.trace("slide " + (this.currentIndex + 1));
        this.currentItem.classList.add("loading");
        this.currentItem.querySelector("a").className = "current";
        this.loader = document.createElement("span");
        this.loader.setAttribute("class", "loader");
        this.currentItem.appendChild(this.loader);
        self = this;
        setTimeout(function() {
          return self.loader.classList.add("filling");
        }, 50);
      }
      return this.loader;
    },
    loop: function() {
      var self;
      self = this;
      return this.timeout = setTimeout(function() {
        return self.change.call(self);
      }, 1000);
    },
    start: function() {
      return this.loop();
    },
    stop: function() {
      return clearTimeout(this.timeout);
    }
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.slider = slider;

}).call(this);
