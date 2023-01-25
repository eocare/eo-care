function onload() {
    const qs = new URLSearchParams(window.location.search)
    const submission_id = qs.get('submission_id')
    document.getElementById('accountSetupIframe').src = document.getElementById('accountSetupIframe').src + `?submission_id=${submission_id}`
    // iFrame event listener
    window.addEventListener('message', function(event) {
        console.log("Message received from the child: " + event.data); // Message received from child
    });
}

onload()