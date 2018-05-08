//各种元素的就绪情况
var _readyState = {
    css: false,
    js: false,
    html: true,
    allDone: false
};

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        switch (request.msg) {
            case 'snapshot':
                chrome.tabs.captureVisibleTab(null, {format:'png'}, function(dataUrl) {
                    sendResponse({sDataUrl: dataUrl});
                });
                break;
            case 'copy-to-clipboard':
                var oInput = document.getElementById('copy-to-clipboard');
                oInput.value = request.text;
                oInput.select();
                document.execCommand('copy', false, null);
                sendResponse({});
                break;
            case 'get-shortcuts':
                sendResponse(window.localStorage.shortcuts);
                break;
            case 'toggle-feature-state':
                if(request.queryTab){
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        var tab = tabs[0];
                        toggleFeatureState(request.feature, tab.id);
                        sendResponse({});
                    });
                }else{
                    toggleFeatureState(request.feature, sender.tab.id);
                    sendResponse({});
                }
                break;
            case 'get-feature-state':
                if(request.queryTab){
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        var tab = tabs[0];
                        var a = getFeatureState(request.feature, tab.id);
                        sendResponse({sResult:a});
                    });
                }else{
                    var a = getFeatureState(request.feature, sender.tab.id);
                    sendResponse({sResult:a});
                }
                break;

            case 'code-standard':
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    var tab = tabs[0];
                    _doFcpDetect(tab);
                    sendResponse({});
                });
                break;
            case 'colse-code-standard':
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    var tab = tabs[0];
                    chrome.tabs.sendRequest(tab.id, {sMethod: "closeCodeStandard"});
                    sendResponse({});
                });
                break;
            case 'debugger-console':
                _ajaxDebugger(request);
                sendResponse({});
                break;
            case 'debugger-switch':
                _ajaxDebuggerSwitch(request);
                sendResponse({});
                break;
            case 'create-tab':
                createTab(request.page, request.content);
                sendResponse({});
                break;
            case 'get-css':
                _readFileContent(request.link,sendResponse);
                break;
            case 'get-js':
                _readFileContent(request.link,sendResponse);
                break;
            case 'get-html':
                _readFileContent(request.link,sendResponse);
                break;
            case 'get-cookie':
                _getCookies(request, sendResponse);
                break;
            case 'remove-cookie':
                _removeCookie(request, sendResponse);
                break;
            case 'set-cookie':
                _setCookie(request, sendResponse);
                break;
            case 'css-ready':
                _readyState.css = true;
                _detectReadyState(sendResponse);
                break;
            case 'js-ready':
                _readyState.js = true;
                _detectReadyState(sendResponse);
                break;
            case 'html-ready':
                _readyState.html = true;
                _detectReadyState(sendResponse);
                break;
            default:
                sendResponse({});
        }
    }
);

/**
 * 从cookie中获取url
 * @param {Object} cookie
 */
var _urlFromCookie = function(cookie){
    return "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
};

/**
 * 获取页面上的所有cookie
 * @param {Object} callback
 */
var _getCookies = function(request,callback){
    var arrCookies = [];
    chrome.cookies.getAll({}, function(cookies){
        for(var i=0,le=cookies.length;i<le;i++){
            if(request.url.indexOf(cookies[i].domain.substring(1)) > -1) {
                cookies[i].url = _urlFromCookie(cookies[i]);
                arrCookies.push(cookies[i]);
            }
        }

        //排序
        cookies.sort(function (a, b) { return a.domain.localeCompare(b.domain); });

        callback.call(null,{
            cookie : arrCookies
        });
    });
};

/**
 * 移除某个cookie
 * @param {Object} request
 * @param {Object} callback
 */
var _removeCookie = function(request,callback){
    chrome.cookies.getAll({}, function(cookies){
        for(var i=0,le=cookies.length;i<le;i++){
            var url = _urlFromCookie(cookies[i]);
            var name = cookies[i].name;
            if(url == request.url && name == request.name) {
                chrome.cookies.remove({"url": url, "name": name});
                if(callback && typeof callback == "function") {
                    callback.call(null);
                }
                return;
            }
        }
    });
};

/**
 * 设置某个cookie
 * @param {Object} request
 * @param {Object} callback
 */
var _setCookie = function(request,callback){
    chrome.cookies.getAll({}, function(cookies){
        for(var i=0,le=cookies.length;i<le;i++){
            var url = _urlFromCookie(cookies[i]);
            var name = cookies[i].name;
            if(url == request.url && name == request.name) {
                chrome.cookies.set(request);
                if(callback && typeof callback == "function") {
                    callback.call(null);
                }
                return;
            }
        }
    });
};

//侦测就绪情况
var _detectReadyState = function (callback) {
    if (_readyState.css && _readyState.js && _readyState.html) {
        _readyState.allDone = true;
    }
    if (_readyState.allDone && typeof callback == 'function') {
        callback();
    }
};

var _fcp_detect_interval = [];
/**
 * 执行前端FCPHelper检测
 */
var _doFcpDetect = function (tab) {
    //所有元素都准备就绪
    if (_readyState.allDone) {
        clearInterval(_fcp_detect_interval[tab.id]);
        // chrome.tabs.sendMessage(tab.id, {
        //     type: MSG_TYPE.BROWSER_CLICKED,
        //     event: MSG_TYPE.FCP_HELPER_DETECT
        // });
        chrome.tabs.sendRequest(tab.id, {sMethod: "detectCodeStandard"});
    } else if (_fcp_detect_interval[tab.id] === undefined) {
        // chrome.tabs.sendMessage(tab.id, {
        //     type: MSG_TYPE.BROWSER_CLICKED,
        //     event: MSG_TYPE.FCP_HELPER_INIT
        // });
        chrome.tabs.sendRequest(tab.id, {sMethod: "initCodeStandard"});

        //显示桌面提醒
        notifyText({
            message: "正在准备数据，请稍等..."
        });

        _fcp_detect_interval[tab.id] = setInterval(function () {
            _doFcpDetect(tab);
        }, 200);
    }
};

/**
 * 文本格式，可以设置一个图标和标题
 * @param {Object} options
 * @config {string} type notification的类型，可选值：html、text
 * @config {string} icon 图标
 * @config {string} title 标题
 * @config {string} message 内容
 */
var notifyText = function (options) {
    if (!window.Notification) {
        return;
    }
    if (!options.icon) {
        options.icon = "assets/img/48.png";
    }
    if (!options.title) {
        options.title = "温馨提示";
    }

    return chrome.notifications.create('', {
        type: 'basic',
        title: options.title,
        iconUrl: chrome.runtime.getURL(options.icon),
        message: options.message
    });

};

/**
 * 文件类型
 */
const FILE = {
    //css的<style>标签
    STYLE : "style",
    //css的<link>标签
    LINK : "link",
    //js：通过script定义的内联js
    SCRIPT : "script-block"
};

/**
 * 通过这个方法来读取服务器端的CSS文件内容，要这样做，前提是在manifest.json中配置permissions为：http://
 * @param {String} link 需要读取的css文件
 * @param {Function} callback 回调方法，格式为：function(respData){}
 * @config {Object} respData 输出到客户端的内容，格式为{success:BooleanValue,content:StringValue}
 * @return {Undefined} 无返回值
 */
var _readFileContent = function(link,callback){
    //创建XMLHttpRequest对象，用原生的AJAX方式读取内容
    var xhr = new XMLHttpRequest();
    //处理细节
    xhr.onreadystatechange = function() {
        //后端已经处理完成，并已将请求response回来了
        if (xhr.readyState === 4) {
            //输出到客户端的内容，格式为{success:BooleanValue,content:StringValue}
            var respData;
            //判断status是否为OK
            if (xhr.status === 200 && xhr.responseText) {
                //OK时回送给客户端的内容
                respData = {
                    success : true,	//成功
                    type : FILE.LINK,	//<link>标签
                    path : link,	//文件路径
                    content : xhr.responseText	//文件内容
                };
            } else {	//失败
                respData = {
                    success : false,	//失败
                    type : FILE.LINK,	//<link>标签
                    path : link,	//文件路径
                    content : "DevKits can't load such file."	//失败信息
                };
            }
            //触发回调，并将结果回送
            callback(respData);
        }
    };
    //打开读通道
    xhr.open('GET', link, true);
    //设置HTTP-HEADER
    xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
    xhr.setRequestHeader("Access-Control-Allow-Origin","*");
    //开始进行数据读取
    xhr.send();
};

var _ajaxDebuggerSwitch = function (request) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var tab = tabs[0];
        chrome.tabs.executeScript(tab.id, {
            code: 'console.info("DevKits提醒：Ajax Debugger开关已' + (request.content ? '开启' : '关闭') + '！");',
            allFrames: false
        });
    });
};

/**
 * 在当前页面的控制台输出console
 * @param request
 * @private
 */
var _ajaxDebugger = function (request) {

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var tab = tabs[0];
        chrome.tabs.executeScript(tab.id, {
            code: "(" + (function (jsonStr) {
                var args = JSON.parse(unescape(jsonStr));
                console[args[0]].apply(console, Array.prototype.slice.call(args, 1));
            }).toString() + ")('" + request.content + "');"
        });
    });
};

function getDefaultOptions() {
    return {
        url_validate_html: "http://validator.w3.org/check?verbose=1&uri=",
        url_validate_css: "http://jigsaw.w3.org/css-validator/validator?profile=css21&uri=",
        url_validate_links: "http://validator.w3.org/checklink?uri=",
        url_validate_feed: "http://validator.w3.org/feed/check.cgi?url=",
        url_validate_accessibility: "http://achecker.ca/checkacc.php?id=2f4149673d93b7f37eb27506905f19d63fbdfe2d&guide=WCAG2-L2&output=html&uri=",
        mode_validate_local_html: {
            show_source: !0, show_outline: !1,
            verbose_output: !0
        },
        mode_validate_local_css: "css2"
    }
}

function retrieveOptions() {
    if (!window.localStorage.options || !JSON.parse(window.localStorage.options).url_validate_html) {
        var a = getDefaultOptions();
        window.localStorage.options = JSON.stringify(a)
    }
    return JSON.parse(window.localStorage.options);
}

function createTab(sTabURL, oData) {
    var port = null;
    chrome.tabs.getSelected(null, function(tab) {
        var oCurrentTab = tab;
        chrome.tabs.create({url: sTabURL, index: oCurrentTab.index+1}, function(tab) {
            var tabLoaded = function(tabId, tabInformation)
            {
                // If this is the opened tab and it finished loading
                if(tabId == tab.id && tabInformation.status == "complete")
                {
                    port = chrome.tabs.connect(tab.id);
                    switch (sTabURL) {
                        case 'assets/pages/view-responsive-layouts.html':
                            port.postMessage({
                                sURL: oCurrentTab.url,
                                aData: oData
                            });
                            break;
                        case 'assets/pages/tools-performance.html':
                            port.postMessage({
                                sURL: oCurrentTab.url,
                                aSearch: oData
                            });
                            break;
                        case 'assets/pages/view-css.html':
                            port.postMessage({
                                sURL: oCurrentTab.url,
                                aEmbeddedCSS: oData.aEmbeddedCSS,
                                aExternalCSS: oData.aExternalCSS
                            });
                            break;
                        case 'assets/pages/show-used-colors.html':
                            port.postMessage({
                                sURL: oCurrentTab.url,
                                aColors: oData.aColors
                            });
                            break;
                        case 'assets/pages/view-images-information.html':
                            port.postMessage({
                                sURL: oCurrentTab.url,
                                aImages: oData.aImages
                            });
                            break;
                        case 'assets/pages/view-javascript.html':
                            port.postMessage({
                                sURL: oCurrentTab.url,
                                aEmbeddedScripts: oData.aEmbeddedScripts,
                                aExternalScripts: oData.aExternalScripts
                            });
                            break;
                        case 'assets/pages/view-source.html':
                            port.postMessage({
                                sURL: oCurrentTab.url,
                                sSource: oData.sSource,
                                sType: oData.sType
                            });
                            break;
                        case 'assets/pages/validate-local-html.html':
                        case 'assets/pages/validate-local-css.html':
                            port.postMessage(oData);
                            break;
                    }
                    port = null;
                    chrome.tabs.onUpdated.removeListener(tabLoaded);
                }
            };
            chrome.tabs.onUpdated.addListener(tabLoaded);
        });
    });
}

function viewSelectionSource() {
    return function(info, tab) {
        chrome.tabs.sendRequest(tab.id, {sMethod: 'getSelectionSource'}, function(oResponse) {
            createTab('assets/pages/view-source.html', oResponse);
        });
    };
}

chrome.contextMenus.create({
    'title' : 'View selection source',
    'type' : 'normal',
    'contexts' : ['selection'],
    'onclick' : viewSelectionSource()
});

