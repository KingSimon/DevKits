/**
 * 转码
 */
var _convert = function () {
    var srcEl = $("#srcText");
    var srcText = srcEl.val();
    $("#rst").show();
    var rstCode = $("#rstCode");

    if ($("#uniEncode").prop("checked") == true) {
        rstCode.val(endecode.uniEncode(srcText));
    } else if ($("#uniDecode").prop("checked") == true) {
        srcEl.val(srcEl.val().replace(/\\U/g,'\\u'));
        rstCode.val(endecode.uniDecode(srcEl.val()));
    } else if ($("#utf8Encode").prop("checked") == true) {
        rstCode.val(encodeURIComponent(srcText));
    } else if ($("#utf8Decode").prop("checked") == true) {
        rstCode.val(decodeURIComponent(srcText));
    } else if ($("#base64Encode").prop("checked") == true) {
        rstCode.val(endecode.base64Encode(endecode.utf8Encode(srcText)));
    } else if ($("#base64Decode").prop("checked") == true) {
        rstCode.val(endecode.utf8Decode(endecode.base64Decode(srcText)));
    } else if ($("#md5Encode").prop("checked") == true) {
        rstCode.val(hex_md5(srcText));
    } else if ($("#html2js").prop("checked") == true) {
        rstCode.val(html2js(srcText));
    }
};

/**
 * 将html代码拼接为js代码
 * @returns {string}
 */
var html2js = function (txt) {
    var htmlArr = txt.replace(/\\/g, "\\\\").replace(/\\/g, "\\/").replace(/\'/g, "\\\'").split('\n');
    var len = htmlArr.length;
    var outArr = [];
    outArr.push("var htmlCodes = [\n");
    jQuery.each(htmlArr, function (index, value) {
        if (value !== "") {
            if (index === len - 1) {
                outArr.push("\'" + value + "\'");
            } else {
                outArr.push("\'" + value + "\',\n");
            }
        }

    });
    outArr.push("\n].join(\"\");");
    return outArr.join("");
};

/**
 * 绑定按钮的点击事件
 */
var _bindBtnEvent = function () {
    $("#btnCodeChange").click(function () {
        _convert();
    });

    $("#btnCodeClear").click(function () {
        $("#srcText,#rstCode").val("")
    });
};

/**
 * 每个单选按钮被点击时，都自动进行转换
 */
var _bindRadioEvent = function () {
    $("input[type=radio],label[for]").click(function (evt) {
        $this = $(this);
        setTimeout(function () {
            _convert();
        }, 150);
    });
};

/**
 * 鼠标划过结果框，选中
 */
var _bindRstEvent = function () {
    $("#rstCode").mouseover(function () {
        this.selectionStart = 0;
        this.selectionEnd = this.value.length;
        this.select();
    });
};

var _init = function () {
    // 在tab创建或者更新时候，监听事件，看看是否有参数传递过来
    // chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    //     if (request.type == MSG_TYPE.TAB_CREATED_OR_UPDATED && request.event == 'endecode') {
    //         if (request.content) {
    //             document.getElementById('srcText').value = (request.content);
    //             _convert();
    //         }
    //     }
    // });

    $(function () {
        //输入框聚焦
        $("#srcText").focus();
        //绑定按钮的点击事件
        _bindBtnEvent();
        //鼠标划过结果框，选中
        _bindRstEvent();
        //单选按钮的点击事件
        _bindRadioEvent();
    });
};

_init();