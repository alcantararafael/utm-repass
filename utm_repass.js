var whitelistUTM = ['vemcogroup.com/pt', 'latam.vemcogroup.com', 'localhost', '127.']
var ignoreLinks = ['tel:', 'mailto:']
var debugUTMActive = true

var debugUTM = Object.assign({}, console)
//personalized function log
debugUTM.log = function() {
    if (debugUTMActive)
        console.log.apply(console, arguments);
}


function initUTMRepass(from){
    debugUTM.log('initUTMRepass FROM:'+from)
    var url = window.location.href;

    if (whitelistUTM.some(item => url.includes(item))) {
        debugUTM.log('UTMRepass activated.\nURLs configured: %o',whitelistUTM)
        UTMRepass();
    }else{
        debugUTM.log('UTMRepass NOT activated')
    }   
}

function UTMRepass(){
    // Get all links on the page
    var links = document.getElementsByTagName("a");

    // Extract UTM parameters from the current URL
    var urlParams = new URLSearchParams(window.location.search);
    var utmParams = {
        utm_campaign: urlParams.get("utm_campaign"),
        utm_source: urlParams.get("utm_source"),
        utm_medium: urlParams.get("utm_medium"),
        utm_content: urlParams.get("utm_content"),
        utm_term: urlParams.get("utm_term")
    };

    // Loop through each link and append UTM parameters
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute("href");
        // Skip links that are not valid URLs
        if (!href) {
            continue;
        }
        // Skip links that are not on the whitelist
        if (ignoreLinks.some(item => href.includes(item))) {
            console.log('Ignoring Link: '+href)
            continue;
        }

        var utmParamsCopy = utmParams;

        // Get the query string from the href
        var queryString = href.split('?')[1];
        // create Map called hrefParams from href where we have just have parameters of URI
        var hrefParams = new URLSearchParams(queryString);
        // transform in Map
        var hrefParams = new Map(hrefParams.entries());        

        
        // loop through the keys in utmParams
        debugUTM.log('-----------')
        debugUTM.log('Link: %o', href);
        for (var key in utmParamsCopy) {
            // if the key is in the hrefParams, remove it from utmParamsCopy
            if (hrefParams.has(key)) {
                debugUTM.log('key: '+key+' ('+hrefParams.get(key)+') is already in link')
                utmParamsCopy[key] = null;
            }
        }

        // Check if the link has an existing query string
        if (href.indexOf("?") !== -1) {
            // Append UTM parameters to the existing query string
            link.setAttribute("href", href + "&" + getQueryStringUTM(utmParamsCopy));
        } else {
            // Add UTM parameters as a new query string
            link.setAttribute("href", href + "?" + getQueryStringUTM(utmParamsCopy));
        }
    }
}
// Helper function to convert UTM parameters object to a query string
function getQueryStringUTM(params) {
    return Object.keys(params)
        .filter(key => params[key])
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
        .join("&");
}

// Initialize UTM Repass when the page has loaded
window.addEventListener('load', (event) => {
    initUTMRepass('Page is fully loaded');
});   

