let email
let plan

function getQueryParams() {
    const qs = new URLSearchParams(window.location.search)
    plan = qs.get('plan')
    email = qs.get('email')
    if (plan !== 'nage_plan_annual' || plan !== 'nage_plan_monthly') {
        // TODO: NAGE Payment Plans Here
        plan = plan === '$100: Billed Yearly' ? 'nage_plan_annual' : 'nage_plan_monthly'
    }
    console.log(plan)
    console.log(email)
}

// function populateBillingAddress() {
//     const data = JSON.parse(localStorage.getItem('shipping_address'));
//     document.querySelector('#billingAddress1').value = data.address_line_1 || '';
//     document.querySelector('#billingAddress2').value = data.address_line_2 || '';
//     document.querySelector('#billingCity').value = data.city || '';
//     document.querySelector('#billingZip').value = data.zip || '';
// }

function submitCheckoutForm() {
    // Validate Inputs
    const cardNumber = document.querySelector('#cardNumber')
    const cardExp = document.querySelector('#cardExp')
    const cardCode = document.querySelector('#cardCode')

    const cardNameCheck = _isFieldNotEmpty('cardName', 'Name on card cannot be blank.')
    const cardNumberCheck = cardNumber.value.replace(' ', '').length <= 16
    const cardExpCheck = cardExp.value.length === 5
    const cardCodeCheck = cardCode.value.length > 0 && cardCode.value.length <=4
    const billingAddress1Check = _isFieldNotEmpty('billingAddress1', "Billing address cannot be blank.")
    const billingCityCheck = _isFieldNotEmpty('billingCity', "Billing city cannot be blank.")
    const billingZipCheck = _isFieldNotEmpty('billingZip', "Billing zip cannot be blank.")

    // if (cardNameCheck && 
    //     cardNumberCheck &&
    //     cardExpCheck &&
    //     cardCodeCheck &&
    //     billingAddress1Check &&
    //     billingCityCheck &&
    //     billingZipCheck) {
    //         sendPaymentDataToAnet()
    //     }
    _submittingState('payButton')
    sendPaymentDataToAnet()
}

function init() {
    document.querySelector('#cardNumber').maxLength = 19
    document.querySelector('#cardExp').maxLength = 5
    document.querySelector('#cardCode').maxLength = 4
    
    // Form Event Listeners
    document.querySelector('#cardName').addEventListener('blur',(e) => {_isFieldNotEmpty(e, "Name on card cannot be blank.")});
    document.querySelector('#cardNumber').addEventListener('keyup', creditCardClassifier);
    document.querySelector('#cardNumber').addEventListener('blur', cardNumberValidator);
    document.querySelector('#cardExp').addEventListener('keyup', cardExpFormatter);
    document.querySelector('#cardExp').addEventListener('blur', (e) => {_isFieldNotEmpty(e, "Card expiry cannot be blank.")});
    document.querySelector('#cardCode').addEventListener('blur', cardCodeValidator);

    document.querySelector('#billingAddress1').addEventListener('blur', (e) => {_isFieldNotEmpty(e, "Billing address cannot be blank.")});
    document.querySelector('#billingCity').addEventListener('blur', (e) => {_isFieldNotEmpty(e, "Billing city cannot be blank.")});
    document.querySelector('#billingZip').addEventListener('blur', (e) => {_isFieldNotEmpty(e, "Billing zip cannot be blank.")});

    document.getElementById('payButton').addEventListener('click', (e)=>{
        e.preventDefault();
        console.log("Form Submit Intercepted.")
        // Validate form and submit
        submitCheckoutForm();
        return false;
    })
    // Discount Code Form Button
    document.querySelector('.discount-form').style.display = 'block'
    let thatBtn = document.getElementById('apply-button')
    let applyDiscountBtn = document.createElement('button')
    applyDiscountBtn.setAttribute('value', thatBtn.getAttribute('value'))
    applyDiscountBtn.setAttribute('data-w-id', thatBtn.getAttribute('data-w-id'))
    applyDiscountBtn.setAttribute('class', thatBtn.getAttribute('class'))
    applyDiscountBtn.setAttribute('id', thatBtn.getAttribute('id'))
    applyDiscountBtn.innerText = 'Apply'
    // Apply Discount Code Listener
    applyDiscountBtn.onclick = applyDiscountCode
    thatBtn.replaceWith(applyDiscountBtn)

    // Clear Discount
    document.getElementById('clear_coupon').addEventListener('click', clearDiscount)
}

function zipValidator(e) {
    if (e.target.value.length === 0) {
        return _isFieldNotEmpty(e, "Billing zip cannot be blank.")
    }
    else if (e.target.value.length < 5) {
        return _isFieldNotEmpty(e, "Billing zip is not valid.")
    } else {
        return false
    }
}

function showHideErrorDiv(elementId, show, text) {
    if (show) {
        document.querySelector(`#${elementId}`).innerText = text;
        document.querySelector(`#${elementId}`).style.display = 'block'
    } else {
        document.querySelector(`#${elementId}`).style.display = 'none'
    }
}

function cardNumberValidator(e) {
    if (e.target.value.length === 0) {
        showHideErrorDiv('cardNumberErrDiv', true, 'Card number cannot be blank.')
    } else if (e.target.value.replace(' ', '').length <= 16) {
        showHideErrorDiv('cardNumberErrDiv', true, 'Enter a valid card number.')
    }
    else {
        showHideErrorDiv('cardNumberErrDiv', false, '')
    }
}

function cardCodeValidator(e) {
    if (e.target.value.length === 0) {
        showHideErrorDiv('cardCodeErrDiv', true, 'Card code cannot be blank.')
    } else {
        showHideErrorDiv('cardCodeErrDiv', false, '')
    }
}

async function completeCheckout(payment) {
    // TODO: Replace this in production
    const API_ROOT_DOMAIN = 'https://api.staging.eo.care';
    const payload = buildPayload(payment)
    const resp = await fetch(`${API_ROOT_DOMAIN}/order`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload
    });

    let responseData = await resp.json()
    console.log(responseData)

    if (resp.ok && resp.status === 200) {
        _successfulState('payButton', 'Payment Successful')
        const uid = await localStorage.getItem('uid')
        // TODO: On Success redirect to NAGE Payment Success Page
        document.location.href = document.location.origin + '/iiff/payment-status?status=success&plan=' + plan + '&email=' + email + '&uid=' + uid;
        return true;
    } else {
        handlePaymentErrorResponse(responseData)
        return false;
    }
}

function handlePaymentErrorResponse(res) {
    if (res.status == "error") {
        if (res.message == "The transaction was unsuccessful." 
        || res.message == "Invalid OTS Token." 
        || res.message == "This transaction has been declined.") {
            console.log(res.message)
            _showFieldError('payButton', res.message)
        } else {
            _showFieldError('payButton', 'Something went wrong, please try again.')
        }
        _resetState('payButton', 'Pay')
        // Redirect to payment failed page
        setTimeout(() => {
            document.location.href = document.location.origin + '/iiff/payment-status?status=failed&plan=' + plan + '&email=' + email + '&msg=' + btoa(res.message) + '&uid=' + uid;
        }, 1000)
    }
}

function updatePricing(newPricing) {
    const {
        discount_amount,
        final_price,
        flat_off,
        max_discount_amount,
        original_price,
        percent_off,
        status
    } = newPricing
   
    document.querySelector('#amount').textContent = `$ ${final_price}`
    document.querySelector('#due-total-value').textContent = `$ ${final_price}`
    document.querySelector('#coupon-applied-value').textContent = getDiscountCode()
    let discountInfo = flat_off ? `Flat $ ${flat_off} off` : `${percent_off}% off`
    if (max_discount_amount) {
        discountInfo += ` - Max Discount: ${max_discount_amount}`
    }
    document.querySelector('#percent-off-value').textContent = discountInfo
    document.querySelector('#discount-amount').textContent = `-$ ${discount_amount}`
}

/**
 * 
 * @param {*} payment.descriptor
 * @param {*} payment.value
 */
function buildPayload(payment) {
    return JSON.stringify({
        "email": email,
        "order": {
            "plan_id": plan
        },
        "payment_method": {
            "descriptor": payment['dataDescriptor'],
            "value": payment['dataValue']
        },
        "billing_address": {
            "address_line_1": document.querySelector('#billingAddress1').value,
            "address_line_2": document.querySelector('#billingAddress2').value,
            "city": document.querySelector('#billingCity').value,
            "zip": document.querySelector('#billingZip').value
        }
    })
}

const ccLogoImageIds = ['visa', 'master', 'amex', 'discover']
const mask = [
    {
        regex: '^3[47]\\d{0,13}',
        cardtype: 'amex'
    },
    {
        regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
        cardtype: 'discover'
    },
    {
        regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
        cardtype: 'master'
    },
    {
        regex: '^4\\d{0,15}',
        cardtype: 'visa'
    }
]

function showCardTypeLogo(cardId) {
    hideOtherCCLogos(cardId)
    if (ccLogoImageIds.includes(cardId)) {
        document.querySelector(`#${cardId}`).style.display = ''
    } else {
        throw new Error(`Card ID: ${cardId} doesn't exist.`)
    }
}

function showAllCCLogos() {
    ccLogoImageIds.map((logoId) => {
        document.querySelector(`#${logoId}`).style.display = ''
    })
}

function hideOtherCCLogos(cardId) {
    ccLogoImageIds.map((logoId) => {
        if (logoId != cardId) {
            document.querySelector(`#${logoId}`).style.display = 'none'
        }
    })
}

function creditCardClassifier(e) {
    console.log(e.key)
    let number = e.target.value
    if (number.length === 0) {
        showAllCCLogos()
    } else {
        for (let i=0; i<mask.length; i++) {
            let re = new RegExp(mask[i]['regex'])
            if (number.match(re) != null) {
                console.log(mask[i]['cardtype'])
                showCardTypeLogo(mask[i]['cardtype'])
                if (e.key != 'Backspace') {
                    e.target.value = formatCC(number)
                }
                return
            }
        }
    }
}

function formatCC(cardNumber) {
    let count = 0
    let maxLength = 16
    let formattedCC = ''
    for(let i=0; i<cardNumber.length; i++) {
        if (cardNumber[i] != ' ') {
            count += 1
            formattedCC = formattedCC + cardNumber[i]
            if (count % 4 == 0 && count < maxLength) {
                formattedCC = formattedCC + ' '
            }
        }
    }
    return formattedCC
}

function cardExpFormatter(e) {
    let exp = e.target.value
    let key = e.key
    let formatted = ''
    if (exp.length == 2 && key != 'Backspace') {
        formatted = exp + '/'
        e.target.value = formatted
    }   
}


/**
 * This section interacts with Authorize.net using 
 * Authorize.net's Accept.js library
 * 
 * This section sends the credit card information 
 * to Authorize.net and secures a payment token that 
 * is equivalent to the credit card data
 * 
 * The same payment token is then sent to the 
 * backend to complete the payment.
 */

 function sendPaymentDataToAnet() {
    var authData = {};
        authData.clientKey = "57KuE5yx7U67ztegzWQwdMbSEJ9WWmEh2Rxb7h63PN383AtAWw5G9q24Es4y6yD5";
        authData.apiLoginID = "4jdE38KyxULH";

    var cardData = {};
        cardData.cardNumber = document.getElementById("cardNumber").value.replaceAll(' ', '');
        cardData.month = document.getElementById("cardExp").value.split('/')[0];
        cardData.year = document.getElementById("cardExp").value.split('/')[1];
        cardData.cardCode = document.getElementById("cardCode").value;

    var secureData = {};
        secureData.authData = authData;
        secureData.cardData = cardData;

    Accept.dispatchData(secureData, responseHandler);
}

function responseHandler(response) {
    if (response.messages.resultCode === "Error") {
        console.log(`Error`)
        console.log(response.messages)
        _showFieldError('payButton', response.messages?.message[0]?.text)
        _resetState('payButton', 'Pay')
    } else {
        console.log(response)
        paymentFormUpdate(response.opaqueData);
    }
}

function paymentFormUpdate(opaqueData) {
    // If using your own form to collect the sensitive data from the customer,
    // blank out the fields before submitting them to your server.
    document.getElementById("cardNumber").value = "";
    document.getElementById("cardExp").value = "";
    document.getElementById("cardCode").value = "";

    completeCheckout(opaqueData)
}

// Main
console.log('Running init')
getQueryParams()
init()
populateBillingAddress()