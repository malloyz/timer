/**
 * Created by malloyzhu on 2015/9/14.
 */

var LoadingBarEx = ccui.LoadingBar.extend({
    _bPercentChangedAction: false,
    _timer: null,//定时器
    _percentActionTime: 1,//从 0 到 100% 所用的时间
    _onePercentActionTime: null,//一个百分比的时间
    _percentChangedFinishCallBack: null,

    ctor: function (loadingBar) {
        this._super();
        this._initData();
        this._initView(loadingBar);
        this._initTimer();
    },

    _initData: function () {
        this._updateOnePercentActionTime();
    },

    _updateOnePercentActionTime: function () {
        this._onePercentActionTime = this._percentActionTime / 100;
    },

    _initTimer: function () {
        this._timer = new QuantumTimer();
        this._timer.setSecondTimeCallBack(Util.handler(this._onSecondTimeElapse, this));
        this._timer.setEndTimeCallBack(Util.handler(this._onReachEndTime, this));
        this._timer.setSecondTimerDuration(this._onePercentActionTime);
    },

    _onSecondTimeElapse: function (currentTime) {
        var percent = currentTime * 100 / this._percentActionTime;
        this.setPercent(percent);
    },

    /**
     * 到达结束时间
     * @private
     */
    _onReachEndTime: function () {
        this._timer.pause();
        if (null != this._percentChangedFinishCallBack) {
            this._percentChangedFinishCallBack(this);
        }
    },

    _configTimer: function (targetPercent) {
        var currentPercent = this.getPercent();
        var startTime = currentPercent * this._onePercentActionTime;
        var endTime = targetPercent * this._onePercentActionTime;
        this._timer.setTimeData(startTime, endTime);
    },

    _initView: function (loadingBar) {
        UIHelper.copyProperties(this, loadingBar);
        loadingBar.getParent().addChild(this);
        loadingBar.removeFromParent();
    },

    setPercentWithAction: function (percent) {
        if (percent == this.getPercent()) {
            return;
        }

        if (percent < 0) {
            percent = 0;
        }

        if (percent > 100) {
            percent = 100;
        }

        if (this._bPercentChangedAction) {
            this._handlePercentChangedAction(percent);
        } else {
            this.setPercent(percent);
        }
    },

    _handlePercentChangedAction: function (percent) {
        if (this._timer.isRunning()) {
            this._timer.pause();
        }

        this._timer.reset();
        this._configTimer(percent);
        this._timer.start();
    },

    setPercentActionTime: function (percentActionTime) {
        this._percentActionTime = (percentActionTime <= 0 ? this._percentActionTime : percentActionTime);
        this._updateOnePercentActionTime();
        this._timer.setSecondTimerDuration(this._onePercentActionTime);
    },

    setPercentChangedAction: function (bAction) {
        this._bPercentChangedAction = bAction;
        if (bAction) {
            this.scheduleUpdate();
        } else {
            this.unscheduleUpdate();
        }
    },

    setPercentChangedFinishCallBack: function (func) {
        this._percentChangedFinishCallBack = func;
    },

    isPercentChangedAction: function () {
        return this._bPercentChangedAction;
    },

    update: function (dt) {
        this._timer.update(dt);
    }
});
