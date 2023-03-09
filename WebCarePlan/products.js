document.getElementById("product-text").style.borderBottom = "1px solid #000000";
document.getElementById("product-text").style.marginTop = "1px";
document.getElementById("your-products-mobile-link").style.borderBottom = "1px solid #000000";

const urlParams = new URLSearchParams(window.location.search);
const k_uid = urlParams.get('k_uid'); 

const url = 'https://api.staging.eo.care/union/profile/careplan?kuid='+ k_uid ;

//url redirection with k_uid
document.getElementById('your-plan').onclick = function(){
    let careplan_url = window.location.origin + window.location.pathname.replace('care-products', 'careplan')
    window.open( `${careplan_url}?k_uid=${k_uid}`)
};

document.getElementById('your-plan-mobile-link').onclick = function(){
    let careplan_url = window.location.origin + window.location.pathname.replace('care-products', 'careplan')
    window.open( `${careplan_url}?k_uid=${k_uid}`)
};

//fetch function starts
fetch(url)
.then((response) => {
    return response.json();
})
.then((data) => {
    window.localStorage.setItem("myObject", JSON.stringify(data.data));
    const newObject = window.localStorage.getItem("myObject");
    const me = JSON.parse(newObject);
    document.getElementById('care-name').innerHTML = me.fname;
    const mydate = me.care_plan.careplan_date;
    var part1 = mydate.slice(2, 4); 
    var part2 = mydate.slice(5, 7);
    var part3 = mydate.slice(8, 10);

    if (part2 < 10){ 
        var part2 = mydate.slice(6, 7);
        console.log(part2)
    }
    if (part3 < 10){ 
        var part3 = mydate.slice(9, 10);
        console.log(part3)
    }

    var editPhone = me.care_plan.delivery_partner_phone;
    var part4 = editPhone.slice(0, 3); 
    var part5 = editPhone.slice(3, 6);
    var part6 = editPhone.slice(6);

    document.getElementById('care-date').innerHTML = part2 + '.' + part3 + '.' + part1;
    document.getElementById('pickup-address-code').innerHTML = me.care_plan.pickup_partner_address;
    document.getElementById('prod-address-code').innerHTML = part4 + '-' + part5 + '-' + part6;
    document.getElementById('one-name-disp').innerHTML = me.care_plan.dispensary_name;
    document.getElementById('two-name-disp').innerHTML = me.care_plan.delivery_partner_name;
    document.getElementById('one-name-disp').href = me.care_plan.pickup_partner_link;
    document.getElementById('two-name-disp').href = me.care_plan.delivery_partner_link;

    const deliveryValue = document.getElementById('delivery-div')
    const pickupValue = document.getElementById('pickup-div')

    if (me.care_plan.delivery_preference == false){
        deliveryValue.style.display = 'none';
    }
    if (me.care_plan.delivery_preference == true){
        pickupValue.style.display = 'none';
    }

    if (me.care_plan.products == ''){
        document.getElementById('final').style.display = 'none';
    }
    let total = 0;
    for(let i=0; i<16; i++){
        if (typeof me.products[i] != 'undefined'){
            document.getElementById('block-' + i).style.display = 'flex'
            document.getElementById('name-' + i).innerHTML = me.products[i].name;
            document.getElementById('weight-' + i).innerHTML = me.products[i].weight;
            document.getElementById('image-' + i).src = me.products[i].image_url;
            document.getElementById('price-' + i).innerHTML = parseFloat(me.products[i].price).toFixed(2);
            console.log(me.products[i].quantity.indexOf("g"))

            if(me.products[i].quantity.includes('unit(s)')) { 
                var quant = me.products[i].quantity.replace(' unit(s)', '') 
            } else if (me.products[i].quantity.includes('gram(s)')) {
                var quant =  me.products[i].quantity.replace(' gram(s)', 'g') 
            }
            document.getElementById('quantity-' + i).innerHTML = quant;
            if(me.products[i].about == null){
                document.getElementById('info-' + i).style.display = 'none';
            }
            if(me.products[i].about != null){
                var about = me.products[i].about;
                //var aboutInfo = about.replace("-","\n-");
                var aboutInfo = about.replaceAll("\n","<br>");
                console.log(aboutInfo);
                document.getElementById('info-' + i).innerHTML = aboutInfo;
            }
            document.getElementById('ac-' + i).src = me.products[i].accessory_image_url;
            document.getElementById('need-' + i).innerHTML = me.products[i].what_you_will_need;
            if(me.products[i].what_you_will_need == null){
                document.getElementById('what-' + i).style.display = 'none';
            }
            document.getElementById('block-' + i).setAttribute("id", me.products[i].name);
            //total += me.products[i].price.valueOf();
            //total += parseFloat(me.products[i].price);
            total += Number(me.products[i].price);
        }
    }
    document.getElementById('total-price').innerHTML = parseFloat(total).toFixed(2);
    //test code here
    setTimeout(function smoothScroll(){
        const elementID = urlParams.get('productLink');
        console.log(elementID);
        document.getElementById(elementID).scrollIntoView({behavior: 'smooth'});
    },2000);
}); 