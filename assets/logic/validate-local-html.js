chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        validate(msg.sSource);
        port.disconnect();
    });
});
function validate(sSource) {
    var f = document.createElement('form'),
        i = document.createElement('input'),
        oBkgPage = chrome.extension.getBackgroundPage(),
        oOptions = null;

    // http://validator.w3.org/docs/api.html
    f.action = 'http://validator.w3.org/check';
    f.enctype = 'multipart/form-data';
    f.method = 'post';

    //i.type = 'hidden';
    i.name = 'fragment';
    i.value = sSource;
    f.appendChild(i);

    oOptions = oBkgPage.retrieveOptions();
    oOptions = oOptions.mode_validate_local_html;

    if (oOptions.show_source) {
        i = document.createElement('input');
        i.name = 'ss';
        i.value = '1';
        f.appendChild(i);
    }
    if (oOptions.show_outline) {
        i = document.createElement('input');
        i.name = 'outline';
        i.value = '1';
        f.appendChild(i);
    }
    if (oOptions.verbose_output) {
        i = document.createElement('input');
        i.name = 'verbose';
        i.value = '1';
        f.appendChild(i);
    }

    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);
}