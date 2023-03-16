let refNameCheck = false;
let refEmailCheck = false;
let frndNameCheck = false;
let frndEmailCheck = false;

async function formSubmit(e) {
    e.preventDefault();
    _submittingState('refer_friend_submit_btn');
    let payload = buildPayload();
    let status = await referFriend(payload);
    if (status) {
        _successfulState('refer_friend_submit_btn');
        // TODO: URL: Update this if 'web' version is removed from the URL
        window.location.href = window.location.origin + '/web/refer-a-friend-thank-you';
        return(status);
    } else {
        console.log(`Refer Friend Request Failed`);
        _resetState('refer_friend_submit_btn');
        return(status);
    }
}

function buildPayload() {
    const formData = new FormData(document.getElementById('wf-form-Refer-a-Friend'));
    let payload = {
        "referral": {
            "recipients": [],
            "referrer_email": "",
            "referrer_name": ""
        }
    };

    if (formData.get('referrer_name') && formData.get('referrer_email')) {
        payload["referral"]["referrer_email"] = formData.get('referrer_email');
        payload["referral"]["referrer_name"] = formData.get('referrer_name');
    }

    if (formData.get('friend_name_1') && formData.get('friend_email_1')) {
        payload["referral"]["recipients"].push(
            {
                "email": formData.get('friend_email_1'),
                "name": formData.get('friend_name_1')
            }
        );
    }

    if (formData.get('friend_name_2') && formData.get('friend_email_2')) {
        payload["referral"]["recipients"].push(
            {
                "email": formData.get('friend_email_2'),
                "name": formData.get('friend_name_2')
            }
        );
    }

    if (formData.get('friend_name_3') && formData.get('friend_email_3')) {
        payload["referral"]["recipients"].push(
            {
                "email": formData.get('friend_email_3'),
                "name": formData.get('friend_name_3')
            }
        );
    }

    return (payload);
}

async function referFriend(payload) {
    const resp = await fetch(`${API_ROOT_DOMAIN}/referral`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
  
    if (resp.ok && resp.status === 200) {
        return true;
    } else {
        return false;
    }
}

function onFormLoad() {
    document.getElementById('refer_friend_submit_btn').type = 'button';
    document.getElementById('refer_friend_submit_btn').disabled = true;
    document.getElementById('refer_friend_submit_btn').addEventListener('click', formSubmit);
    document.getElementById('referrer_name').addEventListener('input', (e) => {
        refNameCheck = _isFieldNotEmpty(e, "Referrer's Name cannot be blank.");
        submitBtnCheck();
    });
    document.getElementById('referrer_email').addEventListener('input', (e) => {
        refEmailCheck = _emailEventHandler(e, "Referrer's Email cannot be blank.");
        submitBtnCheck();
    });
    document.getElementById('friend_name_1').addEventListener('input', (e) => {
        frndNameCheck = _isFieldNotEmpty(e, "Friend's Name cannot be blank. ");
        submitBtnCheck();
    });
    document.getElementById('friend_email_1').addEventListener('input', (e) => {
        frndEmailCheck = _emailEventHandler(e, "Friend's Email cannot be blank.");
        submitBtnCheck();
    });
}

function submitBtnCheck() {
    if (refEmailCheck && refNameCheck && frndNameCheck && frndEmailCheck) {
        document.getElementById('refer_friend_submit_btn').disabled = false;
    } else {
        document.getElementById('refer_friend_submit_btn').disabled = true;
    }
}

onFormLoad();