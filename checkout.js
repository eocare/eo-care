let email
let plan

function getQueryParams() {
    const qs = new URLSearchParams(window.location.search)
    plan = qs.get('plan')
    email = qs.get('email') ? atob(qs.get('email')) : qs.get('email')
}

function populateBillingAddress() {
    const data = JSON.parse(localStorage.getItem('shipping_address'));
    document.querySelector('#billingAddress1').value = data.address_line_1;
    document.querySelector('#billingAddress2').value = data.address_line_2;
    document.querySelector('#billingCity').value = data.city;
    document.querySelector('#billingZip').value = data.zip;
}

function submitCheckoutForm() {
    // Validate Inputs
    const nameOnCard = document.querySelector('#cardName')
    const cardNumber = document.querySelector('#cardNumber')
    const cardExp = document.querySelector('#cardExp')
    const nameCheck = nameOnCard.value.length > 0
    const cardNumberCheck = cardNumber.value.replace(' ', '').length == 16
    const cardExpCheck = cardExp.value.length === 5
    console.log(document.querySelector('#cardNumber').value)
    console.log(document.querySelector('#cardExp').value)
    console.log(document.querySelector('#cardCode').value)

    console.log(document.querySelector('#billingAddress1').value)
    console.log(document.querySelector('#billingAddress2').value)
    console.log(document.querySelector('#billingCity').value)
    console.log( document.querySelector('#billingZip').value)
    const countryIndex = document.querySelector('#billingCountry').selectedIndex
    console.log(document.querySelector('#billingCountry').options[countryIndex].text)

    sendPaymentDataToAnet()
}

function init() {
    document.querySelector('#cardNumber').maxLength = 19
    document.querySelector('#cardExp').maxLength = 5
    document.querySelector('#cardCode').maxLength = 4
    // Form Event Listeners
    document.querySelector('#cardName').addEventListener('blur', ()=>{console.log('card name validation')});
    document.querySelector('#cardNumber').addEventListener('keyup', creditCardClassifier);
    document.querySelector('#cardExp').addEventListener('keyup', cardExpFormatter);
    document.querySelector('#cardCode').addEventListener('blur', _isFieldNotEmpty);

    document.querySelector('#billingAddress1').addEventListener('blur', _isFieldNotEmpty);
    document.querySelector('#billingCity').addEventListener('blur', _isFieldNotEmpty);
    document.querySelector('#billingZip').addEventListener('blur', _isFieldNotEmpty);

    document.getElementById('payButton').addEventListener('click', (e)=>{
        e.preventDefault();
        _submittingState(e);
        console.log("Form Submit Intercepted.")
        // Validate form and submit
        submitCheckoutForm();
        return false;
    })
}

async function completeCheckout(payment) {
    // TODO: Update this
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

    let responseData = resp.json()
    console.log(responseData)

    if (resp.ok && resp.status === 200) {
        _successfulState('payButton', 'Payment Successful')
        document.location.href = document.location.origin + '/payment-status?status=success&plan=' + plan + '&email=' + btoa(email);
        return true;
    } else {
        handlePaymentErrorResponse(responseData)
        return false;
    }
}

function handlePaymentErrorResponse(res) {
    if (res.status == "error") {
        if (res.message == "The transaction was unsuccessful." 
        || res.message == "Invalid OTS Token.") {
            console.log("Something went wrong, please try again.")
            alert("Something went wrong, please try again.")
        }
    }
}

/**
 * 
 * @param {*} payment.descriptor
 * @param {*} payment.value
 */
function buildPayload(payment) {
    return JSON.stringify({
        "email": email ? email : "krishn.goteti@gmail.com",
        "order": {
            "id": "plan_annual",
            "price": 249.00,
            "interval_in_months": 12
        },
        "payment_method": {
            "descriptor": payment['dataDescriptor'],
            "value": payment['dataValue']
        },
        "billing_address": {
            "address_line_1": 'hjkhjsdasd',
            "address_line_2": 'sdadasd',
            "city": 'asdsdas',
            "zip": '02127'
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
        authData.clientKey = "9Kme758Rh9Snu8yfRa4eBPPuUnRS3yF55T29fGGmbnpH5QMN2BPA5EQyRtzu27dy";
        authData.apiLoginID = "35k7PdmP5";

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