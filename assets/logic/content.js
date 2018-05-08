var oPage = {
    bAllStylesDisabled: !1,
    bInlineStylesDisabled: !1,
    bEmbeddedStylesDisabled: !1,
    bLinkedStyleSheetsDisabled: !1,
    bAllImagesHidden: !1,
    bBackgroundImagesHidden: !1,
    oPageRuler: {
        bActivated: !1,
        bMouseDown: !1,
        bMoving: !1,
        bDragging: !1,
        bResizing: !1,
        iMoveX: 0,
        iMoveY: 0,
        iStartX: 0,
        iStartY: 0,
        iEndX: 0,
        iEndY: 0,
        iPageWidth: 0,
        iPageHeight: 0
    },
    oPageColorPicker: {
        bActivated: !1,
        oCanvas: null,
        oCtx: null,
        iTimeoutId: null,
        bBlocked: !1,
        iCursorXPos: 0,
        iCursorYPos: 0
    },
    createDiv: function (a, b) {
        var c = document.createElement("div");
        c.id = b;
        a.appendChild(c);
        return c
    },
    toggleStyleSheet: function (a, b) {
        var c = getElem(b);
        c ? c.parentNode.removeChild(c) : (c = document.createElement("link"), c.setAttribute("id", b), c.setAttribute("rel", "stylesheet"), c.setAttribute("type", "text/css"), c.setAttribute("href", chrome.extension.getURL(a)), (document.documentElement || document.head || document.body).appendChild(c))
    },
    setUpListener: function () {
        var a = this, b = {
            toggleCodeStandard:function () {
                chrome.extension.sendRequest({
                    msg: "get-feature-state",
                    feature: "tools-codestandard"
                }, function (result) {
                    chrome.extension.sendRequest({
                        msg: "code-standard"
                    });
                });
                return {}
            },
            closeCodeStandard:function () {
                //移除css
                this.toggleStyleSheet("/assets/scss/ui/tools-codestandard.css", "devkits-tools-codestandard");
                chrome.extension.sendRequest({msg: "toggle-feature-state", feature: "tools-codestandard"})
                return {}
            },
            detectCodeStandard:function () {
                DevKits.fcphelper.initStaticFile();
                return {}
            },
            initCodeStandard:function () {
                //加载css
                this.toggleStyleSheet("/assets/scss/ui/tools-codestandard.css", "devkits-tools-codestandard");
                //html
                DevKits.fcphelper.initHtml(function(){
                    //fcp相关检测
                    DevKits.fcphelper.detect();
                });
                return {}
            },
            getWpoInfo: function (param,callback) {
                var wpoInfo = {};
                /**
                 * 获取页面的http header
                 * @return {[type]}
                 */
                var getHttpHeaders = function(){
                    if(wpoInfo.header && wpoInfo.time && wpoInfo.pageInfo) {
                        sendWpoInfo();
                    }else{
                        $.ajax({
                            type: 'GET',
                            url : window.location.href,
                            complete: function( xhr,data ){
                                wpoInfo.header = {
                                    "date" : xhr.getResponseHeader('Date'),
                                    "connection" : xhr.getResponseHeader('Connection'),
                                    "contentEncoding" : xhr.getResponseHeader('Content-Encoding'),
                                    "contentLength" : xhr.getResponseHeader('Content-Length'),
                                    "server" : xhr.getResponseHeader('Server'),
                                    "vary" : xhr.getResponseHeader('Vary'),
                                    "transferEncoding" : xhr.getResponseHeader('Transfer-Encoding'),
                                    "contentType" : xhr.getResponseHeader('Content-Type'),
                                    "cacheControl" : xhr.getResponseHeader('Cache-Control'),
                                    "exprires" : xhr.getResponseHeader('Exprires'),
                                    "lastModified" : xhr.getResponseHeader('Last-Modified')
                                };

                                getPageInfo();
                                getPageLoadTime();
                                callback(wpoInfo);
                            }
                        });
                    }
                };

                /**
                 * 页面相关信息
                 */
                var getPageInfo = function(){
                    wpoInfo.pageInfo = {
                        title : document.title,
                        url : location.href
                    };
                };

                /**
                 * 获取网页的加载时间
                 */
                var getPageLoadTime = function(){
                    wpoInfo.time = performance.timing;
                };

                // 如果是网络地址，才去获取header
                if(/^((http)|(https))\:\/\//.test(location.href)) {
                    getHttpHeaders();
                }
                // 否则只提取performance信息
                else{
                    getPageInfo();
                    getPageLoadTime();
                    callback(wpoInfo);
                }
                return false;
            },
            toggleAjaxDebugger:function () {
                chrome.extension.sendRequest({
                    msg: "get-feature-state",
                    feature: "tools-ajaxdebugger"
                }, function (result) {
                    chrome.extension.sendRequest({
                        msg: "debugger-switch",
                        content: result.sResult
                    });
                });
                return {}
            },
            getCSS: function () {
                return this.getCSS()
            },
            reloadCSS: function () {
                return this.reloadCSS()
            },
            toggleAllStyles: function () {
                this.toggleAllStyles();
                return {}
            },
            toggleInlineStyles: function () {
                this.toggleInlineStyles(this.bInlineStylesDisabled);
                this.bInlineStylesDisabled = !this.bInlineStylesDisabled;
                return {}
            },
            toggleEmbeddedStyles: function () {
                for (var c = null, b = document.querySelectorAll("style"), a = 0, d = b.length; a < d; a++)c = b[a].sheet, c.disabled = !this.bEmbeddedStylesDisabled;
                this.bEmbeddedStylesDisabled = !this.bEmbeddedStylesDisabled;
                return {}
            },
            toggleLinkedStyleSheets: function () {
                for (var c = null, b = document.styleSheets, a = 0, d = b.length; a < d; a++)if (c = b[a], c.ownerNode.nodeName ===
                    "LINK") c.disabled = !this.bLinkedStyleSheetsDisabled;
                this.bLinkedStyleSheetsDisabled = !this.bLinkedStyleSheetsDisabled;
                return {}
            },
            getUsedColors: function () {
                var c = document.getElementsByTagName("*");
                sColor = null;
                aColors = [];
                for (var b = 0, a = c.length; b < a; b++)this.has(aColors, sColor = this.getStyle(c[b], "background-color")) || aColors.push(sColor), this.has(aColors, sColor = this.getStyle(c[b], "color")) || aColors.push(sColor);
                return {aColors: aColors}
            },
            showPasswords: function (c) {
                for (var b = 0, a = null, d = null, g = document.getElementsByTagName("input"),
                         h = 0, j = g.length; h < j; h++)a = g[h], a.hasAttribute("type") && (d = a.getAttribute("type").toLowerCase(), !c.bActivated && d === "password" ? (a.setAttribute("type", "text"), a.addClass("devkits-password"), b++) : c.bActivated && a.hasClass("devkits-password") && (a.setAttribute("type", "password"), a.removeClass("devkits-password")));
                return {iCount: b}
            },
            removeMaxlengthAttributes: function (c) {
                for (var a = 0, b = null, d = document.querySelectorAll("input[" + (c.bActivated ? "devkits-maxlength" : "maxlength") + "]"), g = 0, h = d.length; g < h; g++)b = d[g],
                    c.bActivated ? (b.setAttribute("maxlength", b.getAttribute("devkits-maxlength")), b.removeAttribute("devkits-maxlength")) : (b.setAttribute("devkits-maxlength", b.getAttribute("maxlength")), b.removeAttribute("maxlength"), a++);
                return {iCount: a}
            },
            convertSelectElementsToTextInputs: function () {
                for (var c = 0, b = null, a = null, d = document.getElementsByTagName("select"); d.length > 0;)a = d[0], b = document.createElement("input"), b.value = a.value, a.hasAttribute("id") && b.setAttribute("id", a.getAttribute("id")), a.hasAttribute("name") &&
                b.setAttribute("name", a.getAttribute("name")), a.parentNode.replaceChild(b, a), c++;
                return {iCount: c}
            },
            showHiddenElements: function () {
                for (var c = 0, b = document.querySelectorAll("input[type=hidden]"), a = 0, d = b.length; a < d; a++)b[a].removeAttribute("type"), c++;
                return {iCount: c}
            },
            clearRadioButtons: function () {
                for (var c = 0, a = document.querySelectorAll("input[type=radio]"), b = 0, d = a.length; b < d; b++)a[b].checked = !1, c++;
                return {iCount: c}
            },
            enableFormElements: function () {
                for (var c = 0, b = null, a = null, d = document.forms, g = 0, h, j = d.length; g <
                j; g++) {
                    a = d[g];
                    for (h = 0; h < a.elements.length; h++)if (b = a.elements[h], b.disabled || b.readOnly) b.disabled = !1, b.readOnly = !1, c++
                }
                return {iCount: c}
            },
            convertFormMethods: function (c) {
                for (var b = 0, a = null, d = document.forms, g = 0, h = d.length; g < h; g++)if (a = d[g], c.sElementId === "convert-gets-to-posts" && (!a.hasAttribute("method") || a.hasAttribute("method") && a.method.toLowerCase() !== "post")) a.method = "post", b++; else if (c.sElementId === "convert-posts-to-gets" && a.hasAttribute("method") && a.method.toLowerCase() !== "get") a.method = "get",
                    b++;
                return {iCount: b}
            },
            getImages: function () {
                var a = 0, b = null, f = null, d = null, a = b = null, g = [], h = {}, j = [], f = document.querySelectorAll('link[rel*="icon"]'), a = 0;
                for (l = f.length; a < l; a++)
                    if (b = f[a], b.href)
                        d = new Image, d.src = b.href, g.push({
                    type: "Icon",
                    src: d.src,
                    naturalWidth: d.naturalWidth,
                    naturalHeight: d.naturalHeight
                });
                f = document.querySelectorAll('img,input[type="image"]');
                a = 0;
                for (l = f.length; a < l; a++)
                    if (b = f[a], b.src) b.type && b.type === "image" ? (d = new Image, d.src = b.src) : d = b, g.push({
                    type: "Image", src: d.src, alt: d.alt, title: d.title,
                    naturalWidth: d.naturalWidth, naturalHeight: d.naturalHeight
                });
                // for (a = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1); (b = a.nextNode()) != null;)
                //     if ((b = window.getComputedStyle(b, null).getPropertyCSSValue("background-image")) && b.primitiveType == CSSPrimitiveValue.CSS_URI)
                //         d = new Image, d.src = b.getStringValue(),
                //             g.push({
                //     type: "Background image",
                //     src: d.src,
                //     naturalWidth: d.naturalWidth,
                //     naturalHeight: d.naturalHeight
                // });
                for (a = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1); (b = a.nextNode()) != null;)
                    if ((b = window.getComputedStyle(b, null)["background-image"]) && b.indexOf('url') > -1)
                        d = new Image, d.src = b.match(/url\("(\S*)"\)/)[1],
                            g.push({
                                type: "Background image",
                                src: d.src,
                                naturalWidth: d.naturalWidth,
                                naturalHeight: d.naturalHeight
                            });
                a = 0;
                for (l = g.length; a < l; ++a)h.hasOwnProperty(g[a].src) || (h[g[a].src] = !0, j.push(g[a]));
                return {aImages: j}
            },
            hideAllImages: function () {
                var a = null, b = null, b = document.querySelectorAll("input[" + (this.bAllImagesHidden ? "devkits-hide-all-images" : 'type="image"') + "]");
                i = 0;
                for (l = b.length; i < l; i++)a = b[i], this.bAllImagesHidden ? (a.removeAttribute("devkits-hide-all-images"), a.setAttribute("type", "image")) : (a.setAttribute("devkits-hide-all-images", !0), a.setAttribute("type", "submit"));
                this.toggleStyleSheet("/assets/scss/ui/hide-images.css", "devkits-hide-all-images");
                this.toggleBackgroundImages(this.bAllImagesHidden);
                this.bAllImagesHidden = !this.bAllImagesHidden;
                return {}
            },
            hideBackgroundImages: function () {
                this.toggleBackgroundImages(this.bBackgroundImagesHidden);
                this.bBackgroundImagesHidden = !this.bBackgroundImagesHidden;
                return {}
            },
            showNote: function (a) {
                var b = null, f = null, d = null, g = null;
                this.toggleStyleSheet("/assets/scss/ui/note.css", "devkits-note" + a.sType);
                if (a.bActivated)for (var g = document.querySelectorAll('span[class*="devkits-' + a.sType + '"]'), h = 0, j = g.length; h < j; h++)d = g[h], d.parentNode.removeChild(d); else {
                    g = document.images;
                    h = 0;
                    for (j = g.length; h < j; h++)d = g[h], f = document.createElement("span"), a.sType === "alt" ? b = "alt=" + d.alt : a.sType === "dimensions" ? b = "dim=" + d.clientWidth + "x" + d.clientHeight : a.sType === "paths" && (b = "src=" + d.src), f.setAttribute("class", "devkits-" + a.sType + " devkits-note"), f.appendChild(document.createTextNode(b)), d.parentNode.insertBefore(f, d)
                }
                return {}
            },
            getJavaScript: function () {
                return this.getJavaScript()
            },
            getSelectionSource: function () {
                var a = window.getSelection().getRangeAt(0).commonAncestorContainer;
                switch (a.nodeType) {
                    case Node.TEXT_NODE:
                    case Node.CDATA_SECTION_NODE:
                        a =
                            a.parentNode
                }
                return {sSource: this.formatSource((new XMLSerializer).serializeToString(a)), sType: "selection"}
            },
            getGeneratedSource: function () {
                return this.getGeneratedSource()
            },
            displayColorPicker: function () {
                this.toggleColorPicker();
                return {}
            },
            displayRuler: function () {
                this.toggleRuler();
                return {}
            },
            topographicView: function () {
                this.toggleStyleSheet("/assets/scss/ui/topographic-view.css", "devkits-topographic-view");
                return {}
            },
            getWindowSize: function () {
                return {
                    innerWidth: window.innerWidth, innerHeight: window.innerHeight,
                    outerWidth: window.outerWidth, outerHeight: window.outerHeight
                }
            },
            retrieveHTML: function () {
                var a = {sSource: ""}, b = new XMLHttpRequest;
                b.open("GET", document.documentURI, !1);
                b.send(null);
                if (b.status === 200) a.sSource = b.responseText;
                return a
            },
            retrieveCSS: function () {
                for (var a = {sSource: ""}, b = null, f = b = null, b = document.getElementsByTagName("style"), d = 0, g = b.length; d < g; d++)a.sSource += b[d].innerText;
                b = document.getElementsByTagName("link");
                d = 0;
                for (g = b.length; d < g; d++)b[d].rel == "stylesheet" && b[d].href.match(/^https?:\/\//i) &&
                (f = new XMLHttpRequest, f.open("GET", b[d].href, !1), f.send(null), f.status === 200 && (a.sSource += f.responseText));
                return a
            }
        };
        chrome.extension.onRequest.addListener(function (c, e, f) {
            oResponse = b[c.sMethod].call(a, c, f);
            if(oResponse !== false) f(oResponse)
        })
    },
    getCSS: function () {
        for (var a = [], b = [], c = null, e = null, f = document.styleSheets, d = 0, g = 0, h = f.length; d < h; d++) {
            e = f[d];
            if (e.ownerNode.nodeName === "STYLE") {
                if (/^\s*$/.test(e.ownerNode.textContent))continue;
                a.push(e.ownerNode.textContent)
            } else e.ownerNode.nodeName === "LINK" && b.push(e.href);
            if (e.cssRules !==
                null)for (g = 0; g < e.cssRules.length; g++)c = e.cssRules[g], c instanceof CSSImportRule && b.push(c.styleSheet.href)
        }
        return {aEmbeddedCSS: a, aExternalCSS: b}
    },
    reloadCSS: function () {
        for (var a = 0, b = null, c = null, e = document.styleSheets, f = 0, d = e.length; f < d; f++)if (c = e[f], c.href) b = c.href.replace(/(&|\?)devkits-reload-css=\d+/, ""), c.ownerNode.href = b + (b.indexOf("?") === -1 ? "?" : "&") + "devkits-reload-css=" + (new Date).valueOf(), a++;
        return {iCount: a}
    },
    toggleAllStyles: function () {
        for (var a = null, b = document.styleSheets, c = 0, e = b.length; c <
        e; c++)a = b[c], a.disabled = !this.bAllStylesDisabled;
        this.toggleInlineStyles(this.bAllStylesDisabled);
        this.bAllStylesDisabled = !this.bAllStylesDisabled
    },
    toggleInlineStyles: function (a) {
        for (var b = null, c = document.querySelectorAll("[" + (a ? "devkits-inline-style" : "style") + "]"), e = 0, f = c.length; e < f; e++)b = c[e], a ? (b.setAttribute("style", b.getAttribute("devkits-inline-style")), b.removeAttribute("devkits-inline-style")) : (b.setAttribute("devkits-inline-style", b.getAttribute("style")), b.removeAttribute("style"))
    },
    toggleBackgroundImages: function (a) {
        var b =
            null, c = null, e = b = null;
        if (a) {
            b = document.querySelectorAll("[devkits-background-image]");
            a = 0;
            for (e = b.length; a < e; a++)c = b[a], c.style.backgroundImage = "url(" + c.getAttribute("devkits-background-image") + ")", c.removeAttribute("devkits-background-image")
        } else for (b = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1); (c = b.nextNode()) != null;)
            // if ((e = window.getComputedStyle(c, null).getPropertyCSSValue("background-image")) && e.primitiveType == CSSPrimitiveValue.CSS_URI)
            //     c.setAttribute("devkits-background-image",
            // e.getStringValue()), c.style.backgroundImage = "none"
        if ((e = window.getComputedStyle(c, null)["background-image"]) && e.indexOf('url') > -1)
            c.setAttribute("devkits-background-image", e.match(/url\("(\S*)"\)/)[1]), c.style.backgroundImage = "none"
    },
    getJavaScript: function () {
        for (var a = null, b = [], c = [], a = document.getElementsByTagName("script"), e = 0, f = a.length; e < f; e++)a[e].src ? c.push({src: a[e].src}) : b.push({content: a[e].innerText});
        return {aEmbeddedScripts: b, aExternalScripts: c}
    },
    getGeneratedSource: function () {
        var a = this.formatSource(document.documentElement.outerHTML), b = (new XMLSerializer).serializeToString(document.doctype);
        b && (a = '<span class="webkit-html-doctype">' + this.replaceLtGtSigns(b) + "</span>\n" +
            a);
        return {sSource: a, sType: "generated"}
    },
    toggleColorPicker: function () {
        var a = this;
        this.toggleStyleSheet("/assets/scss/ui/color-picker.css", "devkits-color-picker-css");
        if (this.oPageColorPicker.bActivated) this.removeColorPicker(); else {
            var b = this.createDiv(document.documentElement, "devkits-background");
            b.style.width = document.width + "px";
            b.style.height = document.height + "px";
            var b = this.createDiv(b, "devkits-toolbox"), c = this.createDiv(b, "devkits-toolbox-close");
            c.addEventListener("mousedown", function () {
                a.toggleStyleSheet("/assets/scss/ui/color-picked.css",
                    "devkits-color-picker-css");
                a.removeColorPicker();
                chrome.extension.sendRequest({msg: "toggle-feature-state", feature: "display-color-picker"})
            }, !1);
            c.title = "Close inspector";
            this.createDiv(b, "devkits-toolbox-color");
            c = this.createDiv(b, "devkits-toolbox-rgb");
            oTextRgb = document.createElement("span");
            oTextRgb.id = "devkits-rgb-text";
            c.appendChild(oTextRgb);
            var e = document.createElement("span");
            e.id = "copy-rgb";
            e.title = "Copy color to clipboard";
            e.addEventListener("mousedown", function () {
                chrome.extension.sendRequest({
                    msg: "copy-to-clipboard",
                    text: oTextRgb.innerText
                })
            }, !1);
            c.appendChild(e);
            c = this.createDiv(b, "devkits-toolbox-hex");
            oTextHex = document.createElement("span");
            oTextHex.id = "devkits-hex-text";
            c.appendChild(oTextHex);
            e = document.createElement("span");
            e.id = "copy-hex";
            e.title = "Copy color to clipboard";
            e.addEventListener("mousedown", function () {
                chrome.extension.sendRequest({msg: "copy-to-clipboard", text: oTextHex.innerText})
            }, !1);
            c.appendChild(e);
            b = this.createDiv(b, "devkits-toolbox-resume");
            b.addEventListener("mousedown", this.resumeColorInspecting,
                !1);
            b.innerText = "Resume inspecting";
            setTimeout(function () {
                getElem("devkits-toolbox").className = "visible"
            }, 100);
            document.addEventListener("mousemove", this.colorPickerOnMouseMove, !1);
            document.addEventListener("scroll", this.colorPickerOnScroll, !1);
            document.addEventListener("click", this.colorPickerOnClick, !1);
            this.oPageColorPicker.oCanvas = document.createElement("canvas");
            this.oPageColorPicker.oCtx = this.oPageColorPicker.oCanvas.getContext("2d");
            this.oPageColorPicker.bBlocked = !1;
            this.oPageColorPicker.bActivated = !0;
            this.snapshotViewport()
        }
    },
    toggleRuler: function () {
        var a = this;
        this.toggleStyleSheet("/assets/scss/ui/ruler.css", "devkits-ruler-css");
        var _this = this;
        setTimeout(function () {
            if (_this.oPageRuler.bActivated) _this.removeRuler(); else {
                var b = _this.createDiv(document.documentElement, "devkits-background");
                b.style.width = document.body.scrollWidth+ "px";
                b.style.height = document.body.scrollHeight + "px";
                _this.createDiv(b, "devkits-shadow-top");
                _this.createDiv(b, "devkits-shadow-bottom");
                _this.createDiv(b, "devkits-shadow-left");
                _this.createDiv(b, "devkits-shadow-right");
                var c = _this.createDiv(b,
                    "devkits-ruler");
                c.style.width = "350px";
                c.style.height = "200px";
                c.style.left = document.body.scrollLeft + (document.documentElement.clientWidth - 350) / 2 + "px";
                c.style.top = document.body.scrollTop + (document.documentElement.clientHeight - 200) / 2 + "px";
                _this.createDiv(c, "devkits-ruler-size");
                var e = _this.createDiv(c, "devkits-ruler-close");
                e.addEventListener("mousedown", function () {
                    a.toggleStyleSheet("/assets/scss/ui/ruler.css", "devkits-ruler-css");
                    a.removeRuler();
                    chrome.extension.sendRequest({
                        msg: "toggle-feature-state",
                        feature: "display-ruler"
                    })
                }, !1);
                e.innerText = "Close";
                _this.createDiv(c, "devkits-ruler-top-left");
                _this.createDiv(c, "devkits-ruler-top-right");
                _this.createDiv(c, "devkits-ruler-bottom-right");
                _this.createDiv(c, "devkits-ruler-bottom-left");
                _this.createDiv(c, "devkits-ruler-container");
                b.addEventListener("mousedown", _this.rulerOnMouseDown, !1);
                document.addEventListener("mousemove", _this.rulerOnMouseMove, !1);
                document.addEventListener("mouseup", _this.rulerOnMouseUp, !1);
                _this.oPageRuler.iPageHeight = b.clientHeight;
                _this.oPageRuler.iPageWidth =
                    b.clientWidth;
                _this.oPageRuler.iStartX = parseInt(c.style.left);
                _this.oPageRuler.iStartY = parseInt(c.style.top);
                _this.oPageRuler.iEndX = parseInt(c.style.left) + 350;
                _this.oPageRuler.iEndY = parseInt(c.style.top) + 200;
                _this.oPageRuler.bActivated = !0;
                _this.updateRulerShadow(c);
                _this.updateRulerDisplayedSize()
            }
        },500);
    },
    has: function (a, b) {
        if (!b)return !0;
        for (var c = 0, e = a.length; c < e; c++)if (a[c] === b)return !0;
        return !1
    },
    getStyle: function (a, b) {
        var c = window.getComputedStyle(a, null)[b];
        return c === "rgba(0, 0, 0, 0)" ? !1 : c
    },
    rulerOnMouseDown: function () {
        if (event.button != 2) {
            var a = event.target;
            if (a && a.tagName && document) {
                oPage.oPageRuler.bMouseDown = !0;
                var b = getElem("devkits-ruler"), c = event.pageX, e = event.pageY;
                if (b) a == getElem("devkits-ruler-container") ? (
                    oPage.oPageRuler.bMoving = !0, oPage.oPageRuler.iMoveX = c - b.offsetLeft, oPage.oPageRuler.iMoveY = e - b.offsetTop
                    ) : a == getElem("devkits-ruler-top-left") ? (
                        oPage.oPageRuler.bResizing = !0, oPage.oPageRuler.iStartX = b.offsetLeft + b.clientWidth, oPage.oPageRuler.iStartY = b.offsetTop + b.clientHeight
                        ) : a == getElem("devkits-ruler-top-right") ? (
                            oPage.oPageRuler.bResizing = !0, oPage.oPageRuler.iStartX = b.offsetLeft, oPage.oPageRuler.iStartY = b.offsetTop + b.clientHeight
                            ) : a == getElem("devkits-ruler-bottom-left") ? (
                                oPage.oPageRuler.bResizing = !0, oPage.oPageRuler.iStartX = b.offsetLeft + b.clientWidth, oPage.oPageRuler.iStartY = b.offsetTop
                                ) : a == getElem("devkits-ruler-bottom-right") ? (
                                    oPage.oPageRuler.bResizing = !0, oPage.oPageRuler.iStartX = b.offsetLeft, oPage.oPageRuler.iStartY = b.offsetTop
                                    ) : (
                                        oPage.oPageRuler.bDragging = !0, oPage.oPageRuler.iEndX = 0, oPage.oPageRuler.iEndY = 0, oPage.oPageRuler.iStartX = c, oPage.oPageRuler.iStartY = e
                                    );
                event.preventDefault()
            }
        }
    },
    rulerOnMouseMove: function () {
        if (event.target && oPage.oPageRuler.bMouseDown) {
            var a = getElem("devkits-ruler");
            if (a) {
                var b = event.pageX, c = event.pageY;
                if (oPage.oPageRuler.bDragging || oPage.oPageRuler.bResizing) {
                    var e = 0, f = 0;
                    if (b > document.width) b = document.width;
                    if (c > document.height) c = document.height;
                    oPage.oPageRuler.iEndX = b;
                    oPage.oPageRuler.iEndY = c;
                    oPage.oPageRuler.iStartX > oPage.oPageRuler.iEndX ? (e = oPage.oPageRuler.iStartX - oPage.oPageRuler.iEndX, a.style.left = b + "px") : (e = oPage.oPageRuler.iEndX -
                            oPage.oPageRuler.iStartX, a.style.left = oPage.oPageRuler.iStartX + "px");
                    oPage.oPageRuler.iStartY > oPage.oPageRuler.iEndY ? (f = oPage.oPageRuler.iStartY - oPage.oPageRuler.iEndY, a.style.top = oPage.oPageRuler.iEndY + "px") : (f = oPage.oPageRuler.iEndY - oPage.oPageRuler.iStartY, a.style.top = oPage.oPageRuler.iStartY + "px");
                    a.style.height = f + "px";
                    a.style.width = e + "px";
                    if (window.innerWidth < b) document.body.scrollLeft = b - window.innerWidth;
                    if (document.body.scrollTop + window.innerHeight < c + 25) document.body.scrollTop = c - window.innerHeight +
                        25;
                    c < document.body.scrollTop && (document.body.scrollTop -= 25)
                } else if (oPage.oPageRuler.bMoving) b -= oPage.oPageRuler.iMoveX, c -= oPage.oPageRuler.iMoveY, b < 0 ? b = 0 : b + a.clientWidth > oPage.oPageRuler.iPageWidth && (b = oPage.oPageRuler.iPageWidth - a.clientWidth), c < 0 ? c = 0 : c + a.clientHeight > oPage.oPageRuler.iPageHeight && (c = oPage.oPageRuler.iPageHeight - a.clientHeight), a.style.left = b + "px", a.style.top = c + "px", oPage.oPageRuler.iEndX = b + a.clientWidth, oPage.oPageRuler.iStartX = b, oPage.oPageRuler.iEndY = c + a.clientHeight, oPage.oPageRuler.iStartY =
                    c;
                oPage.updateRulerShadow(a);
                oPage.updateRulerDisplayedSize()
            }
        }
    },
    rulerOnMouseUp: function () {
        oPage.oPageRuler.bMouseDown = !1;
        if (event.button != 2) {
            oPage.oPageRuler.bResizing = !1;
            oPage.oPageRuler.bDragging = !1;
            oPage.oPageRuler.bMoving = !1;
            oPage.oPageRuler.bMoveX = 0;
            oPage.oPageRuler.bMoveY = 0;
            var a;
            if (oPage.oPageRuler.iEndX < oPage.oPageRuler.iStartX) a = oPage.oPageRuler.iEndX, oPage.oPageRuler.iEndX = oPage.oPageRuler.iStartX, oPage.oPageRuler.iStartX = a;
            if (oPage.oPageRuler.iEndY < oPage.oPageRuler.iStartY) a = oPage.oPageRuler.iEndY,
                oPage.oPageRuler.iEndY = oPage.oPageRuler.iStartY, oPage.oPageRuler.iStartY = a
        }
    },
    updateRulerShadow: function (a) {
        getElem("devkits-shadow-top").style.height = parseInt(a.style.top) + "px";
        getElem("devkits-shadow-top").style.width = parseInt(a.style.left) + parseInt(a.style.width) + 1 + "px";
        getElem("devkits-shadow-left").style.height = oPage.oPageRuler.iPageHeight - parseInt(a.style.top) + "px";
        getElem("devkits-shadow-left").style.width = parseInt(a.style.left) + "px";
        var b = parseInt(a.style.top) + parseInt(a.style.height) + 1, b = b < 0 ? 0 : b, c = oPage.oPageRuler.iPageWidth -
            1 - (parseInt(a.style.left) + parseInt(a.style.width)), c = c < 0 ? 0 : c;
        getElem("devkits-shadow-right").style.height = b + "px";
        getElem("devkits-shadow-right").style.width = c + "px";
        b = oPage.oPageRuler.iPageHeight - 1 - (parseInt(a.style.top) + parseInt(a.style.height));
        b = b < 0 ? 0 : b;
        c = oPage.oPageRuler.iPageWidth - parseInt(a.style.left);
        c = c < 0 ? 0 : c;
        getElem("devkits-shadow-bottom").style.height = b + "px";
        getElem("devkits-shadow-bottom").style.width = c + "px"
    },
    updateRulerDisplayedSize: function () {
        var a = oPage.oPageRuler.iEndX > oPage.oPageRuler.iStartX ? oPage.oPageRuler.iEndX -
            oPage.oPageRuler.iStartX : oPage.oPageRuler.iStartX - oPage.oPageRuler.iEndX, b = oPage.oPageRuler.iEndY > oPage.oPageRuler.iStartY ? oPage.oPageRuler.iEndY - oPage.oPageRuler.iStartY : oPage.oPageRuler.iStartY - oPage.oPageRuler.iEndY;
        getElem("devkits-ruler-size").innerText = a + " x " + b
    },
    removeRuler: function () {
        var a = getElem("devkits-background");
        a.parentNode.removeChild(a);
        document.removeEventListener("mousedown", this.rulerOnMouseDown, !1);
        document.removeEventListener("mousemove", this.rulerOnMouseMove, !1);
        document.removeEventListener("mouseup",
            this.rulerOnMouseUp, !1);
        oPage.oPageRuler.bActivated = !1
    },
    colorPickerOnMouseMove: function () {
        if (!oPage.oPageColorPicker.bBlocked) {
            oPage.oPageColorPicker.iCursorXPos = event.clientX;
            oPage.oPageColorPicker.iCursorYPos = event.clientY;
            var a = event.clientX, b = event.clientY, c = window.innerWidth, e = window.innerHeight, f = 0, d = 0, f = a + 250 < c ? a + 20 + "px" : c - 230 + "px", d = b + 100 < e ? b + 20 + "px" : e - 80 + "px", a = getElem("devkits-toolbox");
            a.style.left = f;
            a.style.top = d;
            oPage.updateColor()
        }
    },
    colorPickerOnScroll: function () {
        clearTimeout(oPage.oPageColorPicker.iTimeoutId);
        oPage.oPageColorPicker.iTimeoutId = setTimeout(function () {
            oPage.snapshotViewport()
        }, 300)
    },
    colorPickerOnClick: function () {
        if (!oPage.oPageColorPicker.bBlocked) {
            oPage.oPageColorPicker.bBlocked = !0;
            var a = getElem("devkits-toolbox");
            a.addClass("expanded");
            a.style.width = "200px"
        }
    },
    snapshotViewport: function () {
        chrome.extension.sendRequest({msg: "snapshot"}, function (a) {
            var b = new Image;
            b.src = a.sDataUrl;
            b.onload = function () {
                oPage.oPageColorPicker.oCanvas.width = b.naturalWidth;
                oPage.oPageColorPicker.oCanvas.height = b.naturalHeight;
                oPage.oPageColorPicker.oCtx.drawImage(b, 0, 0);
                oPage.oPageColorPicker.bBlocked || oPage.updateColor()
            }
        })
    },
    updateColor: function () {

        if (oPage.oPageColorPicker.oCtx !== null) {
            var a = oPage.oPageColorPicker.oCtx.getImageData(oPage.oPageColorPicker.iCursorXPos, oPage.oPageColorPicker.iCursorYPos, 1, 1).data,
                a = "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")",
                b = oPage.colorToHex(a);
            // getElem("devkits-toolbox-color").style.backgroundColor = a + " !important";
            getElem("devkits-toolbox-color").style.backgroundColor = a;
            getElem("devkits-rgb-text").innerText = a;
            getElem("devkits-hex-text").innerText = b
        }
    },
    colorToHex: function (a) {
        var b =
            /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(a);
        return b ? "#" + (16777216 | b[1] << 16 | b[2] << 8 | b[3]).toString(16).toUpperCase().substr(1) : a
    },
    resumeColorInspecting: function () {
        oPage.oPageColorPicker.bBlocked = !1;
        var a = getElem("devkits-toolbox");
        a.removeClass("expanded");
        a.style.width = ""
    },
    removeColorPicker: function () {
        var a = getElem("devkits-background");
        a.parentNode.removeChild(a);
        document.removeEventListener("mousemove", this.colorPickerOnMouseMove, !1);
        document.removeEventListener("scroll", this.colorPickerOnScroll, !1);
        document.removeEventListener("click", this.colorPickerOnClick, !1);
        oPage.oPageColorPicker.bActivated = !1
    },
    formatSource: function (a) {
        function b(a) {
            a = a.replace(/(\b[^=\s]+)="([^"]*)"/g, function (b, f, d) {
                if (f == "href" || f == "src") d = '<a href="' + d + '" class="' + (a.charAt(0) == "a" ? "webkit-html-external-link" : "webkit-html-resource-link") + '">' + d + "</a>";
                return '<span class="webkit-html-attribute-name">' + f + '</span>="<span class="webkit-html-attribute-value">' + d + '</span>"'
            });
            return '<span class="webkit-html-tag">&lt;' + a +
                "&gt;</span>"
        }

        a = a.replace(/&/g, "&amp;");
        return a = a.replace(/<(?:((script|style)\b[^>]*)>([^]*?)<\/\2|(!--[^]*?--)|(\/?\b[^]*?))>/g, function (a, e, f, d, g, h) {
            if (g)return '<span class="webkit-html-comment">' + oPage.replaceLtGtSigns(a).replace(/\n/g, '</span>\n<span class="webkit-html-comment">') + "</span>";
            if (e)return b(e) + oPage.replaceLtGtSigns(d) + b("/" + f);
            return b(h)
        })
    },
    replaceLtGtSigns: function (a) {
        return a.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    },
    jsonformat:function () {
        var _this = this;

        var _htmlFragment = [
            '<div class="mod-json mod-contentscript"><div class="rst-item">',
            '<div id="formattingMsg">',
            '<svg id="spinner" width="16" height="16" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" version="1.1">',
            '<path d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a -100,-100 0 0,0 -70.711,-170.711 z" fill="#3d7fe6"></path>',
            '</svg>加载中...',
            '</div>',
            '<div id="jfCallbackName_start" class="callback-name"></div>',
            '<div id="jfContent"></div>',
            '<pre id="jfContent_pre"></pre>',
            '<div id="jfCallbackName_end" class="callback-name"></div>',
            '</div></div>'
        ].join('');

        /**
         * 从页面提取JSON文本
         * @return {*}
         * @private
         */
        var _getJsonText = function () {
            var pre = $('body>pre:eq(0)')[0] || {textContent: ""};
            var source = $.trim(pre.textContent);
            if (!source) {
                source = $.trim(document.body.textContent || '')
            }
            if (!source) {
                return false;
            }

            // 如果body的内容还包含HTML标签，肯定不是合法的json了
            // 如果是合法的json，也只可能有一个text节点
            var nodes = document.body.childNodes;
            var newSource = '';
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (nodes[i].nodeType == Node.TEXT_NODE) {
                    newSource += nodes[i].textContent;
                } else if (nodes[i].nodeType == Node.ELEMENT_NODE) {
                    var tagName = nodes[i].tagName.toLowerCase();
                    var html = $.trim(nodes[i].textContent);
                    // 如果是pre标签，则看内容是不是和source一样，一样则continue
                    if (tagName === 'pre' && html === source) {
                        continue;
                    } else if (nodes[i].offsetWidth === 0 || nodes[i].offsetHeight === 0 || !html) {
                        // 如果用户安装迅雷或者其他的插件，也回破坏页面结构，需要兼容一下
                        continue;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            return newSource || source;
        };

        /**
         * 此方法用于将Unicode码解码为正常字符串
         * @param {Object} text
         */
        var _uniDecode = function (text) {
            text = text.replace(/\\/g, "%").replace('%U', '%u').replace('%u0025', '%25');

            text = unescape(text.toString().replace(/%2B/g, "+"));
            var matches = text.match(/(%u00([0-9A-F]{2}))/gi);
            if (matches) {
                for (var matchid = 0; matchid < matches.length; matchid++) {
                    var code = matches[matchid].substring(1, 3);
                    var x = Number("0x" + code);
                    if (x >= 128) {
                        text = text.replace(matches[matchid], code);
                    }
                }
            }
            text = unescape(text.toString().replace(/%2B/g, "+"));

            return text;
        };

        /**
         * 执行format操作
         * @private
         */
        var _format = function () {
            var source = _getJsonText();
            if (!source) {
                return;
            }

            // JSONP形式下的callback name
            var funcName = null;
            // json对象
            var jsonObj = null;
            var newSource = '';

            // 下面校验给定字符串是否为一个合法的json
            try {
                // 再看看是不是jsonp的格式
                var reg = /^([\w\.]+)\(\s*([\s\S]*)\s*\)$/igm;
                var matches = reg.exec(source);
                if (matches != null) {
                    funcName = matches[1];
                    newSource = matches[2];
                    jsonObj = new Function("return " + newSource)();
                }
            } catch (ex) {
                return;
            }

            try {
                if (jsonObj == null || typeof jsonObj != 'object') {
                    jsonObj = new Function("return " + source)();

                    // 还要防止下面这种情况：  "{\"ret\":\"0\", \"msg\":\"ok\"}"
                    if (typeof jsonObj == "string") {
                        // 再来一次
                        jsonObj = new Function("return " + jsonObj)();
                    }
                }
            } catch (e) {
                return;
            }

            // 是json格式，可以进行JSON自动格式化
            if (jsonObj != null && typeof jsonObj == "object") {
                try {
                    // 要尽量保证格式化的东西一定是一个json，所以需要把内容进行JSON.stringify处理
                    newSource = JSON.stringify(jsonObj);
                    // 如果newSource的长度比原source长度短很多的话，猜测应该是格式化错了，需要撤销操作
                    // 这里一定要unicode decode一下，要不然会出现误判
                    if (newSource.length * 2 < (_uniDecode(source)).length) {
                        return;
                    }
                    // 直接replace掉所有\w之外的字符，再和原内容比较
                    var r_ns = newSource.replace(/[^\w]/gm, '').length;
                    var r_os = _uniDecode(source).replace(/[^\w]/gm, '').length;
                    // 允许内容产生1/20的误差
                    if (Math.abs(r_ns - r_os) > (r_ns + r_os) / 20) {
                        return;
                    }
                } catch (ex) {
                    // 通过JSON反解不出来的，一定有问题
                    return;
                }

                $('body').html(_htmlFragment);
                _this.toggleStyleSheet("/assets/scss/ui/tools-jsonformat-content.css", "devkits-tools-jsonformat-content");

                // 点击区块高亮
                $('#jfContent').delegate('.kvov', 'click', function (e) {
                    $('#jfContent .kvov').removeClass('x-outline');
                    $(this).removeClass('x-hover').addClass('x-outline');
                    if (!$(e.target).is('.kvov .e')) {
                        e.stopPropagation();
                    } else {
                        $(e.target).parent().trigger('click');
                    }
                }).delegate('.kvov', 'mouseover', function (e) {
                    $(this).addClass('x-hover');
                    return false;
                }).delegate('.kvov', 'mouseout', function (e) {
                    $(this).removeClass('x-hover');
                });

                JsonFormatEntrance.clear();
                JsonFormatEntrance.format(newSource);

                // 如果是JSONP格式的，需要把方法名也显示出来
                if (funcName != null) {
                    $('#jfCallbackName_start').html(funcName + '(');
                    $('#jfCallbackName_end').html(')');
                }
            }
        };


        $(function () {
        if (!/^filesystem\:/.test(location.href)) {
            _format();
        }
        });
    },
    init: function () {
        this.setUpListener();
        this.jsonformat();
    }
};
Element.prototype.hasClass = function (a) {
    return this.className.search("(^|\\s)" + a + "(\\s|$)") !== -1
};
Element.prototype.addClass = function (a) {
    this.hasClass(a) || (this.className += " " + a)
};
Element.prototype.removeClass = function (a) {
    this.className = this.className.replace(RegExp("(^|\\s)" + a + "(?:\\s|$)"), "$1")
};
function getElem(a) {
    return document.getElementById(a)
}
var oShortcuts = null, o = null;
window.addEventListener("keydown", function (a) {
    a.which === 27 && (oPage.oPageColorPicker.bActivated && (oPage.toggleStyleSheet("/assets/scss/ui/color-picked.css", "devkits-color-picker-css"), oPage.removeColorPicker(), chrome.extension.sendRequest({
        msg: "toggle-feature-state",
        feature: "display-color-picker"
    })), oPage.oPageRuler.bActivated && (oPage.toggleStyleSheet("/assets/scss/ui/ruler.css", "devkits-ruler-css"), oPage.removeRuler(), chrome.extension.sendRequest({
        msg: "toggle-feature-state",
        feature: "display-ruler"
    })));
    chrome.extension.sendRequest({msg: "get-shortcuts"}, function (b) {
        // console.log(b);
        oShortcuts = JSON.parse(b);
        for (var c in oShortcuts)if (b = oShortcuts[c], (window.navigator.platform.toLowerCase().indexOf("mac") !== -1 ? a.metaKey : a.ctrlKey) === b.ctrl && a.altKey === b.alt && a.shiftKey === b.shift && a.keyCode === b.code && (a.keyIdentifier || a.key) === b.identifier)switch (c) {
            case "view_all_styles":
                b = this.oPage.getCSS();
                (b.aEmbeddedCSS.length !== 0 || b.aExternalCSS.length !== 0) && chrome.extension.sendRequest({
                    msg: "create-tab", page: "assets/pages/view-css.html",
                    content: b
                });
                break;
            case "reload_css":
                this.oPage.reloadCSS();
                break;
            case "disable_all_styles":
                this.oPage.toggleAllStyles();
                chrome.extension.sendRequest({msg: "toggle-feature-state", feature: "disable-all-styles"});
                break;
            case "view_javascript":
                b = this.oPage.getJavaScript();
                (b.aEmbeddedScripts.length !== 0 || b.aExternalScripts.length !== 0) && chrome.extension.sendRequest({
                    msg: "create-tab",
                    page: "assets/pages/view-javascript.html",
                    content: b
                });
                break;
            case "view_generated_source":
                b = this.oPage.getGeneratedSource();
                chrome.extension.sendRequest({
                    msg: "create-tab",
                    page: "assets/pages/view-source.html", content: b
                });
                break;
            case "display_ruler":
                this.oPage.toggleRuler();
                chrome.extension.sendRequest({msg: "toggle-feature-state", feature: "display-ruler"});
                break;
            case "display_color_picker":
                this.oPage.toggleColorPicker(), chrome.extension.sendRequest({
                    msg: "toggle-feature-state",
                    feature: "display-color-picker"
                })
        }
    })
}, !1);
oPage.init();
