window.onload = () => {
    currentUrl();
    function currentUrl(){
        const urlParams = new URLSearchParams(window.location.search);
        const k_uid = urlParams.get('k_uid');
        const url = 'https://api.staging.eo.care/union/profile/careplan?kuid='+ k_uid ;
        const products_url = window.location.origin + window.location.pathname.replace('careplan', 'care-products')
        
        document.getElementById("plan-text").style.borderBottom = "1px solid #000000";
        document.getElementById("plan-text").style.marginTop = "1px"; 
        document.getElementById("your-plan-mobile-link").style.borderBottom = "1px solid #000000";
        
        //for modal overlay scroll hiding
        document.getElementById('rec').onclick = function disableScroll() {
            document.body.style.overflowY = 'hidden';
        };
        document.getElementById('rec-2').onclick = function disableScroll() {
            document.body.style.overflowY = 'hidden';
        };
        document.getElementById('close-button').onclick = function enableScroll() {
            document.body.style.overflowY = 'auto';
        }
        document.getElementById('close-button-2').onclick = function enableScroll() {
            document.body.style.overflowY = 'auto';
        }
        
        //for redirection of link with k_uid
        document.getElementById('your-products').onclick = function(){
            window.open( `${products_url}?k_uid=${k_uid}`)
        };
        document.getElementById('your-products-mobile-link').onclick = function(){
            window.open( `${products_url}?k_uid=${k_uid}`)
        };
        
        //fetch function starts
        fetch(url)
        .then((response) => {
        return response.json();
        })
        .then((data) => {
            window.localStorage.setItem("myObject", JSON.stringify(data.data));
            let newObject = window.localStorage.getItem("myObject");
            let me = JSON.parse(newObject);
            console.log(me);
            document.getElementById('care-name').innerHTML = me.fname;
        
            const mydate = me.care_plan.careplan_date;
            var part1 = mydate.slice(2, 4); 
            var part2 = mydate.slice(5, 7);
            var part3 = mydate.slice(8, 10);
            
            if (part2 < 10){ 
                var part2 = mydate.slice(6, 7);
            }
            if (part3 < 10){ 
                var part3 = mydate.slice(9, 10);
            }
        
            document.getElementById('care-date').innerHTML = part2 + '.' + part3 + '.' + part1;
            
            if(me.care_plan.workday.morning == '' && me.care_plan.workday.afternoon == ''){
                if(me.care_plan.workday.evening == '' && me.care_plan.workday.bedtime == ''){
                    document.getElementById('work-days').style.display = 'none'
                }
            } 
            
            if(me.care_plan.non_workday.morning == '' && me.care_plan.non_workday.afternoon == ''){
                if(me.care_plan.non_workday.evening == '' && me.care_plan.non_workday.bedtime == ''){
                    document.getElementById('non-work-days').style.display = 'none'
                }
            }
        
            if (me.care_plan.why_recommended != null){
                document.getElementById('dosing-para').innerHTML = me.care_plan.why_recommended.dosing;
                document.getElementById('mix-para').innerHTML = me.care_plan.why_recommended.product_mix;
                document.getElementById('bedtime-para').innerHTML = me.care_plan.why_recommended.bedtime;
            }
        
            const deliveryValue = document.getElementById('delivery-div')
            const pickupValue = document.getElementById('pickup-div')
            const warningItalic = document.getElementById('warning')
        
        
            if (me.care_plan.delivery_preference == false){
                deliveryValue.style.display = 'none';
                document.getElementById('home-message').style.display = 'none';
                document.getElementById('one-name-disp').innerHTML = me.care_plan.dispensary_name;
                document.getElementById('one-name-disp').href = me.care_plan.pickup_partner_link;
            }
            
            if (me.care_plan.delivery_preference == true){
                pickupValue.style.display = 'none';
                document.getElementById('pickup-message').style.display = 'none';
                document.getElementById('two-name-disp').innerHTML = me.care_plan.delivery_partner_name;
                document.getElementById('two-name-disp').href = me.care_plan.delivery_partner_link;
            }
            if (me.care_plan.careplan_contains_thc == false){
                warningItalic.style.display = 'none';
            }
        
            //rendering data on products div
        
            if (me.care_plan.workday.morning != ''){ 
                //workday morning [0]
                document.getElementById('wmorning').style.display = 'inline'
                document.getElementById('div-0').style.display = 'inline'
                document.getElementById('prod-0').innerHTML = me.care_plan.workday.morning[0].product;
                document.getElementById('intro-0').innerHTML =  me.care_plan.workday.morning[0].dose_title.split(me.care_plan.workday.morning[0].product)[0];
                
                document.getElementById('prod-0').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.morning[0].name}`;
            
                document.getElementById('use-0').innerHTML = me.care_plan.workday.morning[0].usage_instructions;
                if(me.care_plan.workday.morning[0].contains_thc == true){
                    document.getElementById('warn-0').style.display = 'inline';
                }
                document.getElementById('img-0').src = me.care_plan.workday.morning[0].category_image_url;
            
                if(typeof me.care_plan.workday.morning[1] != 'undefined'){ 
                    //workday morning [1]
                    document.getElementById('div-1').style.display = 'inline'
                    document.getElementById('prod-1').innerHTML = me.care_plan.workday.morning[1].product;
                    document.getElementById('intro-1').innerHTML =  me.care_plan.workday.morning[1].dose_title.split(me.care_plan.workday.morning[1].product)[0];
                    
                    document.getElementById('prod-1').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.morning[1].name}`;
            
                    document.getElementById('use-1').innerHTML = me.care_plan.workday.morning[1].usage_instructions;
                    if(me.care_plan.workday.morning[1].contains_thc == true){
                        document.getElementById('warn-1').style.display = 'inline';
                    }
                    document.getElementById('img-1').src = me.care_plan.workday.morning[1].category_image_url;
                }
            }
        
            if (me.care_plan.workday.afternoon != ''){ 
                //workday afternoon [0]
                document.getElementById('wafternoon').style.display = 'inline'
                document.getElementById('div-2').style.display = 'inline'
                document.getElementById('prod-2').innerHTML = me.care_plan.workday.afternoon[0].product;
                document.getElementById('intro-2').innerHTML =  me.care_plan.workday.afternoon[0].dose_title.split(me.care_plan.workday.afternoon[0].product)[0];
                
                document.getElementById('prod-2').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.afternoon[0].name}`;
                
                document.getElementById('use-2').innerHTML = me.care_plan.workday.afternoon[0].usage_instructions;
                if(me.care_plan.workday.afternoon[0].contains_thc == true){
                    document.getElementById('warn-2').style.display = 'inline';
                }
                document.getElementById('img-2').src = me.care_plan.workday.afternoon[0].category_image_url;
                
                if(typeof me.care_plan.workday.afternoon[1] != 'undefined'){ 
                    //workday afternoon [1]
                    document.getElementById('div-3').style.display = 'inline'
                    document.getElementById('prod-3').innerHTML = me.care_plan.workday.afternoon[1].product;
                    document.getElementById('intro-3').innerHTML =  me.care_plan.workday.afternoon[1].dose_title.split(me.care_plan.workday.afternoon[1].product);

                    document.getElementById('prod-3').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.afternoon[1].name}`;

                    document.getElementById('use-3').innerHTML = me.care_plan.workday.afternoon[1].usage_instructions;
                    if(me.care_plan.workday.afternoon[1].contains_thc == true){
                        document.getElementById('warn-3').style.display = 'inline';
                    }
                    document.getElementById('img-3').src = me.care_plan.workday.afternoon[1].category_image_url;
                }
            }
            
            if (me.care_plan.workday.evening != ''){ 
                //workday evening [0]
                document.getElementById('wevening').style.display = 'inline'
                document.getElementById('div-4').style.display = 'inline'
                document.getElementById('prod-4').innerHTML = me.care_plan.workday.evening[0].product;
                document.getElementById('intro-4').innerHTML =  me.care_plan.workday.evening[0].dose_title.split(me.care_plan.workday.evening[0].product)[0];
                
                document.getElementById('prod-4').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.evening[0].name}`;
                
                document.getElementById('use-4').innerHTML = me.care_plan.workday.evening[0].usage_instructions;
                if(me.care_plan.workday.evening[0].contains_thc == true){
                    document.getElementById('warn-4').style.display = 'inline';
                }
                document.getElementById('img-4').src = me.care_plan.workday.evening[0].category_image_url;
                
                if(typeof me.care_plan.workday.evening[1] != 'undefined'){ 
                    //workday evening [1]
                    document.getElementById('div-5').style.display = 'inline'
                    document.getElementById('prod-5').innerHTML = me.care_plan.workday.evening[1].product;
                    document.getElementById('intro-5').innerHTML =  me.care_plan.workday.evening[1].dose_title.split(me.care_plan.workday.evening[1].product)[0];
                    
                    document.getElementById('prod-5').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.evening[1].name}`;
                    
                    document.getElementById('use-5').innerHTML = me.care_plan.workday.evening[1].usage_instructions;
                    if(me.care_plan.workday.evening[1].contains_thc == true){
                        document.getElementById('warn-5').style.display = 'inline';
                    }
                    document.getElementById('img-5').src = me.care_plan.workday.evening[1].category_image_url;
                }
            }
            
            if(me.care_plan.workday.bedtime != ''){ 
                //workday bedtime [0]
                document.getElementById('div-6').style.display = 'inline'
                document.getElementById('wbedtime').style.display = 'inline'
                document.getElementById('prod-6').innerHTML = me.care_plan.workday.bedtime[0].product;
                document.getElementById('intro-6').innerHTML =  me.care_plan.workday.bedtime[0].dose_title.split(me.care_plan.workday.bedtime[0].product)[0];
                
                document.getElementById('prod-6').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.bedtime[0].name}`;
                
                document.getElementById('use-6').innerHTML = me.care_plan.workday.bedtime[0].usage_instructions;
                if(me.care_plan.workday.bedtime[0].contains_thc == true){
                    document.getElementById('warn-6').style.display = 'inline';
                }
                document.getElementById('img-6').src = me.care_plan.workday.bedtime[0].category_image_url;
                
                if(typeof me.care_plan.workday.bedtime[1] != 'undefined'){ 
                    //workday bedtime [1]
                    document.getElementById('div-7').style.display = 'inline'
                    document.getElementById('prod-7').innerHTML = me.care_plan.workday.bedtime[1].product;
                    document.getElementById('intro-7').innerHTML =  me.care_plan.workday.bedtime[1].dose_title.split(me.care_plan.workday.bedtime[1].product)[0];
                    
                    document.getElementById('prod-7').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.workday.bedtime[1].name}`;

                    document.getElementById('use-7').innerHTML = me.care_plan.workday.bedtime[1].usage_instructions;
                    if(me.care_plan.workday.bedtime[1].contains_thc == true){
                        document.getElementById('warn-7').style.display = 'inline';
                    }
                    document.getElementById('img-7').src = me.care_plan.workday.bedtime[1].category_image_url;
                }
            }
            
            if(me.care_plan.non_workday.morning != ''){ 
                //non workday morning [0]
                document.getElementById('div-8').style.display = 'inline'
                document.getElementById('nwmorning').style.display = 'inline'
                document.getElementById('prod-8').innerHTML = me.care_plan.non_workday.morning[0].product;
                document.getElementById('intro-8').innerHTML =  me.care_plan.non_workday.morning[0].dose_title.split(me.care_plan.non_workday.morning[0].product)[0];
                
                document.getElementById('prod-8').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.morning[0].name}`;
                
                document.getElementById('use-8').innerHTML = me.care_plan.non_workday.morning[0].usage_instructions;
                if(me.care_plan.non_workday.morning[0].contains_thc == true){
                    document.getElementById('warn-8').style.display = 'inline';
                }
                document.getElementById('img-8').src = me.care_plan.non_workday.morning[0].category_image_url;
                
                if(typeof me.care_plan.non_workday.morning[1] != 'undefined'){ 
                    //non workday morning [1]
                    document.getElementById('div-9').style.display = 'inline'
                    document.getElementById('prod-9').innerHTML = me.care_plan.non_workday.morning[1].product;
                    document.getElementById('intro-9').innerHTML =  me.care_plan.non_workday.morning[1].dose_title.split(me.care_plan.non_workday.morning[1].product)[0];
                    
                    document.getElementById('prod-9').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.morning[1].name}`;

                    document.getElementById('use-9').innerHTML = me.care_plan.non_workday.morning[1].usage_instructions;
                    if(me.care_plan.non_workday.morning[1].contains_thc == true){
                        document.getElementById('warn-9').style.display = 'inline';
                    }
                    document.getElementById('img-9').src = me.care_plan.non_workday.morning[1].category_image_url;
                }
            }
            
            if(me.care_plan.non_workday.afternoon != ''){ 
                //non workday afternoon [0]
                document.getElementById('div-10').style.display = 'inline'
                document.getElementById('nwafternoon').style.display = 'inline'
                document.getElementById('prod-10').innerHTML = me.care_plan.non_workday.afternoon[0].product;
                document.getElementById('intro-10').innerHTML =  me.care_plan.non_workday.afternoon[0].dose_title.split(me.care_plan.non_workday.afternoon[0].product)[0];
                
                document.getElementById('prod-10').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.afternoon[0].name}`;
                
                document.getElementById('use-10').innerHTML = me.care_plan.non_workday.afternoon[0].usage_instructions;
                if(me.care_plan.non_workday.afternoon[0].contains_thc == true){
                    document.getElementById('warn-10').style.display = 'inline';
                }
                document.getElementById('img-10').src = me.care_plan.non_workday.afternoon[0].category_image_url;
                
                if(typeof me.care_plan.non_workday.afternoon[1] != 'undefined'){ 
                    //non workday afternoon [1]
                    document.getElementById('div-11').style.display = 'inline'
                    document.getElementById('prod-11').innerHTML = me.care_plan.non_workday.afternoon[1].product;
                    document.getElementById('intro-11').innerHTML =  me.care_plan.non_workday.afternoon[1].dose_title.split(me.care_plan.non_workday.aftrenoon[1].product)[0];
                    
                    document.getElementById('prod-11').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.afternoon[1].name}`;

                    document.getElementById('use-11').innerHTML = me.care_plan.non_workday.afternoon[1].usage_instructions;
                    if(me.care_plan.non_workday.afternoon[1].contains_thc == true){
                        document.getElementById('warn-11').style.display = 'inline';
                    }
                    document.getElementById('img-11').src = me.care_plan.non_workday.afternoon[1].category_image_url;
                }
            }
            
            
            if(me.care_plan.non_workday.evening != ''){ 
                //non workday evening [0]
                document.getElementById('div-12').style.display = 'inline'
                document.getElementById('nwevening').style.display = 'inline'
                document.getElementById('prod-12').innerHTML = me.care_plan.non_workday.evening[0].product;
                document.getElementById('intro-12').innerHTML =  me.care_plan.non_workday.evening[0].dose_title.split(me.care_plan.non_workday.evening[0].product)[0];
                
                document.getElementById('prod-12').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.evening[0].name}`;

                document.getElementById('use-12').innerHTML = me.care_plan.non_workday.evening[0].usage_instructions;
                if(me.care_plan.non_workday.evening[0].contains_thc == true){
                    document.getElementById('warn-12').style.display = 'inline';
                }
                document.getElementById('img-12').src = me.care_plan.non_workday.evening[0].category_image_url;
                
                if(typeof me.care_plan.non_workday.evening[1] != 'undefined'){ 
                    //non workday evening [1]
                    document.getElementById('div-13').style.display = 'inline'
                    document.getElementById('prod-13').innerHTML = me.care_plan.non_workday.evening[1].product;
                    document.getElementById('intro-13').innerHTML =  me.care_plan.non_workday.evening[1].dose_title.split(me.care_plan.non_workday.evening[1].product)[0];
                    
                    document.getElementById('prod-13').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.evening[1].name}`;

                    document.getElementById('use-13').innerHTML = me.care_plan.non_workday.evening[1].usage_instructions;
                    if(me.care_plan.non_workday.evening[1].contains_thc == true){
                        document.getElementById('warn-13').style.display = 'inline';
                    }
                    document.getElementById('img-13').src = me.care_plan.non_workday.evening[1].category_image_url;
                }
            }
            
            if(me.care_plan.non_workday.bedtime != ''){ 
                //non workday bedtime [0]
                document.getElementById('div-14').style.display = 'inline'
                document.getElementById('nwbedtime').style.display = 'inline'
                document.getElementById('prod-14').innerHTML = me.care_plan.non_workday.bedtime[0].product;
                document.getElementById('intro-14').innerHTML =  me.care_plan.non_workday.bedtime[0].dose_title.split(me.care_plan.non_workday.bedtime[0].product)[0];
                
                document.getElementById('prod-14').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.bedtime[0].name}`;

                document.getElementById('use-14').innerHTML = me.care_plan.non_workday.bedtime[0].usage_instructions;
                if(me.care_plan.non_workday.bedtime[0].contains_thc == true){
                    document.getElementById('warn-14').style.display = 'inline';
                }
                document.getElementById('img-14').src = me.care_plan.non_workday.bedtime[0].category_image_url;
                
                if(typeof me.care_plan.non_workday.bedtime[1] != 'undefined'){ 
                    //non workday bedtime [1]
                    document.getElementById('div-15').style.display = 'inline'
                    document.getElementById('prod-15').innerHTML = me.care_plan.non_workday.bedtime[1].product;
                    document.getElementById('intro-15').innerHTML =  me.care_plan.non_workday.bedtime[1].dose_title.split(me.care_plan.non_workday.bedtime[1].product)[0];
                    
                    document.getElementById('prod-15').href = `${products_url}?k_uid=${k_uid}&productLink=${me.care_plan.non_workday.bedtime[1].name}`;

                    document.getElementById('use-15').innerHTML = me.care_plan.non_workday.bedtime[1].usage_instructions;
                    if(me.care_plan.non_workday.bedtime[1].contains_thc == true){
                        document.getElementById('warn-15').style.display = 'inline';
                    }
                    document.getElementById('img-15').src = me.care_plan.non_workday.bedtime[1].category_image_url;
                }
            }
        });
    
    }
}
    