var oCurrentTab = null, iNotificationTimeoutId = null, oOptions = null, oBkgPage = chrome.extension.getBackgroundPage();
function init() {
    var a = {
        "view-css": viewCSS,
        "reload-css": reloadCSS,
        "disable-all-styles": disableAllStyles,
        "disable-inline-styles": disableInlineStyles,
        "disable-embedded-styles": disableEmbeddedStyles,
        "disable-linked-style-sheets": disableLinkedStyleSheets,
        "show-used-colors": showUsedColors,
        "show-passwords": showPasswords,
        "remove-maxlength-attributes": removeMaxlengthAttributes,
        "convert-select-elements-to-text-inputs": convertSelectElementsToTextInputs,
        "show-hidden-elements": showHiddenElements,
        "clear-radio-buttons": clearRadioButtons,
        "enable-form-elements": enableFormElements,
        "convert-gets-to-posts": convertFormMethods,
        "convert-posts-to-gets": convertFormMethods,
        "view-images-information": viewImagesInformation,
        "hide-all-images": hideAllImages,
        "hide-background-images": hideBackgroundImages,
        "show-alt-text-note": showAltTextNote,
        "show-dimensions-note": showDimensionsNote,
        "show-paths-note": showPathsNote,
        "view-javascript": viewJavaScript,
        "view-generated-source": viewGeneratedSource,
        "display-ruler": displayRuler,
        "display-color-picker": displayColorPicker,
        "topographic-view": topographicView,
        "remove-cookies": removeCookies,
        "display-window-size": displayWindowSize,
        "view-responsive-layouts": viewResponsiveLayouts,
        "resize-320x480": resizeBrowser,
        "resize-640x480": resizeBrowser,
        "resize-480x800": resizeBrowser,
        "resize-800x600": resizeBrowser,
        "resize-1024x768": resizeBrowser,
        "resize-1280x800": resizeBrowser,
        "resize-1280x1024": resizeBrowser,
        "resize-1366x768": resizeBrowser,
        "resize-1440x900": resizeBrowser,
        "resize-1600x900": resizeBrowser,
        "custom-size": customSize,
        "validate-html": validateHTML,
        "validate-css": validateCSS,
        "validate-links": checkLinks,
        "validate-feed": validateFeed,
        "validate-accessibility": validateAccessibility,
        "validate-local-html": validateLocalHTML,
        "validate-local-css": validateLocalCSS,
        "tools-encode-decode": toolsEncodeDecode,
        "tools-json-format": toolsJsonFormat,
        "tools-code-beautify": toolsCodeBeautify,
        "tools-qrcode": toolsQRCode,
        "tools-regexp": toolsRegexp,
        "tools-timestamp": toolsTimestampFormat,
        "tools-imagebase64": toolsImageBase64,
        "tools-codestandard": toolsCodeStandard,
        "tools-web-performance": toolsWebPerformance,
        "tools-ajaxdebugger": toolsAjaxDebugger,
        "open-options": openOptions
    }, b;
    for (b in a)getElem(b).onclick = a[b];
    chrome.tabs.getSelected(null, function (a) {
        oCurrentTab = a;
        for (var b = document.getElementsByTagName("nav")[0].getElementsByTagName("li"), a = 0, e = b.length; a < e; a++)
            if(b[a].id.substr(0,3) == "tab"){
                b[a].onclick = function () {
                    for (var a = 0; a < b.length; a++)if(b[a].id.substr(0,3) == "tab")getElem(b[a].id).removeClass("current"), getElem(b[a].id.substr(4)).removeClass("current");
                    getElem(this.id).addClass("current");
                    getElem(this.id.substr(4)).addClass("current");
                    for (a = 0; a < oBkgPage.aNavItems.length; a++)oBkgPage.oStorage.del(oBkgPage.aNavItems[a], oCurrentTab.id);
                    oBkgPage.oStorage.add(this.id.substr(4), oCurrentTab.id)
                };
            }
        for (var f = !1, a = 0; a < oBkgPage.aNavItems.length; a++)if (e = getElem(oBkgPage.aNavItems[a]), oBkgPage.oStorage.into(oBkgPage.aNavItems[a], oCurrentTab.id)) {
            getElem("tab-" + e.id).addClass("current");
            e.addClass("current");
            f = !0;
            break
        }
        f || (getElem("tab-stylesheets").addClass("current"), getElem("stylesheets").addClass("current"));
        for (a = 0; a < oBkgPage.aBoxItems.length; a++)oBkgPage.oStorage.into(oBkgPage.aBoxItems[a],
            oCurrentTab.id) && getElem(oBkgPage.aBoxItems[a]).addClass("activated")
    });
    oOptions = oBkgPage.retrieveOptions()
}

function toolsEncodeDecode() {
    openTab("assets/pages/tools-endecode.html");
}
function toolsJsonFormat() {
    openTab("assets/pages/tools-jsonformat.html");
}
function toolsCodeBeautify() {
    openTab("assets/pages/tools-codebeautify.html");
}
function toolsQRCode() {
    openTab("assets/pages/tools-qrcode.html");
}
function toolsRegexp() {
    openTab("assets/pages/tools-regexp.html");
}
function toolsTimestampFormat() {
    openTab("assets/pages/tools-timestamp.html");
}
function toolsImageBase64() {
    openTab("assets/pages/tools-imagebase64.html");
}
function toolsCodeStandard() {
    if (isSupportedURL() && fileSchemeAllowed(!1)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id);
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "toggleCodeStandard", bActivated: b}, function () {
            oBkgPage.setFeatureState(a.id, oCurrentTab.id, b);
            b ? a.removeClass("activated") : (a.addClass("activated"), window.close())
        })
    }
}
function toolsWebPerformance() {
    isSupportedURL() && fileSchemeAllowed(!1) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "getWpoInfo"}, function (a) {
        oBkgPage.createTab("assets/pages/tools-performance.html", a)
    })
}
function toolsAjaxDebugger() {
    toggleFeature(this, "toggleAjaxDebugger");
}
function openOptions() {
    openTab("assets/pages/options.html");
}
function viewResponsiveLayouts() {
    if(isSupportedURL() && fileSchemeAllowed(!1)){
        var data = {};
        data.layouts = [
            {description:"Mobile portrait",width:320,height:480},
            {description:"Mobile landscape",width:480,height:320},
            {description:"Small tablet portrait",width:600,height:800},
            {description:"Small tablet landscape",width:800,height:600},
            {description:"Tablet portrait",width:768,height:1024},
            {description:"Tablet landscape ",width:1024,height:768}
            ];


        oBkgPage.createTab("assets/pages/view-responsive-layouts.html", data);
    }
}
function viewCSS() {
    isSupportedURL() && fileSchemeAllowed(!1) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "getCSS"}, function (a) {
        a.aEmbeddedCSS.length === 0 && a.aExternalCSS.length === 0 ? showNotification(i18n("msg_no_style_sheet_found"), "green") : oBkgPage.createTab("assets/pages/view-css.html", a)
    })
}
function reloadCSS() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "reloadCSS"}, function (b) {
            a = b.iCount ? i18n("msg_linked_css_file_reload", b.iCount, (b.iCount > 1 ? "S" : "")) : i18n("msg_no_linked_css_file_found");
            showNotification(a, "green")
        })
    }
}
function disableAllStyles() {
    toggleFeature(this, "toggleAllStyles")
}
function disableInlineStyles() {
    toggleFeature(this, "toggleInlineStyles")
}
function disableEmbeddedStyles() {
    toggleFeature(this, "toggleEmbeddedStyles")
}
function disableLinkedStyleSheets() {
    toggleFeature(this, "toggleLinkedStyleSheets")
}
function showUsedColors() {
    isSupportedURL() && fileSchemeAllowed(!0) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "getUsedColors"}, function (a) {
        oBkgPage.createTab("assets/pages/show-used-colors.html", a)
    })
}
function showPasswords() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id), c = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "showPasswords", bActivated: b}, function (d) {
            b ? (oBkgPage.setFeatureState(a.id, oCurrentTab.id, b), a.removeClass("activated")) : (d.iCount ? (a.addClass("activated"),
                        oBkgPage.setFeatureState(a.id, oCurrentTab.id, b),
                        c = i18n("msg_password_field_shown", d.iCount, (d.iCount > 1 ? "S" : ""))): c = i18n("msg_no_password_field_found"),
                    showNotification(c, "green"))
        })
    }
}
function removeMaxlengthAttributes() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id), c = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "removeMaxlengthAttributes", bActivated: b}, function (d) {
            b ? (oBkgPage.setFeatureState(a.id, oCurrentTab.id, b), a.removeClass("activated")) : (d.iCount ? (a.addClass("activated"),
                        oBkgPage.setFeatureState(a.id, oCurrentTab.id, b),
                        c = i18n("msg_maxlength_attribute_removed", d.iCount, (d.iCount > 1 ? "S" : ""))): c = i18n("msg_no_maxlength_attribute_found"),
                    showNotification(c, "green"))
        })
    }
}
function convertSelectElementsToTextInputs() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "convertSelectElementsToTextInputs"}, function (b) {
            a = b.iCount ? i18n("msg_select_element_converted", b.iCount, (b.iCount > 1 ? "S" : "")) : i18n("msg_no_select_element_found");
            showNotification(a, "green")
        })
    }
}
function showHiddenElements() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "showHiddenElements"}, function (b) {
            a = b.iCount ? i18n("msg_hidden_input_shown", b.iCount, (b.iCount > 1 ? "S" : "")) : i18n("msg_no_hidden_input_found");
            showNotification(a, "green")
        })
    }
}
function clearRadioButtons() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "clearRadioButtons"}, function (b) {
            a = b.iCount ? i18n("msg_radio_button_cleared", b.iCount, (b.iCount > 1 ? "S" : "")) : i18n("msg_no_radio_button_found");
            showNotification(a, "green")
        })
    }
}
function enableFormElements() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "enableFormElements"}, function (b) {
            a = b.iCount ? i18n("msg_element_endabled", b.iCount, (b.iCount > 1 ? "S" : "")) : i18n("msg_no_disabled_readonly_found");
            showNotification(a, "green")
        })
    }
}
function convertFormMethods() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = null;
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "convertFormMethods", sElementId: this.id}, function (b) {
            a = b.iCount ? i18n("msg_form_converted", b.iCount, (b.iCount > 1 ? "S" : "")) : i18n("msg_no_form_found");
            showNotification(a, "green")
        })
    }
}
function viewImagesInformation() {
    isSupportedURL() && fileSchemeAllowed(!1) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "getImages"}, function (a) {
        a.aImages.length === 0 ? showNotification(i18n("msg_no_image_found"), "green") : oBkgPage.createTab("assets/pages/view-images-information.html", a)
    })
}
function hideAllImages() {
    toggleFeature(this, "hideAllImages")
}
function hideBackgroundImages() {
    toggleFeature(this, "hideBackgroundImages")
}
function showAltTextNote() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id);
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "showNote", sType: "alt", bActivated: b}, function () {
            oBkgPage.setFeatureState(a.id, oCurrentTab.id, b);
            b ? a.removeClass("activated") : a.addClass("activated")
        })
    }
}
function showDimensionsNote() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id);
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "showNote", sType: "dimensions", bActivated: b}, function () {
            oBkgPage.setFeatureState(a.id, oCurrentTab.id, b);
            b ? a.removeClass("activated") : a.addClass("activated")
        })
    }
}
function showPathsNote() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id);
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "showNote", sType: "paths", bActivated: b}, function () {
            oBkgPage.setFeatureState(a.id, oCurrentTab.id, b);
            b ? a.removeClass("activated") : a.addClass("activated")
        })
    }
}
function viewJavaScript() {
    isSupportedURL() && fileSchemeAllowed(!1) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "getJavaScript"}, function (a) {
        a.aEmbeddedScripts.length === 0 && a.aExternalScripts.length === 0 ? showNotification(i18n("msg_no_script_found"), "green") : oBkgPage.createTab("assets/pages/view-javascript.html", a)
    })
}
function viewGeneratedSource() {
    isSupportedURL() && fileSchemeAllowed(!0) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "getGeneratedSource"}, function (a) {
        oBkgPage.createTab("assets/pages/view-source.html", a)
    })
}
function displayRuler() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id);
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "displayRuler", bActivated: b}, function () {
            oBkgPage.setFeatureState(a.id, oCurrentTab.id, b);
            b ? a.removeClass("activated") : (a.addClass("activated"), window.close())
        })
    }
}
function displayColorPicker() {
    if (isSupportedURL() && fileSchemeAllowed(!1)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id);
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "displayColorPicker", bActivated: b}, function () {
            oBkgPage.setFeatureState(a.id, oCurrentTab.id, b);
            b ? a.removeClass("activated") : (a.addClass("activated"), window.close())
        })
    }
}
function topographicView() {
    if (isSupportedURL() && fileSchemeAllowed(!0)) {
        var a = this, b = oBkgPage.getFeatureState(a.id, oCurrentTab.id);
        chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "topographicView", bActivated: b}, function () {
            oBkgPage.setFeatureState(a.id, oCurrentTab.id, b);
            b ? a.removeClass("activated") : a.addClass("activated")
        })
    }
}
function removeCookies() {
    chrome.cookies.getAll({url: oCurrentTab.url}, function (a) {
        var b = null, b = 0, c, d = null;
        for (c in a)chrome.cookies.remove({url: oCurrentTab.url, name: a[c].name}), b++;
        d = b ? i18n("msg_cookie_removed", b, (b > 1 ? "S" : "")) : i18n("msg_no_cookie_found");
        showNotification(d, "green")
    })
}
function displayWindowSize() {
    isSupportedURL() && fileSchemeAllowed(!0) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "getWindowSize"}, function (a) {
        var b = i18n("msg_display_window_size", a.outerWidth, a.outerHeight, a.innerWidth, a.innerHeight);
        showNotification(b, "green")
    })
}
function resizeBrowser() {
    var a = this.id.replace(/resize-/, "").split("x");
    chrome.windows.getCurrent(function (b) {
        chrome.windows.update(b.id, {width: parseInt(a[0], 10), height: parseInt(a[1], 10)}, function () {
            window.close()
        })
    })
}
function customSize() {
    var a = parseInt(getElem("custom-size-width").value, 10), b = parseInt(getElem("custom-size-height").value, 10);
    chrome.windows.getCurrent(function (c) {
        chrome.windows.update(c.id, {width: parseInt(a, 10), height: parseInt(b, 10)}, function () {
            window.close()
        })
    })
}
function validateHTML() {
    isSupportedURL() && fileSchemeAllowed(!1) && openTab(oOptions.url_validate_html + oCurrentTab.url)
}
function validateCSS() {
    isSupportedURL() && fileSchemeAllowed(!1) && openTab(oOptions.url_validate_css + oCurrentTab.url)
}
function checkLinks() {
    isSupportedURL() && fileSchemeAllowed(!1) && openTab(oOptions.url_validate_links + oCurrentTab.url)
}
function validateFeed() {
    isSupportedURL() && fileSchemeAllowed(!1) && openTab(oOptions.url_validate_feed + oCurrentTab.url)
}
function validateAccessibility() {
    isSupportedURL() && fileSchemeAllowed(!1) && openTab(oOptions.url_validate_accessibility + oCurrentTab.url)
}
function validateLocalHTML() {
    isSupportedURL() && fileSchemeAllowed(!1) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "retrieveHTML"}, function (a) {
        oBkgPage.createTab("assets/pages/validate-local-html.html", a)
    })
}
function validateLocalCSS() {
    isSupportedURL() && fileSchemeAllowed(!1) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: "retrieveCSS"}, function (a) {
        oBkgPage.createTab("assets/pages/validate-local-css.html", a)
    })
}
function isSupportedURL() {
    if (oCurrentTab.url.substr(0, 36) === "https://chrome.google.com/extensions")
        return showNotification(i18n("msg_no_work_chrome_extension"), "red"), !1;
    else if (oCurrentTab.url.substr(0, 34) === "https://chrome.google.com/webstore")
        return showNotification(i18n("msg_no_work_chrome_store"), "red"), !1;
    return !0
}
function fileSchemeAllowed(a) {
    if (a && oCurrentTab.url.substr(0, 7) === "file://")return !0; else if (oCurrentTab.url.match(/^https?:\/\//i))return !0;
    showNotification(i18n("msg_no_work_url_scheme"), "red");
    return !1
}
function openTab(a) {
    chrome.tabs.create({url: a, index: oCurrentTab.index + 1})
}
function showNotification(a, b) {
    var c = getElem("notification");
    c.innerText = a;
    c.style.display = "block";
    c.className = b;
    clearTimeout(iNotificationTimeoutId);
    iNotificationTimeoutId = setTimeout("getElem('notification').style.display='none';", 3E3)
}
function toggleFeature(a, b) {
    isSupportedURL() && fileSchemeAllowed(!0) && chrome.tabs.sendRequest(oCurrentTab.id, {sMethod: b}, function () {
        oBkgPage.toggleFeatureState(a.id, oCurrentTab.id);
        a.toggleClass("activated")
    })
}
Element.prototype.hasClass = function (a) {
    return this.className.search("(^|\\s)" + a + "(\\s|$)") !== -1
};
Element.prototype.addClass = function (a) {
    this.hasClass(a) || (this.className += " " + a)
};
Element.prototype.removeClass = function (a) {
    this.className = this.className.replace(RegExp("(^|\\s)" + a + "(?:\\s|$)"), "$1")
};
Element.prototype.toggleClass = function (a) {
    this.hasClass(a) ? this.removeClass(a) : this.addClass(a)
};
function getElem(a) {
    return document.getElementById(a)
}
// document.addEventListener("DOMContentLoaded", init, !1);
function i18n() {
    var $key = arguments[0];
    var msg = chrome.i18n.getMessage($key);
    if (arguments.length > 1) {

    }
    for (var i = 1; i < arguments.length; i++) {
        msg = msg.replace("%" + i, arguments[i]);
    }
    return msg;
}
$(function () {
    var newBody = Mustache.to_html($('body').html(), chrome.i18n.getMessage);
    $('body').html($(newBody));
    init();
});
