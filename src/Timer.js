/**
 * Created by malloyzhu on 2015/6/16.
 */

/**
 * 定时器
 * @type {Function}
 */
var Timer = cc.Class.extend({
    ctor: function () {
        this._bRunning = false;
        this._duration = 0;      //间隔
        this._elapse = 0;        //当前消耗的时间
        this._timeUpFunc = null; //回调函数
    },

    /**
     * 设置回调函数
     * @param func
     */
    setTimeUp: function (func) {
        this._timeUpFunc = func;
    },

    /**
     * 设置间隔
     * @param duration
     */
    setDuration: function (duration) {
        this._duration = duration;
    },

    getDuration: function () {
        return this._duration;
    },

    /**
     * 设置消耗的时间
     * @param elapse
     */
    setElapse: function (elapse) {
        this._elapse = elapse;
    },

    getElapse: function () {
        return this._elapse;
    },

    /**
     * 外部调用
     * @param dt
     */
    update: function (dt) {
        if (!this._bRunning) {
            return;
        }

        this._elapse += dt;
        if (this._elapse >= this._duration) {
            this._elapse = 0;
            if (null != this._timeUpFunc) {
                this._timeUpFunc();
            }
        }
    },

    pause: function () {
        this._bRunning = false;
    },

    resume: function () {
        this._bRunning = true;
    },

    start: function () {
        this._bRunning = true;
    },

    isRunning: function () {
        return this._bRunning;
    }
});


/**
 * 倒计时器
 * @type {Function}
 */
var CountDownTimer = cc.Class.extend({
    _secondTimer: null,//秒表
    _secondTimeCallBack: null,//秒回调
    _countTimeCallBack: null,//总时间倒计时完成的回调
    _currentCountTime: 0,//总时间
    _originalCountTime: 0,//原始总时间

    ctor: function (secondTimerDuration) {
        secondTimerDuration = secondTimerDuration || 1;//默认为1秒
        this._secondTimer = new Timer();
        this._secondTimer.setDuration(secondTimerDuration);
        this._secondTimer.setTimeUp(Util.handler(this._onSecondTimeElapse, this));
    },

    /**
     * 设置秒表间隔
     * @param secondTimerDuration
     */
    setSecondTimerDuration: function (secondTimerDuration) {
        this._secondTimer.setDuration(secondTimerDuration);
    },

    _onSecondTimeElapse: function () {
        var secondTimerDurationTime = this._secondTimer.getDuration();
        //减掉消耗的秒数
        this._currentCountTime -= secondTimerDurationTime;
        if (this._currentCountTime <= 0) {//当前时间为0
            this._currentCountTime = 0;
            this._secondTimer.pause();
            this._countTimeCallBack();
        }

        this._secondTimeCallBack(this._currentCountTime);
    },

    isRunning: function () {
        this._secondTimer.isRunning();
    },

    pause: function () {
        this._secondTimer.pause();
    },

    resume: function () {
        this._secondTimer.resume();
    },

    start: function () {
        this._secondTimer.start();
    },

    update: function (dt) {
        this._secondTimer.update(dt);
    },

    reset: function () {
        this._secondTimer.setElapse(0);
        this._secondTimer.resume();
    },

    /**
     * 设置总时间
     * @param countTime
     */
    setCountTime: function (countTime) {
        this._currentCountTime = countTime;
        this._originalCountTime = countTime;
    },

    getCurrentCountTime: function () {
        return this._currentCountTime;
    },

    getOriginalCountTime: function () {
        return this._originalCountTime;
    },

    /**
     * 秒回调函数
     * @param func
     */
    setSecondTimeCallBack: function (func) {
        this._secondTimeCallBack = func;
    },

    /**
     * 时间为0时的回调函数
     * @param func
     */
    setCountTimeCallBack: function (func) {
        this._countTimeCallBack = func;
    }
});

/**
 * 计时器
 * @type {Function}
 */
var CalcTimer = cc.Class.extend({
    _secondTimer: null,//秒表
    _minuteTimer: null,//分钟表
    _secondTimeCallBack: null,//秒回调
    _minuteTimeCallBack: null,//分钟回调
    _currentTime: 0,//当前时间

    ctor: function (secondTimerDuration, minuteTimerDuration) {
        secondTimerDuration = secondTimerDuration || 1;//默认为1秒
        this._secondTimer = new Timer();
        this._secondTimer.setDuration(secondTimerDuration);
        this._secondTimer.setTimeUp(Util.handler(this._onSecondTimeElapse, this));

        minuteTimerDuration = minuteTimerDuration || 1;
        minuteTimerDuration = minuteTimerDuration * 60;//默认为60秒
        this._minuteTimer = new Timer();
        this._minuteTimer.setDuration(minuteTimerDuration);
        this._minuteTimer.setTimeUp(Util.handler(this._onMinuteTimeElapse, this));
    },

    setSecondTimerDuration: function (duration) {
        this._secondTimer.setDuration(duration);
    },

    setMinuteTimerDuration: function (duration) {
        duration *= 60;
        this._minuteTimer.setDuration(duration);
    },

    _onSecondTimeElapse: function () {
        var secondTimerDurationTime = this._secondTimer.getDuration();
        this._currentTime += secondTimerDurationTime;
        this._secondTimeCallBack(this._currentTime);
    },

    _onMinuteTimeElapse: function () {
        this._minuteTimeCallBack();
    },

    update: function (dt) {
        this._secondTimer.update(dt);
        this._minuteTimer.update(dt);
    },

    pause: function () {
        this._secondTimer.pause();
        this._minuteTimer.pause();
    },

    start: function () {
        this._secondTimer.start();
        this._minuteTimer.start();
    },

    resume: function () {
        this._secondTimer.resume();
        this._minuteTimer.resume();
    },

    reset: function () {
        this._secondTimer.setElapse(0);
        this._secondTimer.resume();

        this._minuteTimer.setElapse(0);
        this._minuteTimer.resume();

        this._currentTime = 0;
    },

    setCurrentTime: function (currentTime) {
        this._currentTime = currentTime;
    },

    setSecondTimeCallBack: function (func) {
        this._secondTimeCallBack = func;
    },

    setMinuteTimeCallBack: function (func) {
        this._minuteTimeCallBack = func;
    },

    setMinuteTimerElapse: function (elapse) {
        this._minuteTimer.setElapse(elapse);
    }
});

/**
 * 定量计时器
 */
var QuantumTimer = cc.Class.extend({
    _startTime: null,
    _endTime: null,
    _currentTime: null,
    _secondTimer: null,
    _coefficient: -1,//系数
    _secondTimeCallBack: null,
    _endTimeCallBack: null,

    ctor: function (secondTimerDuration) {
        secondTimerDuration = secondTimerDuration || 1;
        this._secondTimer = new Timer();
        this._secondTimer.setDuration(secondTimerDuration);
        this._secondTimer.setTimeUp(Util.handler(this._onSecondTimeElapse, this));
    },

    setSecondTimerDuration: function (secondTimerDuration) {
        this._secondTimer.setDuration(secondTimerDuration);
    },

    _onSecondTimeElapse: function () {
        var secondTimerDurationTime = this._secondTimer.getDuration();
        this._currentTime = this._currentTime + (secondTimerDurationTime * this._coefficient);

        if (this._coefficient == -1) {
            if (this._currentTime <= this._endTime) {
                this._callEndTimeCallBack();
            }
        } else {
            if (this._currentTime >= this._endTime) {
                this._callEndTimeCallBack();
            }
        }

        this._secondTimeCallBack(this._currentTime);
    },

    /**
     * 到达结束时间时调用
     * @private
     */
    _callEndTimeCallBack: function () {
        this._currentTime = this._endTime;
        this._secondTimer.pause();
        this._endTimeCallBack();
    },

    update: function (dt) {
        this._secondTimer.update(dt);
    },

    pause: function () {
        this._secondTimer.pause();
    },

    resume: function () {
        this._secondTimer.resume();
    },

    start: function () {
        this._secondTimer.start();
    },

    isRunning: function () {
        return this._secondTimer.isRunning();
    },

    reset: function () {
        this._secondTimer.setElapse(0);
    },

    setTimeData: function (startTime, endTime) {
        this._startTime = startTime;
        this._endTime = endTime;
        this._currentTime = this._startTime;
        this._coefficient = (this._startTime > this._endTime ? -1 : 1);
    },

    getCurrentTime: function () {
        return this._currentTime;
    },

    setSecondTimeCallBack: function (func) {
        this._secondTimeCallBack = func;
    },

    setEndTimeCallBack: function (func) {
        this._endTimeCallBack = func;
    }
});
