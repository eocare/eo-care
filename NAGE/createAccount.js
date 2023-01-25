function onload() {
    const qs = new URLSearchParams(window.location.search)
    const submission_id = qs.get('submission_id')
    const _iframeDivId = 'JotFormIFrame-230167209377155'
    document.getElementById(_iframeDivId).src = document.getElementById(_iframeDivId).src + `?submission_id=${submission_id}`
    // iFrame event listener
    console.log(`Adding iFrame message listener.`)
    window.addEventListener('message', function(event) {
        console.log("Message received from the child: ") // Message received from child
        console.log(event.data)
    });
}

onload()