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
    document.getElementById('payment-success-status-sub-heading').innerText = `Adding a medical card? Our support team will email you within 24 hours.`;

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
        paymentSuccessful(planSelected, userEmail);
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
    let retryURL = document.location.origin + '/checkout?plan=' + planSelected + '&email=' + userEmailBase64
    return retryURL
}