function onload() {
    // iFrame event listener
    console.log(`Adding iFrame message listener.`)
    window.addEventListener('message', function(event) {
        console.log("Message received from the child: ") // Message received from child
        console.log(event.data)
        const { zip, uid, thc_type_preference, med_card, med_card_number, redirect } = event.data
        if (zip) {
            const { med_card_delivery_only, rec_delivery_possible } = zip
            this.localStorage.setItem('med_card_delivery_only', med_card_delivery_only)
            this.localStorage.setItem('rec_delivery_possible', rec_delivery_possible)
        }
        if (uid || thc_type_preference || med_card || med_card_number) {
            this.localStorage.setItem('uid', uid)
            this.localStorage.setItem('thc_type_preference', thc_type_preference)
            this.localStorage.setItem('med_card', med_card)
            this.localStorage.setItem('med_card_number', med_card_number)
        }
        if (redirect) {
            this.document.location.href = redirect
        }
    });

    const _iframeDivId = 'JotFormIFrame-230167209377155'
    document.getElementById(_iframeDivId).src =  `https://eo-care.web.app/pain_kit/account.html`
    document.getElementById(_iframeDivId).style.display = ''
    document.getElementById(_iframeDivId).style.height = '100%'
    document.getElementById(_iframeDivId).style.width = '100%'
}

// setTimeout(onload, 800)
onload()