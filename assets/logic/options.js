var isMAC = /Mac OS/.test(navigator.userAgent), oModifierKeys = {
    sCtrlKeyLabel: isMAC ? "Cmd" : "Ctrl",
    sAltKeyLabel: isMAC ? "Opt" : "Alt",
    sShiftKeyLabel: "Shift"
}, aSavedShortcuts = [], oOptionsSaveButton = null, oOptionsResetButton = null, oShortcutsSaveButton = null, oShortcutsResetButton = null;
function init() {
    for (var a = 0, b = 0, c = 0, g = null, d = null, e = null, f = document.getElementsByTagName("nav")[0].getElementsByTagName("li"), h = document.getElementsByTagName("section"), a = 0, c = f.length; a < c; a++)f[a].onclick = function () {
        b = 0;
        for (c = f.length; b < c; b++)f[b].className = "";
        for (b = 0; g = h[b]; b++)g.className = "";
        this.className = "current";
        getElem("box-" + this.id).className = "current"
    };
    oOptionsSaveButton = getElem("accessibility-save-button");
    oOptionsResetButton = getElem("accessibility-reset-button");
    oShortcutsSaveButton = getElem("shortcuts-save-button");
    oShortcutsResetButton = getElem("shortcuts-reset-button");
    oOptionsSaveButton.addEventListener("click", saveOptions, !1);
    oOptionsResetButton.addEventListener("click", resetOptions, !1);
    oShortcutsSaveButton.addEventListener("click", saveShortcuts, !1);
    oShortcutsResetButton.addEventListener("click", resetShortcuts, !1);
    e = getElem("box-options").getElementsByTagName("input");
    for (a = 0; d = e[a]; a++)d.addEventListener("input", optionChanged, !1), d.addEventListener("change", optionChanged, !1);
    e = getElem("box-keyboard-shortcuts").getElementsByTagName("input");
    for (a = 0; d = e[a]; a++)d.addEventListener("keydown", filterKey, !1);
    retrieveOptions();
    retrieveShortcuts()
}
function optionChanged() {
    oOptionsSaveButton.disabled = !1;
    oOptionsResetButton.disabled = !1
}
function filterKey(a) {
    var b = [], c = a.keyIdentifier;
    isMAC && a.metaKey && b.push(oModifierKeys.sCtrlKeyLabel);
    !isMAC && a.ctrlKey && b.push(oModifierKeys.sCtrlKeyLabel);
    a.altKey && b.push(oModifierKeys.sAltKeyLabel);
    a.shiftKey && b.push(oModifierKeys.sShiftKeyLabel);
    if (c !== "U+0009") this.className = "", (a.which > 96 && a.which < 123 || a.which > 64 && a.which < 91) && c.substring(0, 2) === "U+" ? b.push(String.fromCharCode(a.which).toUpperCase()) : c === "Alt" || c === "Meta" || c === "Control" || c === "Shift" ? (b.push(""), this.className = "invalid") : c.substring(0,
                2) !== "U+" && b.push(c), aSavedShortcuts[this.id] = {
        ctrl: isMAC ? a.metaKey : a.ctrlKey,
        alt: a.altKey,
        shift: a.shiftKey,
        code: a.keyCode,
        identifier: a.keyIdentifier
    }, this.value = b.join("-"), a.preventDefault();
    oShortcutsSaveButton.disabled = !1;
    oShortcutsResetButton.disabled = !1
}
function saveOptions() {
    var a = {
        url_validate_html: getElem("validate-html").value,
        url_validate_css: getElem("validate-css").value,
        url_validate_links: getElem("validate-links").value,
        url_validate_feed: getElem("validate-feed").value,
        url_validate_accessibility: getElem("validate-accessibility").value,
        mode_validate_local_html: {
            show_source: getElem("show-source").checked,
            show_outline: getElem("show-outline").checked,
            verbose_output: getElem("verbose-output").checked
        },
        mode_validate_local_css: getElem("css2").checked ? "css2" : "css3"
    };
    window.localStorage.options = JSON.stringify(a);
    var b = getElem("accessibility-save-status");
    b.style.setProperty("-webkit-transition", "opacity 0s ease-in");
    b.style.opacity = 1;
    setTimeout(function () {
        b.style.setProperty("-webkit-transition", "opacity 1s ease-in");
        b.style.opacity = 0
    }, 1E3);
    oOptionsSaveButton.disabled = !0;
    oOptionsResetButton.disabled = !0
}
function resetOptions() {
    retrieveOptions()
}
function saveShortcuts() {
    var a = null, b = !1;
    oInputs = getElem("box-keyboard-shortcuts").getElementsByTagName("input");
    for (var c = 0; oInput = oInputs[c]; c++)if (oInput.className === "invalid") a = getElem("invalid-shortcut-" + oInput.id), a.style.setProperty("-webkit-transition", "opacity 0s ease-in"), a.style.opacity = 1, b = !0;
    b ? setTimeout(function () {
            for (c = 0; oInput = oInputs[c]; c++)a = getElem("invalid-shortcut-" + oInput.id), a.style.setProperty("-webkit-transition", "opacity 1s ease-in"), a.style.opacity = 0
        }, 1E3) : (window.localStorage.shortcuts =
            JSON.stringify({
                view_all_styles: aSavedShortcuts["view-all-styles"],
                reload_css: aSavedShortcuts["reload-css"],
                disable_all_styles: aSavedShortcuts["disable-all-styles"],
                view_javascript: aSavedShortcuts["view-javascript"],
                view_generated_source: aSavedShortcuts["view-generated-source"],
                display_ruler: aSavedShortcuts["display-ruler"],
                display_color_picker: aSavedShortcuts["display-color-picker"]
            }), a = getElem("shortcuts-save-status"), a.style.setProperty("-webkit-transition", "opacity 0s ease-in"), a.style.opacity = 1, setTimeout(function () {
            a.style.setProperty("-webkit-transition",
                "opacity 1s ease-in");
            a.style.opacity = 0
        }, 1E3), oShortcutsSaveButton.disabled = !0, oShortcutsResetButton.disabled = !0)
}
function resetShortcuts() {
    for (var a = getElem("box-keyboard-shortcuts").getElementsByTagName("input"), b = 0, c; c = a[b]; b++)c.className = "";
    retrieveShortcuts()
}
function retrieveOptions() {
    oOptionsSaveButton.disabled = !0;
    oOptionsResetButton.disabled = !0;
    if (!window.localStorage.options || !JSON.parse(window.localStorage.options).url_validate_html) {
        var a = getDefaultOptions();
        window.localStorage.options = JSON.stringify(a)
    }
    a = JSON.parse(window.localStorage.options);
    getElem("validate-html").value = a.url_validate_html;
    getElem("validate-css").value = a.url_validate_css;
    getElem("validate-links").value = a.url_validate_links;
    getElem("validate-feed").value = a.url_validate_feed;
    getElem("validate-accessibility").value =
        a.url_validate_accessibility;
    getElem("show-source").checked = a.mode_validate_local_html.show_source;
    getElem("show-outline").checked = a.mode_validate_local_html.show_outline;
    getElem("verbose-output").checked = a.mode_validate_local_html.verbose_output;
    getElem(a.mode_validate_local_css).checked = !0
}
function retrieveShortcuts() {
    oShortcutsSaveButton.disabled = !0;
    oShortcutsResetButton.disabled = !0;
    if (!window.localStorage.shortcuts) {
        var a = getDefaultShortcuts();
        window.localStorage.shortcuts = JSON.stringify(a)
    }
    a = JSON.parse(window.localStorage.shortcuts);
    getElem("view-all-styles").value = getHumanReadableShortcut(a.view_all_styles);
    getElem("reload-css").value = getHumanReadableShortcut(a.reload_css);
    getElem("disable-all-styles").value = getHumanReadableShortcut(a.disable_all_styles);
    getElem("view-javascript").value = getHumanReadableShortcut(a.view_javascript);
    getElem("view-generated-source").value = getHumanReadableShortcut(a.view_generated_source);
    getElem("display-ruler").value = getHumanReadableShortcut(a.display_ruler);
    getElem("display-color-picker").value = getHumanReadableShortcut(a.display_color_picker);
    aSavedShortcuts["view-all-styles"] = a.view_all_styles;
    aSavedShortcuts["reload-css"] = a.reload_css;
    aSavedShortcuts["disable-all-styles"] = a.disable_all_styles;
    aSavedShortcuts["view-javascript"] = a.view_javascript;
    aSavedShortcuts["view-generated-source"] = a.view_generated_source;
    aSavedShortcuts["display-ruler"] = a.display_ruler;
    aSavedShortcuts["display-color-picker"] = a.display_color_picker
}
function getHumanReadableShortcut(a) {
    var b = [];
    a.ctrl && b.push(oModifierKeys.sCtrlKeyLabel);
    a.alt && b.push(oModifierKeys.sAltKeyLabel);
    a.shift && b.push(oModifierKeys.sShiftKeyLabel);
    a.identifier.substring(0, 2) === "U+" ? b.push(String.fromCharCode(a.code).toUpperCase()) : b.push(a.identifier);
    return b.join("-")
}
function getDefaultOptions() {
    return {
        url_validate_html: "http://validator.w3.org/check?verbose=1&uri=",
        url_validate_css: "http://jigsaw.w3.org/css-validator/validator?profile=css21&uri=",
        url_validate_links: "http://validator.w3.org/checklink?check=Check&hide_type=all&summary=on&uri=",
        url_validate_links: "http://validator.w3.org/checklink?uri=",
        url_validate_feed: "http://validator.w3.org/feed/check.cgi?url=",
        url_validate_accessibility: "http://wave.webaim.org/report#/",
        url_validate_accessibility: "http://achecker.ca/checkacc.php?id=2f4149673d93b7f37eb27506905f19d63fbdfe2d&guide=WCAG2-L2&output=html&uri=",
        mode_validate_local_html: {
            show_source: !0, show_outline: !1,
            verbose_output: !0
        },
        mode_validate_local_css: "css2"
    }
}
function getDefaultShortcuts() {
    return {
        view_all_styles: {ctrl: !1, alt: !1, shift: !1, code: 113, identifier: "F2"},
        reload_css: {ctrl: !1, alt: !1, shift: !1, code: 120, identifier: "F9"},
        disable_all_styles: {ctrl: !0, alt: !1, shift: !0, code: 83, identifier: "U+0053"},
        view_javascript: {ctrl: !1, alt: !1, shift: !1, code: 115, identifier: "F4"},
        view_generated_source: {ctrl: !0, alt: !1, shift: !0, code: 85, identifier: "U+0055"},
        display_ruler: {ctrl: !1, alt: !1, shift: !1, code: 118, identifier: "F7"},
        display_color_picker: {
            ctrl: !1, alt: !1, shift: !1, code: 119,
            identifier: "F8"
        }
    }
}
function getElem(a) {
    return document.getElementById(a)
}
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
$(function(){
    var newBody = Mustache.to_html($('body').html(), chrome.i18n.getMessage);
    $('body').html($(newBody));
    init();
});
