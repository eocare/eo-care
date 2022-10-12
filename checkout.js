let email
let plan

function getQueryParams() {
    const qs = new URLSearchParams(window.location.search)
    plan = qs.get('plan')
    email = qs.get('email')
}

function populateBillingAddress() {
    const data = JSON.parse(localStorage.getItem('subscribeInfo'));
    document.getElementById("billingAddress1").value = data.street;
    document.getElementById("billingAddress2").value = data.streetline2;
    document.getElementById("billingCity").value = data.city;
    document.getElementById("billingZip").value = data.zip;
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
    const API_ROOT_DOMAIN = 'https://332e-223-178-44-82.ngrok.io';
    const payload = buildPayload(payment)
    const resp = await fetch(`${API_ROOT_DOMAIN}/createSubscription`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload
    });

    console.log(resp.json())

    if (resp.ok && resp.status === 200) {
        _successfulState('payButton', 'Payment Successful')
        document.location.href = document.location.origin + '/payment-status?status=success&plan=' + plan + '&email=' + btoa(email);
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * @param {*} payment.descriptor
 * @param {*} payment.value
 */
function buildPayload(payment) {
    return JSON.stringify({
        "payment_method": {
            "descriptor": payment['dataDescriptor'],
            "value": payment['dataValue']
        },
        "order": {
            "id": "plan_annual",
            "start_date": "2023-10-01",
            "interval_in_months": 12,
            "price": 2.9
        }, 
        "user_profile": {
            "email": "leon11s1@test.com",
            "shipping_address": {
                "address_line_1": "asdasd",
                "address_line_2": "dasdad",
                "city": "sdadas",
                "zip": "02127"
            },
            "billing_address": {
                "address_line_1": "asdasd",
                "address_line_2": "dasdad",
                "city": "sdadas",
                "zip": "02127"
            }
    }
    })
    return JSON.stringify({
        "user_email": "leon@kenndy212.com",
        "subscription": {
            "id": "plan_annual",
            "price": 249,
            "renewal_frequency_in_months": 12
        },
        "payment_method": {
            "descriptor": payment['dataDescriptor'],
            "value": payment['dataValue']
        },
        "billing_address": {
            "address_line_1": '',
            "address_line_2": '',
            "city": '',
            "zip": '',
            "country": ''
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


// init()


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
        // var i = 0;
        // while (i < response.messages.message.length) {
        //     console.log(
        //         response.messages.message[i].code + ": " +
        //         response.messages.message[i].text
        //     );
        //     i = i + 1;
        // }
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
populateBillingAddress()
console.log('Running init')
init()