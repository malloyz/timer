/**
 * Created by malloyzhu on 2015/7/23.
 */

var UIHelper = {
    /**
     * 将 widgetCopy 的属性拷贝到 widget 中
     * @param widget：要拷贝的 widget
     * @param widgetCopy：被拷贝的 widget
     */
    copyProperties: function (widget, widgetCopy) {
        if (cc.sys.isNative) {
            //需绑定jsb接口
            widget.copyProperties(widgetCopy);
        } else {
            widget._copyProperties(widgetCopy);
        }
    },

    loadUI: function (filePath) {
        var rootJson = ccs.load(filePath);
        var rootNode = rootJson.node;
        return rootNode;
    },

    isNodeObject: function (object) {
        return (object instanceof cc.Node);
    },

    isUISliderObject: function (object) {
        return (object instanceof ccui.Slider);
    },

    isWidgetObject: function (object) {
        return (object instanceof ccui.Widget);
    },

    isUITextObject: function (object) {
        return (object instanceof ccui.Text);
    },

    isUITextFieldObject: function (object) {
        return (object instanceof ccui.TextField);
    },

    isUIButtonObject: function (object) {
        return (object instanceof ccui.Button);
    },

    isUIImageViewObject: function (object) {
        return (object instanceof ccui.ImageView);
    },

    isUIPanelObject: function (object) {
        return (object instanceof ccui.Layout);
    },

    isUIListViewObject: function (object) {
        return (object instanceof ccui.ListView);
    },

    isUIPageViewObject: function (object) {
        return (object instanceof ccui.PageView);
    },

    isUIScrollViewObject: function (object) {
        return (object instanceof ccui.ScrollView);
    },

    isUIScale9SpriteObject: function (object) {
        return (object instanceof ccui.Scale9Sprite);
    },

    isSpriteObject: function (object) {
        return (object instanceof cc.Sprite);
    },

    /**
     * 绑定 UI 控件
     * @param object：被绑定的对象
     * @param uiFilePath：ui 文件路径
     *
     * eg：ui 文件中的所有控件都绑定到 object 中，命名规则为 下划线 + 控件名字（控件名以下划线开头的才会被绑定到 object 上）
     * 如 ui 中有个名字为 _backBtn 的按钮，则通过 object._backBtn 可得到对应名字的对象
     * 注册事件：只需要在 object 中定义函数名，事件函数名命名规则为 下划线 + 控件名字 + Touched
     * 如有个名字为 _backBtn 的按钮要注册事件，如果在 object 中定义了 _onBackBtnTouched，
     * 则会将事件函数绑定到 _backBtn 上，如没有则不会绑定，绑定事件的控件有
     * Button, ListView, PageView, ScrollView 4种类型的控件，代码详见 bindUIWidgetTouchListener
     */
    bindUIWidget: function (object, uiFilePath) {
        var uiRoot = this.loadUI(uiFilePath);
        this.bindUIWidgetToObject(object, uiRoot);
        return uiRoot;
    },

    /**
     * 绑定 UI 控件
     * @param object：被绑定的对象
     * @param uiRoot：ui 根
     */
    bindUIWidgetToObject: function (object, uiRoot) {
        if (!Util.isObject(object)) {
            console.log("object is not object type");
            return;
        }

        if (!this.isNodeObject(uiRoot)) {
            console.log("uiRoot is not node type");
            return;
        }

        var uiWidgetChildren = uiRoot.getChildren();
        for (var i = 0; i < uiWidgetChildren.length; i++) {
            var uiWidget = uiWidgetChildren[i];
            this._ignoreContentSize(uiWidget);
            this._handleUIWidget(object, uiWidget);
            this.bindUIWidgetToObject(object, uiWidget);
        }
    },

    _handleUIWidget: function (object, uiWidget) {
        var uiWidgetName = uiWidget.getName();
        //只绑定命名以下划线开头的控件
        if (Util.startsWithString(uiWidgetName, '_')) {
            object[uiWidgetName] = uiWidget;
            this.bindUIWidgetTouchListener(object, uiWidget);
        }
    },

    _ignoreContentSize: function (uiWidget) {
        if (this.isUITextObject(uiWidget)) {
            uiWidget.ignoreContentAdaptWithSize(true);
        }
    },

    bindUIWidgetTouchListener: function (object, uiWidget) {
        if (!Util.isObject(object)) {
            console.log("object is not object type");
            return;
        }

        if (!this.isWidgetObject(uiWidget)) {
            console.log("uiWidget is not widget type");
            return;
        }

        var uiWidgetName = uiWidget.getName();
        if (!Util.startsWithString(uiWidgetName, '_')) {
            return;
        }

        //删除下划线
        uiWidgetName = uiWidgetName.substring(1);
        //将首字母转换为大写
        uiWidgetName = Util.upperFirstLetter(uiWidgetName);

        var touchListenerName = "_on" + uiWidgetName + "Touched";
        if (typeof object[touchListenerName] !== 'function') {
            return;
        }

        if (this.isUIButtonObject(uiWidget)) {
            uiWidget.addTouchEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIListViewObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIPanelObject(uiWidget)) {
            uiWidget.addTouchEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIPageViewObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIScrollViewObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUISliderObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }
    }
};
