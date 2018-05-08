chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        displayColors(msg.sURL, msg.aColors);
        port.disconnect();
    });
});
function displayColors(sURL, aColors) {
    var l = aColors.length,
        oTitle = document.getElementById('title'),
        oColors = document.getElementById('colors'),
        oLi = null, oStrip = null, oInfo = null,
        oRGB = null, oHEX = null;

    document.title = 'Colors - ' + sURL;
    oTitle.innerText = l + ' color' + (l > 1 ? 's' : '');
    aColors.sort();

    for (var i = 0; i < l; i++) {
        oLi = document.createElement('li');
        oStrip = document.createElement('div');
        oInfo = document.createElement('div');
        oRGB = document.createElement('p');
        oHEX = document.createElement('p');

        oStrip.className = 'strip';
        oStrip.style.backgroundColor = aColors[i];

        oInfo.className = 'info';
        oRGB.innerText = aColors[i];
        oHEX.innerText = colorToHex(aColors[i]);

        oLi.appendChild(oStrip);
        oInfo.appendChild(oRGB);
        oInfo.appendChild(oHEX);
        oLi.appendChild(oInfo);
        oColors.appendChild(oLi);
    }
}
function colorToHex(c) {
    var r = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
    return r? '#' + (1 << 24 | r[1] << 16 | r[2] << 8 | r[3]).toString(16).toUpperCase().substr(1): c;
}
