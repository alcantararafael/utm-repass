var whitelistUTM = ['vemcogroup.com/pt', 'latam.vemcogroup.com', 'localhost', '127.'];
var ignoreLinks = ['tel:', 'mailto:'];
var debugUTMActive = true;

var debugUTM = Object.assign({}, console);
// Personalized function log
debugUTM.log = function () {
    if (debugUTMActive) console.log.apply(console, arguments);
};

// Store UTM parameters in session storage
function storeUTMParams() {
    var urlParams = new URLSearchParams(window.location.search);
    var utmParams = getUTMParams();
    ["utm_campaign", "utm_source", "utm_medium", "utm_content", "utm_term"].forEach((param) => {
        var value = urlParams.get(param);
        if (value !== null && value !== undefined && value.trim() !== "") {
            utmParams[param] = value;
        }
    });

    // Save UTM parameters to session storage
    sessionStorage.setItem("utmParams", JSON.stringify(utmParams));
    debugUTM.log("UTM parameters stored in session storage:", utmParams);
}

// Retrieve UTM parameters from session storage
function getUTMParams() {
    var utmParams = sessionStorage.getItem("utmParams");
    return utmParams ? JSON.parse(utmParams) : {};
}

// Append UTM parameters to links
function appendUTMParamsToLinks() {
    var links = document.getElementsByTagName("a");
    var utmParams = getUTMParams();

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute("href");
        var pageURl = window.location.href;

        // Skip invalid or ignored links
        if (!href || ignoreLinks.some((item) => pageURl.includes(item))) {
            debugUTM.log("Ignoring Link:", href);
            continue;
        }

        // Check if the link is on the whitelist
        if (!whitelistUTM.some((item) => pageURl.includes(item))) {
            debugUTM.log("Link not on whitelist:", href);
            continue;
        }

        // Get existing query parameters from the link
        var queryString = href.split("?")[1];
        var hrefParams = new URLSearchParams(queryString);

        // Remove UTM parameters already present in the link
        for (var key in utmParams) {
            if (hrefParams.has(key)) {
                debugUTM.log(`Key: ${key} (${hrefParams.get(key)}) is already in link`);
                delete utmParams[key];
            }
        }

        // Append remaining UTM parameters to the link
        var updatedQueryString = getQueryStringUTM(utmParams);
        if (href.indexOf("?") !== -1) {
            link.setAttribute("href", href + "&" + updatedQueryString);
        } else {
            link.setAttribute("href", href + "?" + updatedQueryString);
        }
    }
}

// Helper function to convert UTM parameters object to a query string
function getQueryStringUTM(params) {
    return Object.keys(params)
        .filter((key) => params[key])
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
        .join("&");
}

// Initialize UTM Repass when the page has loaded
window.addEventListener("load", () => {
    storeUTMParams(); // Store UTM parameters in session storage
    appendUTMParamsToLinks(); // Append UTM parameters to links
});