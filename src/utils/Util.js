/**
 * Created by malloy on 2015/5/19.
 */

TimeFormatType = {hms: "hh:mm:ss", ms: "mm:ss"};

var Util = {
    /**
     * Format a number of seconds to hh:mm:ss
     *
     * @param time {integer} in seconds
     * @returns {string}
     */
    formatTime: function (time, timeFormatType) {
        var h = Math.floor(time / 3600);
        var m = Math.floor((time % 3600) / 60);
        var s = time % 60;

        timeFormatType = timeFormatType || TimeFormatType.hms;
        var result = "";
        if (timeFormatType == TimeFormatType.hms) {
            result = ( h < 10 ? ("0" + h) : h ) + ":" + ( m < 10 ? ("0" + m) : m ) + ":" + ( s < 10 ? ("0" + s) : s );
        } else if (timeFormatType == TimeFormatType.ms) {
            result = ( m < 10 ? ("0" + m) : m ) + ":" + ( s < 10 ? ("0" + s) : s );
        }
        return result;
    },

    /**
     * 回调函数处理
     * @param callback：回调函数
     * @param caller：函数调用对象
     * @returns {Function}
     *
     * eg:
     * var One = cc.Class.extend({
     *      setNextFunc:function(func) {
     *          this._nextFunc = func;
     *      },
     *
     *      _onNextBtnClicked:function(sender, type) {
     *          this._nextFunc();
     *          //如果有参数则直接传参数，如this._nextFunc("test1", xxx, yyy);
     *      }
     * });
     *
     * var Two = cc.Class.extend({
     *      ctor:function() {
     *          this._oneClass = new One();
     *          this._oneClass.setNextFunc(Util.handler(this._oneClassNextFunc, this));
     *      },
     *
     *      _oneClassNextFunc:function() {
     *
     *      }
     * })
     */
    handler: function (callback, caller) {
        return function () {
            callback.apply(caller, arguments);
        }
    },

    isBlankString: function (str) {
        return (!str || /^\s*$/.test(str));
    },

    endsWithString: function (str, suffix) {
        if (!Util.isBlankString(str)) {
            return str.match(suffix + "$") == suffix;
        } else {
            return false;
        }
    },

    startsWithString: function (str, prefix) {
        if (!Util.isBlankString(str)) {
            return str.indexOf(prefix) === 0;
        } else {
            return false;
        }
    },

    /**
     * 将第一个字母转换成大写
     */
    upperFirstLetter: function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    },

    clone: function (obj) {
        var newObj = (obj.constructor) ? new obj.constructor : {};
        for (var k in obj) {
            var copy = obj[k];
            if (((typeof copy) === "object") && copy && !(copy instanceof cc.Node)) {
                newObj[k] = Util.clone(copy);
            } else {
                newObj[k] = copy;
            }
        }
        return newObj;
    },

    isArray: function (object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    },

    isObject: function (object) {
        return ((typeof object) === "object");
    }
};
