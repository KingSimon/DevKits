chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log(msg);
    displayCSS(msg.sURL, msg.aEmbeddedCSS, msg.aExternalCSS);
    port.disconnect();
  });
});
function displayCSS(sURL, aEmbeddedCSS, aExternalCSS) {
  document.title = 'CSS - ' + sURL;
  getElem('collapse-all').onclick = function() {toggleAll('collapse')};
  getElem('expand-all').onclick = function() {toggleAll('expand')};
  getElem('beautify-css').onclick = beautifyCSS;

  var l = aEmbeddedCSS.length;
  if (l > 0) {
    for (var i = 0, sContent = ''; i < l; i++) {
      sContent += aEmbeddedCSS[i] + (i+1 !== l? '\n': '');
    }
    addStyles('Embedded CSS', sContent);
  }

  for (i = 0; i < aExternalCSS.length; ++i) {
    var oRequest = new XMLHttpRequest();
    oRequest.open('get', aExternalCSS[i], false);
    oRequest.send(null);
    addStyles(aExternalCSS[i], oRequest.responseText, true);
  }
}
function addStyles(sTitle, sContent, bExternal) {
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
  oDiv1.className = 'styles';
  oLink.onclick = toggle;
  oSpan.className = 'title';
  oDiv2.className = 'source';
  oDiv2.style.display = 'block';

  oDiv1.appendChild(oLink);
  oDiv1.appendChild(oSpan);
  oPre.className = 'prettyprint lang-css';
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
function reindentCSS() {
  var s = null;
  var p = document.getElementsByTagName('pre');
  for (var i = 0, l = p.length; i < l; i++) {
    s = p[i].innerText;
    // remove all tabs
    s = s.replace(/\t+/ig,'');
    // a single space before the opening curly bracket
    s = s.replace(/(\S)\s*\{/ig,'$1 {');
    // a new line and a tab between each declaration block
    s = s.replace(/;\s*([a-z\-\*\_])/ig,';\n\t$1');
    // a new line and a tab between each declaration block (keep the comment next to the declaration block)
    s = s.replace(/;.*(\/\*.*\*\/)\s*([a-z\-\*\_])/ig,'; $1\n\t$2');
    // a new line after the closing curly bracket
    s = s.replace(/\}\s*(\S)/ig,'\}\n$1');
    // a new line before the closing curly bracket
    s = s.replace(/(\S)\s*\}/ig,'$1\n\}');
    // a new line and a tab after the opening curly bracket
    s = s.replace(/\{\s*([a-z\-\*\_])/ig,'\{\n\t$1');
    // a new line and a tab after the opening curly bracket (keep the comment next to selector(s))
    s = s.replace(/\{.*(\/\*.*\*\/)\s*([a-z\-])/ig,'\{ $1\n\t$2');
    // a single space between the colon and the value
    s = s.replace(/\t([a-z\-\*\_]+): */ig,'\t$1: ');
    p[i].innerText = s;
  }
}
function beautifyCSS(oEvent) {
  reindentCSS(); // reindent
  prettyPrint(); // syntax highlighting
  oEvent.target.disabled = true;
}
function getElem(o) {
  return document.getElementById(o);
}
