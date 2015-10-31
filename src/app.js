
var HelloWorldLayer = cc.Layer.extend({
    _timerCallBackCount: 0,
    _timer: null,
    _countDownTimer: null,
    _calcTimer: null,
    _actionLoadingBar: null,

    ctor:function () {
        this._super();

        var rootNode = UIHelper.bindUIWidget(this, res.test_json);
        this.addChild(rootNode);

        this._actionLoadingBar = new LoadingBarEx(this._quantumLoadingBar);
        this._actionLoadingBar.setPercentActionTime(1);//0到100的时间
        this._actionLoadingBar.setPercentChangedAction(true);

        this._timer = new Timer();
        this._timer.setDuration(2);//2秒回调一次
        this._timer.setTimeUp(Util.handler(this._onTimer, this));

        this._countDownTimer = new CountDownTimer();
        this._countDownTimer.setCountTime(60);//60秒
        this._countDownTimer.setSecondTimerDuration(1);//一秒回调一次
        this._countDownTimer.setSecondTimeCallBack(Util.handler(this._onCountDownTimerSecond, this));
        this._countDownTimer.setCountTimeCallBack(Util.handler(this._onCountDownTimerEnd, this));

        this._calcTimer = new CalcTimer();
        this._calcTimer.setSecondTimerDuration(1);//1秒回调一次
        this._calcTimer.setMinuteTimerDuration(1);//1分钟回调一次
        this._calcTimer.setSecondTimeCallBack(Util.handler(this._onCalcTimerSecond, this));
        this._calcTimer.setMinuteTimeCallBack(Util.handler(this._onCalcTimerMinute, this));

        this.scheduleUpdate();
        return true;
    },

    update: function (dt) {
        this._timer.update(dt);
        this._countDownTimer.update(dt);
        this._calcTimer.update(dt);
    },

    _onTimer: function () {
        this._timerCallBackCount++;
        this._timerCallBackCountText.setString(this._timerCallBackCount);
    },

    _onCountDownTimerSecond: function (time) {
        time = Util.formatTime(time);
        this._countDownTimeText.setString(time);
    },

    _onCountDownTimerEnd: function () {
        console.log("倒计器结束");
    },

    _onCalcTimerSecond: function (time) {
        time = Util.formatTime(time);
        this._calcTimeText.setString(time);
    },

    _onCalcTimerMinute: function () {
        console.log("一分钟过去啦");
    },

    _onResetButtonTouched: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            this._timer.pause();
            this._countDownTimer.pause();
            this._calcTimer.pause();

            this._timerCallBackCount = 0;
            this._timerCallBackCountText.setString("0");
            this._countDownTimeText.setString("00:00:00");
            this._calcTimeText.setString("00:00:00");
            this._actionLoadingBar.setPercent(0);
        }
    },

    _onStartButtonTouched: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            this._timer.start();
            this._countDownTimer.start();
            this._calcTimer.start();

            this._actionLoadingBar.setPercentWithAction(100);
        }
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

