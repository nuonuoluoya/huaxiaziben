//http://tool.css-js.com: js代码压缩网址，Uglify压缩以后，js文件多了一个名为min的后缀
~function () {

    var effectSport = {
        //匀速
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        //指数衰减的反弹缓动
        Bounce: {
            easeIn: function (t, b, c, d) {
                return c - zhufengEffect.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function (t, b, c, d) {
                if (t < d / 2) {
                    return zhufengEffect.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                }
                return zhufengEffect.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        },
        //二次方的缓动
        Quad: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        //三次方的缓动
        Cubic: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        //四次方的缓动
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        //五次方的缓动
        Quint: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        //正弦曲线的缓动
        Sine: {
            easeIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        //指数曲线的缓动
        Expo: {
            easeIn: function (t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        //圆形曲线的缓动
        Circ: {
            easeIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        //超过范围的三次方缓动
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) {
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        //指数衰减的正弦曲线缓动
        Elastic: {
            easeIn: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (!p) p = d * (.3 * 1.5);
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        }
    };

    //move: 实现多方向的运动动画
    //curELe: 当前要运动的元素
    //target: 当前动画将要运动到的地方,存储的是每一个方向的位置，该参数是一个对象{left:xxx,top:xxx}
    //duration: 运动总时间

    //effect支持以下情况:
    //1) 如果传递进来的是一个数字:
        //0-->Linear
        //1-->Circ.easeInOut
        //2-->Elastic.easeOut
        //3-->Back.easeOut
        //4-->Bounce.easeOut
        //5-->Expo.easeIn
    //2) 如果传递进来的是一个数组: move(curEle, target, duration, ["Elastic","easeOut"])-->effectSport.Elastic.easeOut
    //3) 如果不传递的话，默认使用effectSport.Linear

    function move(curEle, target, duration, effect, callback) {
        //处理动画效果
        var tempEffect = effectSport.Linear;
        if (typeof effect === "number") {
            switch(effect) {
                case 0:
                    tempEffect = effectSport.Linear;
                    break;
                case 1:
                    tempEffect = effectSport.Circ.easeInOut;
                    break;
                case 2:
                    tempEffect = effectSport.Elastic.easeOut;
                    break;
                case 3:
                    tempEffect = effectSport.Back.easeOut;
                    break;
                case 4:
                    tempEffect = effectSport.Bounce.easeOut;
                    break;
                case 5:
                    tempEffect = effectSport.Expo.easeIn;

            }
        } else if (effect instanceof Array) {
            tempEffect = effect.length>2?effectSport[effect[0]][effect[1]]:effectSport[effect[0]];
        } else if (typeof effect === "function") {
            //实际意义应该是: effect是不传递值的，传递进来的应该是回调函数的值，tempEffect还是默认的匀速公式即可
            callback = effect;
        }

        //在每一次执行方法之前，首先把当前元素之前正在运行的动画结束掉
        window.clearInterval(curEle.tweenTimer);

        //根据target获取每一个方向的起始值begin和总距离change
        var begin = {}, change = {};
        for (var key in target) {
            //key: target对象中的属性值，也就是运动方向，例如：top/left...
            if (target.hasOwnProperty(key)) {
                begin[key] = utils.css(curEle, key);
                change[key] = target[key] - begin[key];
            }
        }

        //实现多方向运动动画
        var time = 0;
        curEle.tweenTimer = window.setInterval(function() {
            time += 10;

            //到达目标，结束动画，让当前元素的样式等于目标样式值
            if (time >= duration) {
                utils.css(curEle, target);
                window.clearInterval(curEle.tweenTimer);
                //在动画结束的时候，如果传递回调函数，就执行它；不仅执行，还让回调函数中的this变为当前要操作的元素
                callback && callback.call(curEle);
                return;
            }

            //没到达目标: 分别获取每一个方向的当前位置，给当前元素设置样式即可
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    var curPos = tempEffect(time, begin[key], change[key], duration);
                    utils.css(curEle, key, curPos);
                }
            }
        }, 10)
    }

    window.tweenAnimation = move;

}();
