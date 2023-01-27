function onload() {
    const qs = new URLSearchParams(window.location.search)
    const thcPlanType = qs.get('thc_plan_type')
    const medCardStatus = qs.get('med_card_status')
    const recDeliveryPossible = qs.get('rec_delivery_possible')
    const medDeliveryOnly = qs.get('med_delivery_only')

    const _iframeDivId = 'JotFormIFrame-230184858952466'
    document.getElementById(_iframeDivId).src =  `https://form.jotform.com/230184858952466?thc_plan_type=${thcPlanType}&med_card_status=${medCardStatus}&rec_delivery_possible=${recDeliveryPossible}&med_delivery_only=${medDeliveryOnly}`
    document.getElementById(_iframeDivId).style.display = ''
    document.getElementById(_iframeDivId).style.height = '100%'
    document.getElementById(_iframeDivId).style.width = '100%'
}

// setTimeout(onload, 800)
onload()