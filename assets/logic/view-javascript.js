chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        displayJavaScript(msg.sURL, msg.aEmbeddedScripts, msg.aExternalScripts);
        port.disconnect();
    });
});
function displayJavaScript(sURL, aEmbeddedScripts, aExternalScripts) {
    document.title = 'JavaScript - ' + sURL;
    getElem('collapse-all').onclick = function() {toggleAll('collapse')};
    getElem('expand-all').onclick = function() {toggleAll('expand')};
    getElem('beautify-javascript').onclick = beautifyJavaScript;

    var l = aEmbeddedScripts.length;
    if (l > 0) {
        for (var i = 0, sContent = ''; i < l; i++) {
            sContent += aEmbeddedScripts[i].content + (i+1 !== l? '\n': '');
        }
        addScript('Embedded JavaScript', sContent);
    }

    for (i = 0; i < aExternalScripts.length; ++i) {
        var oRequest = new XMLHttpRequest();
        oRequest.open('get', aExternalScripts[i].src, false);
        oRequest.send(null);
        addScript(aExternalScripts[i].src, oRequest.responseText, true);
    }
}
function addScript(sTitle, sContent, bExternal) {
    var oDiv1 = document.createElement('div'),
        oLink = document.createElement('a'),
        oSpan = document.createElement('span'),
        oDiv2 = document.createElement('div'),
        oPre = document.createElement('pre');

    if (bExternal) {
        var oLink2 = document.createElement('a');
        oLink2.href = sTitle;
        oLink2.target = '_blank';
        oLink2.appendChild(document.createTextNode(sTitle));
        oSpan.appendChild(oLink2);
    } else {
        oSpan.innerText = sTitle;
    }
    oDiv1.className = 'script';
    oLink.onclick = toggle;
    oSpan.className = 'title';
    oDiv2.className = 'source';
    oDiv2.style.display = 'block';

    oDiv1.appendChild(oLink);
    oDiv1.appendChild(oSpan);
    oPre.className = 'prettyprint';
    oPre.appendChild(document.createTextNode(sContent));
    oDiv2.appendChild(oPre);
    oDiv1.appendChild(oDiv2);
    getElem('main-content').appendChild(oDiv1);
}
function toggle(oEvent) {
    var oLink = oEvent.target,
        oSource = oEvent.target.nextSibling;

    while (oSource.className !== 'source') {
        if (!oSource) return false;
        oSource = oSource.nextSibling;
    }

    if (oSource.style && oSource.style.display === 'block') {
        oSource.style.display = 'none';
        oLink.style.backgroundImage = 'url(../img/tools/toggle-expand.png)';
    } else {
        oSource.style.display = 'block';
        oLink.style.backgroundImage = 'url(../img/tools/toggle-collapse.png)';
    }
    return false;
}
function toggleAll(s) {
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; i++) {
        if (!a[i].href)
            a[i].style.backgroundImage = 'url(../img/tools/toggle-' + ((s === 'collapse') ? 'expand' : 'collapse') + '.png)';
    }
    var p = document.getElementsByClassName('source');
    for (i = 0; i < p.length; i++) {
        p[i].style.display = (s === 'collapse') ? 'none' : 'block';
    }
}
function beautifyJavaScript(oEvent) {
    var oPre = null,
        oPreList = document.getElementsByTagName('pre');
    for (var i = 0, l = oPreList.length; i < l; i++) {
        oPre = oPreList[i];
        oPre.innerText = js_beautify(oPre.innerText); // reindent
    }
    prettyPrint(); // syntax highlighting
    oEvent.target.disabled = true;
}
function getElem(o) {return document.getElementById(o);}