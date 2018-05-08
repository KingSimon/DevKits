var DevKits = DevKits || {}; // eslint-disable-line no-use-before-define

DevKits.Generated = DevKits.Generated || {};

// Returns the width of the vertical scrollbar (same as the height of the horizontal one)
DevKits.Generated.getScrollbarWidth = function(content)
{
    var innerDiv       = document.createElement("div");
    var outerDiv       = document.createElement("div");
    var scrollbarWidth = 0;

    innerDiv.style.height   = "150px";
    outerDiv.style.height   = "100px";
    outerDiv.style.overflow = "auto";
    outerDiv.style.width    = "100px";

    outerDiv.appendChild(innerDiv);
    content.appendChild(outerDiv);

    scrollbarWidth = outerDiv.offsetWidth - innerDiv.offsetWidth;

    content.removeChild(outerDiv);

    return scrollbarWidth;
};

// Initializes the page with data
DevKits.Generated.initialize = function(data, locale)
{
    var anchor            = null;
    var childElement      = null;
    var container         = null;
    var content           = document.getElementById("content");
    var element           = null;
    var filesDropdown     = $("#files-dropdown");
    var filesDropdownMenu = $(".dropdown-menu", filesDropdown).get(0);
    var height            = null;
    var layout            = null;
    var layoutDescription = null;
    var layouts           = data.layouts;
    var scrollbarWidth    = DevKits.Generated.getScrollbarWidth(content);
    var url               = data.pageURL;
    var width             = null;

    DevKits.Generated.emptyContent();
    DevKits.Generated.localizeHeader(locale);
    // DevKits.Generated.setPageTitle(locale.responsiveLayouts, data, locale);
    // DevKits.Generated.addDocument(url, 0);

    $(".dropdown-toggle", filesDropdown).prepend(locale?locale.layouts:"布局");

    // Loop through the layouts
    for(var i = 0, l = layouts.length; i < l; i++)
    {
        anchor            = "layout-" + i;
        layout            = layouts[i];
        childElement      = document.createElement("i");
        element           = document.createElement("h3");
        height            = layout.height;
        width             = layout.width;
        layoutDescription = layout.description + " (" + width + "x" + height + ")";

        childElement.setAttribute("class", "icon-caret-down");
        element.appendChild(childElement);
        element.setAttribute("id", anchor);
        element.appendChild(document.createTextNode(layoutDescription));
        content.appendChild(element);

        childElement = document.createElement("iframe");
        container    = DevKits.Generated.generateDocumentContainer();

        childElement.setAttribute("height", parseInt(height, 10) + scrollbarWidth);
        childElement.setAttribute("sandbox", "allow-forms allow-same-origin allow-scripts");
        childElement.setAttribute("scrolling", "yes");
        childElement.setAttribute("src", url);
        childElement.setAttribute("width", parseInt(width, 10) + scrollbarWidth);

        container.appendChild(childElement);
        content.appendChild(container);
        DevKits.Generated.addSeparator();

        childElement = document.createElement("a");
        element      = document.createElement("li");

        childElement.appendChild(document.createTextNode(layoutDescription));
        childElement.setAttribute("href", "#" + anchor);
        element.appendChild(childElement);
        filesDropdownMenu.appendChild(element);
    }

    $("#web-developer-reload").text(locale?locale.reloadLayouts:"刷新布局").on("click", DevKits.Generated.reloadLayouts);

    DevKits.Generated.initializeCommonElements();
};

// Reloads the layouts
DevKits.Generated.reloadLayouts = function(event)
{
    var iframe = null;

    // Loop through the iframes
    $("iframe").each(function()
    {
        iframe = $(this);

        iframe.attr("src", iframe.attr("src"));
    });

    event.preventDefault();
};


chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        console.log(msg);
        var data ={
            pageURL:msg.sURL,
            layouts:msg.aData.layouts
        };
        DevKits.Generated.initialize(data);
        port.disconnect();
    });
});

