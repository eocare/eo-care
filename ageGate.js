const ageGateBtnYes = document.getElementById('age-gate-btn-yes');
const ageGateBtnNo = document.getElementById('age-gate-btn-no');

ageGateBtnYes.onclick = function (e) {
    e.target.dataset.selected = true;
    ageGateBtnNo.dataset.selected = false;
    e.target.style.backgroundColor = "#B4F9C7";
}

ageGateBtnNo.onclick = function (e) {
    e.target.dataset.selected = true;
    ageGateBtnYes.dataset.selected = false;
    ageGateBtnYes.style.backgroundColor = "";
}

function showAgeRestrictionModal() {
    document.getElementById('age-gate-form').style.display = 'none';
    document.getElementById('age-restriction-info-div').style.display = 'block';
    document.getElementById('ineligible-zip-div').style.display = 'none';
}

function showIneligibleZipModal() {
    document.getElementById('age-gate-form').style.display = 'none';
    document.getElementById('age-restriction-info-div').style.display = 'none';
    document.getElementById('ineligible-zip-div').style.display = 'block';
}

const ageGateFormSubmitBtn = document.getElementById('age-gate-form-submit');
ageGateFormSubmitBtn.onclick = async function (e) {
    e.preventDefault();
    if (ageGateBtnYes.dataset.selected === 'true') {
        const ageGateZip = document.getElementById('age-gate-inp-zip').value;
        let zipEligible = await isZipEligible(ageGateZip);
        if (zipEligible) {
            Cookies.set('validAge', true, { expires: 365 });
            window.location.replace('/home-wip');
        } else {
            showIneligibleZipModal();
        }
    } else {
        showAgeRestrictionModal();
    }
}

const stayInformedFormBtn = document.getElementById('stayInformedSubmitBtn');
stayInformedFormBtn.onclick = async function (e) {
    e.preventDefault();
    let zip = document.getElementsByName('zip')[0].value;
    let email = document.getElementById('stayInformedEmail').value;
    if (zip && email) {
        return await stayInformed(zip, email);
    }
}

async function isZipEligible(zip) {
    const API_ROOT_DOMAIN = 'https://api.staging.eo.care';
    const resp = await fetch(`${API_ROOT_DOMAIN}/profile/eligible`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "zip": zip
        })
    });

    if (resp.ok && resp.status === 200) {
        return true;
    } else {
        return false;
    }
}

async function stayInformed(zip, email) {
    const API_ROOT_DOMAIN = 'https://api.staging.eo.care';
    const resp = await fetch(`${API_ROOT_DOMAIN}/profile/subscribe`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "profile": {
                "email": email,
                "zip": zip
            }
        })
    });

    if (resp.ok && resp.status === 200) {
        return true;
    } else {
        return false;
    }
}