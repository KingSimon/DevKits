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

    // http://jigsaw.w3.org/css-validator/manual.html#expert
    f.action = 'http://jigsaw.w3.org/css-validator/validator';
    f.enctype = 'multipart/form-data';
    f.method = 'post';

    i.name = 'text';
    i.value = sSource;
    f.appendChild(i);

    oOptions = oBkgPage.retrieveOptions();

    i = document.createElement('input');
    i.name = 'profile';
    i.value = oOptions.mode_validate_local_css;
    f.appendChild(i);

    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);
}