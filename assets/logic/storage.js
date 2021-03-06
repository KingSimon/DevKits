var oSelectedTabs = {
    stylesheets: [],
    forms: [],
    images: [],
    miscellaneous: [],
    resize: [],
    accessibility: []
},
    aNavItems = ["stylesheets", "forms", "images", "miscellaneous", "tools","resize", "accessibility"],
    aBoxItems = ["tools-codestandard", "tools-ajaxdebugger", "disable-all-styles", "disable-inline-styles", "disable-embedded-styles", "disable-linked-style-sheets", "show-passwords", "remove-maxlength-attributes", "hide-all-images", "hide-background-images", "show-alt-text-note", "show-dimensions-note", "show-paths-note", "display-color-picker", "display-ruler", "topographic-view"];
initStorage();
function initStorage() {
    for (var a = 0; a < aNavItems.length; a++)localStorage.setItem(aNavItems[a], "");
    for (a = 0; a < aBoxItems.length; a++)localStorage.setItem(aBoxItems[a], "")
}
function clearTabStorage(a) {
    var b, c = aNavItems.length;
    for (b = 0; b < c; b++)oStorage.del(aNavItems[b], a);
    c = aBoxItems.length;
    for (b = 0; b < c; b++)oStorage.del(aBoxItems[b], a)
}
function getFeatureState(a, b) {
    return oStorage.into(a, b)
}
function setFeatureState(a, b, c) {
    c ? oStorage.del(a, b) : oStorage.add(a, b)
}
function toggleFeatureState(a, b) {
    oStorage.into(a, b) ? oStorage.del(a, b) : oStorage.add(a, b)
}
var oStorage = {
    add: function (a, b) {
        var c = localStorage.getItem(a).split(",");
        c.unshift(b);
        localStorage.setItem(a, c)
    }, del: function (a, b) {
        for (var c = localStorage.getItem(a).split(","), d = 0; d < c.length; d++)c[d] == b && c.splice(d, 1);
        localStorage.setItem(a, c)
    }, into: function (a, b) {
        for (var c = localStorage.getItem(a).split(","), d = 0; d < c.length; d++)if (c[d] == b)return !0
    }, toggleFeature: function (a, b) {
        return this.into(a, b) ? (this.del(a, b), !0) : (this.add(a, b), !1)
    }
};
chrome.tabs.onUpdated.addListener(function (a, b) {
    b.status === "loading" && clearTabStorage(a)
});
chrome.tabs.onRemoved.addListener(function (a) {
    clearTabStorage(a)
});