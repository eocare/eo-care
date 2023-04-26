# eo-care

This repository is publicly available and contains JavaScript files that facilitate data validation, submission, and page redirection on the eo.care and partner.eo.care websites.

## Global Scripts
- global.js - Supports the login, log out, and password reset functionality (this functionality is currently removed from the website). 
- global.css - Styles the arrow buttons of carousel.
- referFriend.js - Used by https://www.eo.care/{union}/refer-a-friend
- about.js - Used by https://www.eo.care/{union}/about

## [NAGE](/NAGE/)
- createAccount.js - Used by https://www.eo.care/{union}/account page
- checkout.js - Used by https://www.eo.care/{union}/checkout page
- paymentStatus.js - Used by https://www.eo.care/{union}/payment-status
- profileCompletion.js - Used by https://www.eo.care/{union}/profile-completion
- profileOnboarding.js - 
- thankyou.js - Used by https://www.eo.care/{union}/thank-you

## [PainKit](/PainKit/)
- createAccount.js - Used by https://www.eo.care/kit/account
- thankyou.js - Used by https://www.eo.care/kit/thank-you

## [WebCarePlan](/WebCarePlan/)
- careplan.js - Used by https://www.eo.care/{union}/careplan
- products.js - Used by https://www.eo.care/{union}/care-products

## Scripts that are not currently in use
- ageGate.js - Supports the age gate form (currently not in use). Validates entered zip code by making a request to `/profile/eligible` end point.
- home.js - Enables home page to randomly select the hero section image and to enable animations on some sections of home page. (currently not in use)
- checkout.js - Supports checkout flow.
- createAccount.js - Enables `web_profile` creation.
- licenseUpload.js - Enables license file upload.
- paymentStatus.js - Supports payment-status page.


> Note: Any of the following values ['iaff', 'btu', 'ethos', 'web', 'ayr'] can be used in place of `{union}` in the above links.