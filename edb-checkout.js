(function(){
  
  var getToken = function(){ return (Math.random()*Date.now() + '' +Date.now()).toString(24) }
  console.log( getToken(),getToken(),getToken(),getToken() )
  var Cart = function( user ){
    if(user){
      this.user = user;
    }else{
      this.user = {
        name: 'guest',
        billing_address_1:'',
        billing_address_2:'',
        billing_city:'',
        billing_company:'',
        billing_country:'',
        billing_email:'',
        billing_first_name:'',
        billing_last_name:'',
        billing_phone:'',
        billing_postcode:'',
        billing_state:'',
        shipping_address_1:'',
        shipping_address_2:'',
        shipping_city:'',
        shipping_company:'',
        shipping_country:'',
        shipping_first_name:'',
        shipping_last_name:'',
        shipping_postcode:'',
        shipping_state:''
      }
    }
    var items = [];
    
    return this;
  }
  t
  
  
  
})()