function paymentFailed() {
    document.getElementById('payment-status-heading').innerText = 'Hmm. Your payment could not be processed.';
    document.getElementById('payment-status-sub-heading').innerHTML = 'Please return to the previous page and re-enter your payment information. <br> Need help? Call <a href="tel:877-707-0706">877-707-0706</a> or email us at <a href="mailto:support@eo.care">support@eo.care</a>.'
    document.querySelector('.payment-successful-mobile').style.display = 'none';
    document.querySelector('.payment-successful').style.display = 'none';
}

function pageExpired() {
    document.getElementById('payment-status-heading').innerText = 'Sorry, this link is invalid or expired.';
    document.getElementById('payment-status-sub-heading').innerHTML = 'Need help? Call <a href="tel:877-707-0706">877-707-0706</a> or email us at <a href="mailto:support@eo.care">support@eo.care</a>.'
    document.querySelector('.payment-successful-mobile').style.display = 'none';
    document.querySelector('.payment-successful').style.display = 'none';
}

const qs = new URLSearchParams(document.location.search);
if (qs.get('status')) {
    let status = qs.get('status');
    if (status !== 'success') {
        paymentFailed();
    }
} else {
    pageExpired();
}