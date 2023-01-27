function hideLoading() {
    document.getElementById('payment-loading-div').style.display = 'none';
}

function paymentFailed() {
    document.getElementById('payment-failed-div').style.display = 'block';
    document.querySelector('.payment-successful').style.display = 'none';
    document.querySelector('.payment-successful-mobile').style.display = 'none';
    const retryURL = getRetryURL();
    if (retryURL) {
        document.getElementById('retry-payment-link').href = retryURL;
        document.getElementById('payment-failed-active-sub-heading').style.display = 'block';
        document.getElementById('payment-failed-expired-sub-heading').style.display = 'none';
    } else {
        document.getElementById('payment-failed-active-sub-heading').style.display = 'none';
        document.getElementById('payment-failed-expired-sub-heading').style.display = 'block';
    }
    hideLoading();
}

function paymentSuccessful(selectedPlan, userEmailAddress) {
    // document.getElementById('payment-success-status-sub-heading').innerText = `Adding a medical card? Our support team will email you within 24 hours.`;

    hideLoading();
    document.getElementById('payment-successful-div').style.display = 'block';
    // Mobile Breakpoint
    if (window.screen.width <= 479) {
        document.querySelector('.payment-successful').style.display = 'none';
        document.querySelector('.payment-successful-mobile').style.display = 'flex';
    } else {
        document.querySelector('.payment-successful').style.display = 'flex';
        document.querySelector('.payment-successful-mobile').style.display = 'none';
    }
}

function pageExpired() {
    hideLoading();
    document.getElementById('payment-default-div').style.display = 'block';
    document.querySelector('.payment-successful').style.display = 'none';
    document.querySelector('.payment-successful-mobile').style.display = 'none';
}

const qs = new URLSearchParams(document.location.search);
if (qs.get('status')) {
    let status = qs.get('status');
    if (status === 'success') {
        let planSelected = qs.get('plan');
        let userEmail = qs.get('email');
        let uid = qs.get('uid') || localStorage.getItem('uid')
        paymentSuccessful(planSelected, userEmail);
        profileCompletionLink()
    } else {
        paymentFailed();
    }
} else {
    pageExpired();
}

function getRetryURL() {
    let qs = new URLSearchParams(document.location.search);
    let planSelected = qs.get('plan')
    let userEmailBase64 = qs.get('email')
    let retryURL = document.location.origin + '/iiff/checkout?plan=' + planSelected + '&email=' + userEmailBase64
    return retryURL
}

function profileCompletionLink() {
    let med_card = localStorage.getItem('med_card')
    let med_card_delivery_only = localStorage.getItem('med_card_delivery_only')
    let rec_delivery_possible = localStorage.getItem('rec_delivery_possible')
    let thc_type_preference = localStorage.getItem('thc_type_preference')

    if (med_card == "true") {
        med_card = "True"
    } else if (med_card == "false") {
        med_card = "False"
    }

    if (rec_delivery_possible == "true") {
        rec_delivery_possible = "True"
    } else if (rec_delivery_possible == "false") {
        rec_delivery_possible = "False"
    }

    if (med_card_delivery_only == "true") {
        med_card_delivery_only = "True"
    } else if (med_card_delivery_only == "false") {
        med_card_delivery_only = "False"
    }

    if (thc_type_preference.toLowerCase().includes('thc')) {
        thc_type_preference = 'THC'
    } else {
        thc_type_preference = 'CBD'
    }
    const link = `https://eo-marketing.webflow.io/iaff/profile-completion?thc_plan_type=${thc_type_preference}&med_card_status=${med_card}&rec_delivery_possible=${rec_delivery_possible}&med_delivery_only=${med_card_delivery_only}`
    document.getElementById('profile-completion-link').href = link
}