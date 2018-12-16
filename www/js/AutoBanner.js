!function(){
  function AutoBanner(curEleId, interval) {
    this.swipe = document.getElementById(curEleId);
    this.swipeInner = utils.firstChild(this.swipe);
    this.swipeLink = utils.children(this.swipe, 'a');
    this.swipeLeft = this.swipeLink[0];
    this.swipeRight = this.swipeLink[1];
    this.divList = this.swipeInner.getElementsByTagName('div');
    this.imgList = this.swipeInner.getElementsByTagName('img');
    this.interval = interval || 3000;
    this.autoTimer = null;
    this.step = 0;

    return this.init();
  }

  AutoBanner.prototype = {
    constructor: AutoBanner,

    lazyImg: function() {
      var _this = this;
      for (var i=0;i<this.imgList.length;i++) {
        !function(i) {
          var oImg = new Image;
          var curImg = _this.imgList[i];
          oImg.src = curImg.getAttribute('trueImg');
          oImg.onload = function() {
            curImg.src = this.src;
            curImg.style.display = 'block';
            if (i===0) {
              curImg.parentNode.style.zIndex = 1;
              tweenAnimation(curImg.parentNode, {opacity: 1}, 300);
            }
            oImg = null;
          }
        }(i);
      }
    },

    autoMove: function() {
      this.step++;
      this.step >= this.imgList.length ? this.step = 0 : null;
      this.setSwipe();
    },

    setSwipe: function() {
      for (var i=0;i<this.divList.length;i++) {
        if (i===this.step) {
          utils.css(this.divList[i], 'zIndex', 1);
          tweenAnimation(this.divList[i], {opacity: 1}, 200, function(){
            var curDivSib = utils.siblings(this);
            for (var k=0;k<curDivSib.length;k++) {
              utils.css(curDivSib[k], {opacity: 0});
            }
          });
          continue;
        }
        utils.css(this.divList[i], 'zIndex', 0);
      }
    },

    mouseControl: function() {
      var _this = this;
      this.swipe.onmouseover = function() {
        window.clearInterval(_this.autoTimer);
        _this.swipeLeft.style.display = _this.swipeRight.style.display = 'block';
      }
      this.swipe.onmouseout = function() {
        _this.autoTimer = window.setInterval(function(){
          _this.autoMove.call(_this);
        }, _this.interval);
        _this.swipeLeft.style.display = _this.swipeRight.style.display = 'none';
      }
    },

    tabSwipe: function() {
      var _this = this;
      this.swipeLeft.onclick = function() {
        _this.step--;
        _this.step < 0 ? _this.step = _this.imgList.length - 1 : null;
        _this.setSwipe();
      }
      this.swipeRight.onclick = function() {
        _this.autoMove();
      }
    },

    init: function() {
      var _this = this;
      window.setTimeout(function(){
        _this.lazyImg();
      }, 500)
      this.autoTimer = window.setInterval(function(){
        _this.autoMove();
      }, this.interval);
      this.mouseControl();
      this.tabSwipe();
      return this;
    }
  }
  window.AutoBanner = AutoBanner;
}();
