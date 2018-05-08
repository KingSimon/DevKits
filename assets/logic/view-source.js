chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        displaySource(msg.sURL, msg.sSource, msg.sType);
        port.disconnect();
    });
});
function displaySource(sURL, sSource, sType) {
    document.title = (sType === 'selection' ? 'Selection' : 'Generated') +
        ' source - ' + sURL;

    var base = document.createElement('base');
    base.setAttribute('href', sURL);
    document.head.appendChild(base);

    var div = document.createElement('div');
    div.className = 'webkit-line-gutter-backdrop';
    document.body.appendChild(div);

    var lines = sSource.split("\n");
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    for (var i = 0; i < lines.length; i++) {
        var tr = document.createElement('tr');
        var tdNumber = document.createElement('td');
        var tdContent = document.createElement('td');
        tdNumber.className = 'webkit-line-number';
        tdContent.className = 'webkit-line-content';
        tdContent.innerHTML = (lines[i] === ''? ' ': lines[i]);
        tr.appendChild(tdNumber);
        tr.appendChild(tdContent);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    document.body.appendChild(table);
}