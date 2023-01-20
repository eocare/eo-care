let submissionId

function getQueryParams() {
    const qs = new URLSearchParams(window.location.search)
    submissionId = qs.get('submission_id')
}

function validateAccountSetupForm() {

}

function validateZip() {

}

async function onFormSubmit() {
    const formValidationSuccess = validateAccountSetupForm()
    if (!formValidationSuccess) {
        throw Error();
    }
    const uid = await sendProfileOnboardingFormData(submissionId)
    sendAccountFormData(uid)
}

function saveToLocalStorage() {
    localStorage.setItem('nage_email', email)
}

async function sendProfileOnboardingFormData(submission_id) {
    try {
        const API_ROOT_DOMAIN = 'http://localhost:5001/eo-care/us-central1';
        const resp = await fetch(`${API_ROOT_DOMAIN}/profileOnboarding?submission_id=${submission_id}`, {
            method: 'GET',
            mode: 'cors'
        })

        if (resp.ok && resp.status === 200) {
            const { uid } = await resp.json()
            console.log(uid)
            return Promise.resolve(uid)
        } else {
            throw new Error(`Response Status: ${resp.status}`)
        }
    } catch (err) {
        return Promise.reject(err.message)
    }
}

async function sendAccountFormData(uid) {
    try {
        const API_ROOT_DOMAIN = 'https://1074-49-205-129-45.ngrok.io'
        const resp = await fetch(`${API_ROOT_DOMAIN}/web_flow/sign_up`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid,
                "email": "leonk3@nage.pain",
                "zip": "02127",
                "first_name": "Pain",
                "last_name": "Kennedy",
                "address_line_1": "Hji Blvd",
                "address_line_2": "",
                "payment_plan": "plan_monthly"
            })
        })

        if (resp.ok && resp.status === 200) {
            const { uid } = await resp.json()
            console.log(uid)
            return Promise.resolve(uid)
        } else {
            throw new Error(resp)
        }
    } catch (err) {
        console.log(err)
    }
}

async function test() {
    const uid = await sendProfileOnboardingFormData('5498492605635170237')
    sendAccountFormData(uid)
}

test()


function onload() {
    getQueryParams()
}