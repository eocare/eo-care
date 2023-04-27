function onload() {
    const qs = new URLSearchParams(window.location.search)
    const submission_id = qs.get('submission_id')
    let supported_unions = ['iaff', 'btu', 'ethos', 'web', 'ayr']
    let union_type = 'iaff'
    supported_unions.forEach((union) => {
        if (window.location.pathname.includes(`/${union}/`)) {
            union_type = union
        }
    })
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
            if (union_type === 'ayr') {
                let med_card_status;
                if (med_card_number != 'null') {
                    med_card_status = "True"
                } else if (med_card_number == 'null' && med_card == "true") {
                    med_card_status = "Interested"
                } else if (med_card_number == 'null' && med_card == "false") {
                    med_card_status = "False"
                } else {
                    med_card_status = "False"
                }
                const rec_delivery_possible = this.localStorage.getItem('rec_delivery_possible')
                const med_card_delivery_only = this.localStorage.getItem('med_card_delivery_only')
                const link = `https://partner.eo.care/${union_type}/profile-completion?thc_plan_type=${thc_type_preference}&med_card_status=${med_card_status}&rec_delivery_possible=${rec_delivery_possible}&med_delivery_only=${med_card_delivery_only}&union=${union_type}`;
                this.document.location.href = link
            } else {
                this.document.location.href = redirect
            }
        }
    });

    const _iframeDivId = 'JotFormIFrame-230167209377155'
    if (union_type === 'ayr') {
        const _ayrAccountURL = 'https://eo-care.web.app/ayr/account.html'
        document.getElementById(_iframeDivId).src =  `${_ayrAccountURL}?submission_id=${submission_id}&union_type=${union_type}`
    } else {
        const _accountURL = 'https://eo-care.web.app/account_setup_new/account.html'
        document.getElementById(_iframeDivId).src =  `${_accountURL}?submission_id=${submission_id}&union_type=${union_type}`
    }
    document.getElementById(_iframeDivId).style.display = ''
    document.getElementById(_iframeDivId).style.height = '100%'
    document.getElementById(_iframeDivId).style.width = '100%'
}

// setTimeout(onload, 800)
onload()
