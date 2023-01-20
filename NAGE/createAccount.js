
async function isZipEligible(zip) {
    const resp = await fetch('https://api.eo.care/profile/eligible', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: "cors",
        body: JSON.stringify({
            "zip": zip
        })
    });
    console.log(resp.ok)
    if (resp.ok && resp.status === 200) {
        return true;
    } else {
        return false;
    }
}

async function myFun(e) {
    let zip = document.getElementById('input_73_field_11').value;
    if (zip.length === 5) {
        let zipValid = await isZipEligible(zip)
        let errorLabel = document.getElementById('zipErrorMessage')
        let subLabel = document.getElementById('sublabel_73_field_11')
        let nextBtn = document.getElementById('firstNext')
        if (zipValid) {
        errorLabel.style.display = 'none'
        nextBtn.disabled = false
        subLabel.style.display = ''
        } else {
        errorLabel.style.display = ''
        subLabel.style.display = 'none'
        nextBtn.disabled = true
        }
    }
}