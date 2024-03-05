<html>

<head>
    <title>UTM Repass</title>
    <script src="utm_repass.js"></script>

    <script>
        function debugAllParameter(){
            var urlParams = new URLSearchParams(window.location.search);
            var debug = document.getElementById("debug");
            var debugHTML = "<p>Debugging all parameters in URI</p>";
            urlParams.forEach(function(value, key) {
                debugHTML += "<p><b>Param [" + key + "]</b>: <span id='" + key + "'>" + value + "</span></p>";
            });
            debug.innerHTML = debugHTML;
        }
        // Initialize UTM Repass when the page has loaded
        window.addEventListener('load', (event) => {
            debugAllParameter();
        });
    </script>
</head>

<body>
    <h1>UTM Repass</h1>
    <p>Welcome to UTM Repass! This is a simple tool that automatically appends UTM parameters to all links on the page based on the current URL. This can be useful for tracking the source of traffic to your website.</p>
    <a href="utm_repass-test.php">utm_repass-test</a><BR>
    <a href="utm_repass-test.php?test=a">utm_repass-test.php?test=a</a><BR>
    <a href="utm_repass-test.php?utm_campaign=A&utm_source=B&val=C&test=D">utm_repass-test.php?utm_campaign=A&utm_source=B&val=C&test=D</a><BR>
    <a href="utm_repass-test.php?utm_campaign=CAMPAIGN-IN-LINK&utm_source=TestSource&utm_medium=TestMedium&utm_content=TestContent&utm_term=TestTerm">utm_repass-test?utm_campaign=CAMPAIGN-IN-LINK&utm_source=TestSource&utm_medium=TestMedium&utm_content=TestContent&utm_term=TestTerm</a><BR> 

    <div id="debug">
        <h2>Debug</h2>
    </div>
</body>

</html>