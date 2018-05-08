/**
 * 日期格式化
 * @param {Object} pattern
 */
Date.prototype.format = function(pattern){
    var pad = function (source, length) {
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));

        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }

        return (negative ?  "-" : "") + pre + string;
    };

    if ('string' != typeof pattern) {
        return this.toString();
    }

    var replacer = function(patternPart, result) {
        pattern = pattern.replace(patternPart, result);
    }

    var year    = this.getFullYear(),
        month   = this.getMonth() + 1,
        date2   = this.getDate(),
        hours   = this.getHours(),
        minutes = this.getMinutes(),
        seconds = this.getSeconds();

    replacer(/yyyy/g, pad(year, 4));
    replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
    replacer(/MM/g, pad(month, 2));
    replacer(/M/g, month);
    replacer(/dd/g, pad(date2, 2));
    replacer(/d/g, date2);

    replacer(/HH/g, pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, pad(hours % 12, 2));
    replacer(/h/g, hours % 12);
    replacer(/mm/g, pad(minutes, 2));
    replacer(/m/g, minutes);
    replacer(/ss/g, pad(seconds, 2));
    replacer(/s/g, seconds);

    return pattern;
};


var _bindEvents = function(){
    $('#btnStampToLocale').click(function(e) {
        var stamp = $.trim($('#txtSrcStamp').val());
        if(stamp.length == 0) {
            alert('请先填写你需要转换的Unix时间戳');
            return;
        }
        if(!parseInt(stamp,10)) {
            alert('请输入合法的Unix时间戳');
            return;
        }
        $('#txtDesDate').val((new Date(parseInt(stamp,10) * 1000)).format('yyyy-MM-dd HH:mm:ss'));
    });

    $('#btnLocaleToStamp').click(function(e) {
        var locale = $.trim($('#txtLocale').val());
        locale = Date.parse(locale);
        if(isNaN(locale)) {
            alert('请输入合法的时间格式，如：2014-04-01 10:01:01，或：2014-01-01');
        }
        $('#txtDesStamp').val(locale / 1000);
    });
};

var _initNowStamp = function(){
    var txtNowDate = $('#txtNowDate');
    var txtNowStamp = $('#txtNow');
    window.setInterval(function(){
        txtNowDate.val((new Date()).toLocaleString());
        txtNowStamp.val(Math.round((new Date()).getTime() / 1000));
    },1000);
};

var _init = function(){
    $(function(){
        _initNowStamp();
        _bindEvents();
        $('#tab0_url').focus();
    });
};

_init();