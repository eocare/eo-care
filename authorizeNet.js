/**
 * This module interacts with Authorize.net using 
 * Authorize.net's Accept.js library
 * 
 * This module sends the credit card information 
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
        cardData.cardNumber = document.getElementById("cardNumber").value;
        cardData.month = document.getElementById("cardExp").value.split('/')[0];
        cardData.year = document.getElementById("cardExp").value.split('/')[1];
        cardData.cardCode = document.getElementById("cardCode").value;

    var secureData = {};
        secureData.authData = authData;
        secureData.cardData = cardData;

    Accept.dispatchData(secureData, responseHandler);

    function responseHandler(response) {
        if (response.messages.resultCode === "Error") {
            var i = 0;
            while (i < response.messages.message.length) {
                console.log(
                    response.messages.message[i].code + ": " +
                    response.messages.message[i].text
                );
                i = i + 1;
            }
        } else {
            paymentFormUpdate(response.opaqueData);
        }
    }
}

function paymentFormUpdate(opaqueData) {
    document.getElementById("dataDescriptor").value = opaqueData.dataDescriptor;
    document.getElementById("dataValue").value = opaqueData.dataValue;

    // If using your own form to collect the sensitive data from the customer,
    // blank out the fields before submitting them to your server.
    document.getElementById("cardNumber").value = "";
    document.getElementById("cardExp").value = "";
    document.getElementById("cardCode").value = "";
    document.getElementById("accountNumber").value = "";
    document.getElementById("routingNumber").value = "";
    document.getElementById("nameOnAccount").value = "";
    document.getElementById("accountType").value = "";

    document.getElementById("paymentForm").submit();
}