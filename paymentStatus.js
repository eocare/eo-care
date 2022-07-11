function paymentFailed() {
    document.getElementById('payment-failed-div').display = 'block';
}

function paymentSuccessful() {
    document.getElementById('payment-successful-div').display = 'block';
    // Mobile Breakpoint
    if (window.screen.width <= 479) {
        document.querySelector('.payment-successful').style.display = 'none';
    } else {
        document.querySelector('.payment-successful').style.display = 'flex';
    }
}

function pageExpired() {
    document.getElementById('payment-default-div').style.display = 'block';
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