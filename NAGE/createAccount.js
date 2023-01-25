function onload() {
    const qs = new URLSearchParams(window.location.search)
    const submission_id = qs.get('submission_id')
    // iFrame event listener
    console.log(`Adding iFrame message listener.`)
    window.addEventListener('message', function(event) {
        console.log("Message received from the child: ") // Message received from child
        console.log(event.data)
        const { zip, uid, thc_type_preference, med_card } = event.data
        if (zip) {
            const { med_card_delivery_only, rec_delivery_possible } = zip
            this.localStorage.setItem('med_card_delivery_only', med_card_delivery_only)
            this.localStorage.setItem('rec_delivery_possible', rec_delivery_possible)
        }
        if (uid || thc_type_preference || med_card) {
            this.localStorage.setItem('uid', uid)
            this.localStorage.setItem('thc_type_preference', thc_type_preference)
            this.localStorage.setItem('med_card', med_card)
        }
    });

    const _iframeDivId = 'JotFormIFrame-230167209377155'
    document.getElementById(_iframeDivId).src =  `https://eo-care.web.app/account.html?submission_id=${submission_id}`
    document.getElementById(_iframeDivId).style.display = ''
}

// setTimeout(onload, 800)
onload()