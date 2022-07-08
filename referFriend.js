async function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('wf-form-Refer-a-Friend'));
    let payload = {
        "referral": {
            "recipients": [],
            "referrer_email": "",
            "referrer_name": ""
        }
    };
    if (formData.get('referrer_name') && formData.get('referrer_email')) {
        payload["referrer_email"] = formData.get('referrer_email');
        payload["referrer_name"] = formData.get('referrer_name');
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
    
    let status = await referFriend(payload);
    if (status) {
        window.location.href = window.location.origin + '/refer-a-friend-thank-you';
        return(status);
    } else {
        console.log(`Refer Friend Request Failed`);
        return(status);
    }
}

function referFriend(payload) {
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
    document.getElementById('refer_friend_submit_btn').addEventListener('click', formSubmit);
}

window.onload(onFormLoad);