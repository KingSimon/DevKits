chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        displayImages(msg.sURL, msg.aImages);
        port.disconnect();
    });
});
function displayImages(sURL, aImages) {
    var l = aImages.length, oImage = null,
        oTitle = document.getElementById('title'),
        oTemp = null,
        img = null, table = null,
        tr = null, th = null, td = null, a = null;

    document.title = 'Images - ' + sURL;
    oTitle.innerText = l + ' image' + (l > 1 ? 's' : '');

    for (var i = 0; i < l; i++) {
        oImage = aImages[i];
        table = document.createElement('table');

        tr = document.createElement('tr');
        th = document.createElement('th');
        td = document.createElement('td');
        img = document.createElement('img');
        th.innerText = oImage.type;
        img.src = oImage.src;
        td.appendChild(img);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);

        tr = document.createElement('tr');
        th = document.createElement('th');
        td = document.createElement('td');
        a = document.createElement('a');
        th.innerText = 'Source';
        a.href = oImage.src;
        a.title = oImage.src;
        a.target = '_blank';
        a.innerText = oImage.src;
        td.appendChild(a);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);

        tr = document.createElement('tr');
        th = document.createElement('th');
        td = document.createElement('td');
        th.innerText = 'Dimensions';
        td.innerText = oImage.naturalWidth + ' x ' + oImage.naturalHeight + ' pixels';
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);

        if (oImage.alt) {
            tr = document.createElement('tr');
            th = document.createElement('th');
            td = document.createElement('td');
            th.innerText = 'Alt attribute';
            td.innerText = oImage.alt;
            tr.appendChild(th);
            tr.appendChild(td);
            table.appendChild(tr);
        }

        if (oImage.title) {
            tr = document.createElement('tr');
            th = document.createElement('th');
            td = document.createElement('td');
            th.innerText = 'Title attribute';
            td.innerText = oImage.title;
            tr.appendChild(th);
            tr.appendChild(td);
            table.appendChild(tr);
        }

        // Content-length + Content-type
        addImageInfo(oImage.src, table);

        document.body.appendChild(table);
    }
}
function addImageInfo(sURL, oTable) {
    var xhr = new XMLHttpRequest(),
        tr = null, th = null, td = null,
        sSize = null, sType = null,
        iBytes = null, iKB = null, iMB = null, iGB = null;

    xhr.open('head', sURL, true);
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            sSize = xhr.getResponseHeader('Content-length');
            sType = xhr.getResponseHeader('Content-type');

            iBytes = parseInt(sSize, 10);
            iKB = iBytes/1024;
            iMB = iBytes/1024/1024;
            iGB = iBytes/1024/1024/1024;

            sSize = iBytes + ' bytes';
            if (iGB > 1)
                sSize += ' <span class="grey">(' + iGB.toFixed(2) + ' GB)</span>';
            else if (iMB > 1)
                sSize += ' <span class="grey">(' + iMB.toFixed(2) + ' MB)</span>';
            else if (iKB > 1)
                sSize += ' <span class="grey">(' + iKB.toFixed(2) + ' KB)</span>';

            tr = document.createElement('tr');
            th = document.createElement('th');
            td = document.createElement('td');
            th.innerText = 'Size';
            td.innerHTML = sSize;
            tr.appendChild(th);
            tr.appendChild(td);
            oTable.appendChild(tr);

            tr = document.createElement('tr');
            th = document.createElement('th');
            td = document.createElement('td');
            th.innerText = 'Type';
            td.innerText = sType;
            tr.appendChild(th);
            tr.appendChild(td);
            oTable.appendChild(tr);
        }
    }
}