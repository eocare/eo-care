function hideLoading() {
    document.getElementById('payment-loading-div').style.display = 'none';
}

function paymentFailed() {
    hideLoading();
    document.getElementById('payment-failed-div').style.display = 'block';
    document.querySelector('.payment-successful').style.display = 'none';
    document.querySelector('.payment-successful-mobile').style.display = 'none';
}

function paymentSuccessful() {
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
        paymentSuccessful();
    } else {
        paymentFailed();
    }
} else {
    pageExpired();
}