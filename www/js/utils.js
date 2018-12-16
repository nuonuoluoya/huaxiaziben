var utils = (function(){
  function listToArray(likeArray) {
      if (!/MSIE (6|7|8)/.test(navigator.userAgent)) {
        return Array.prototype.slice.call(likeArray, 0);
      }
      var arr = [];
      for (var i=0;i<likeArray.length;i++) {
        arr[arr.length] = likeArray[i];
      }
      return arr;
  }

  function children(curEle, tagName) {
    var arr = [];
    if (/MSIE (6|7|8)/.test(navigator.userAgent)) {
      var nodeList = curEle.childNodes;
      for (var i=0;i<nodeList.length;i++) {
        var curNode = nodeList[i];
        curNode.notype===1 ? arr[arr.length]=curNode : null;
      }
      nodeList = null;
    } else {
      arr = this.listToArray(curEle.children);
    }
    if (typeof tagName==='string') {
      for (var k=0;k<arr.length;k++) {
        var curEleNode = arr[k];
        if (curEleNode.nodeName.toLowerCase()!==tagName.toLowerCase()) {
          arr.splice(k, 1);
          k--;
        }
      }
    }
    return arr;
  }

  function firstChild(curEle) {
    var chs = this.children(curEle);
    return chs.length>0 ? chs[0] : null;
  }

  function prev(curEle) {
    if (!/MSIE (6|7|8)/.test(navigator.userAgent)) {
      return curEle.previousElementSibling;
    }
    var pre = curEle.previousSibling;
    while (pre&&pre.nodeType!==1) {
      pre = pre.previousSibling;
    }
    return pre;
  }

  function next(curEle) {
    if (/MSIE (6|7|8)/.test(navigator.userAgent)) {
      return curEle.nextElementSibling;
    }
    var nex = curEle.nextSibling;
    while (nex&&nex.nodeType!==1) {
      nex = nex.nextSibling;
    }
    return nex;
  }

  function prevAll(curEle) {
    var arr = [];
    var pre = prev(curEle);
    while (pre) {
      arr.unshift(pre);
      pre = prev(pre);
    }
    return arr;
  }

  function nextAll(curEle) {
    var ary = [];
    var nex = next(curEle);
    while (nex) {
        ary.push(nex);
        nex = next(nex);
    }
    return ary;
  }

  function sibling(curEle) {
    var arr = [];
    var pre = prev(curEle);
    var nex = next(curEle);
    pre ? arr.push(pre) : null;
    nex ? arr.push(nex) : null;
    return arr;
  }

  function siblings(curEle) {
      return prevAll(curEle).concat(nextAll(curEle));
  }

  function getCss(attr) {
    var val = null, reg = null;
    if ('getComputedStyle' in window) {
      val = window.getComputedStyle(this, null)[attr];
    } else {
      if (attr==='opacity') {
        val = this.currentStyle['filter'];
        reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
        val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
      } else {
        val = this.currentStyle[attr];
      }
    }
    reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)$/;
    return reg.test(val) ? parseFloat(val) : val;
  }

  function setCss(attr, value) {
    if (attr==='float') {
      this['style']['cssFloat'] = value;
      this['style']['styleFloat'] = value;
      return;
    }
    if (attr==='opacity') {
      this['style']['opacity'] = value;
      this['style']['filter'] = 'alpha(opacity' + value * 1000 + ')';
      return;
    }
    var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
    if (reg.test(attr)) {
      if (!isNaN(val)) {
        value += 'px';
      }
    }
    this['style'][attr] = value;
  }

  function setGroupCss(options) {
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        setCss.call(this, key, options[key]);
      }
    }
  }

  function css(curEle) {
    var argTwo = arguments[1], arr = Array.prototype.slice.call(arguments, 1);
    if (typeof argTwo==='string') {
      if (typeof arguments[2]==='undefined') {
        return getCss.apply(curEle, arr);
      }
      setCss.apply(curEle, arr);
    }
    argTwo = argTwo || 0;
    if (argTwo.toString()==='[object Object]') {
      setGroupCss.apply(curEle, arr);
    }
  }

  return {
    listToArray: listToArray,
    sibling: sibling,
    siblings: siblings,
    children: children,
    firstChild: firstChild,
    css: css
  }
})();
