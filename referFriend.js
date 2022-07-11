async function formSubmit(e) {
    e.preventDefault();
    let payload = buildPayload();
    let status = await referFriend(payload);
    if (status) {
        window.location.href = window.location.origin + '/refer-a-friend-thank-you';
        return(status);
    } else {
        console.log(`Refer Friend Request Failed`);
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

function validateForm() {
    // Referer Name and Email are required
    // At least 1 Referee's Name and Email are required
    const formData = new FormData(document.getElementById('wf-form-Refer-a-Friend'));
    if (formData.get('referrer_name') && formData.get('referrer_email') && 
    formData.get('friend_name_1') && formData.get('friend_email_1')) {
        hideFieldError('referrer_name');
        hideFieldError('referrer_email');
        hideFieldError('friend_name_1');
        hideFieldError('friend_email_1');
        return (true);
    } else {
        if (!formData.get('referrer_name')) {
            showFieldError('referrer_name');
        } else {
            hideFieldError('referrer_name');
        }
        if (!formData.get('referrer_email')) {
            showFieldError('referrer_email');
        } else {
            hideFieldError('referrer_email');
        }
        if (!formData.get('friend_name_1')) {
            showFieldError('friend_name_1');
        } else {
            hideFieldError('friend_name_1');
        }
        if (!formData.get('friend_email_1')) {
            showFieldError('friend_email_1');
        } else {
            hideFieldError('friend_email_1');
        }
    }
}

function onFormLoad() {
    document.getElementById('refer_friend_submit_btn').type = 'button';
    document.getElementById('refer_friend_submit_btn').addEventListener('click', formSubmit);
    document.getElementById('referrer_name').addEventListener('input', _isFieldNotEmpty);
    document.getElementById('referrer_email').addEventListener('input', _emailEventHandler);
    document.getElementById('friend_name_1').addEventListener('input', _isFieldNotEmpty);
    document.getElementById('friend_email_1').addEventListener('input', _emailEventHandler);
}

onFormLoad();