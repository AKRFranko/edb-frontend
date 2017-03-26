(function() {

  
  var Checkout = {}, Guest = {
    name: 'guest',
    billing_address_1: '',
    billing_address_2: '',
    billing_city: '',
    billing_company: '',
    billing_country: '',
    billing_email: '',
    billing_first_name: '',
    billing_last_name: '',
    billing_phone: '',
    billing_postcode: '',
    billing_state: '',
    shipping_address_1: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_company: '',
    shipping_country: '',
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_postcode: '',
    shipping_state: ''
  },
  Customer = Guest,
    Products = [],
    Buckets = {}, Catalog = {};


  function genToken(){
    return Number(Math.floor( Math.random() * Date.now() ) + '' + Date.now()).toString(24);
  };
  
  Checkout.setCustomer = function setCustomer(user) {
    if (!user) {
      Customer = Guest;
    } else {
      Customer = Object.assign(Guest, user);
    }
  }


  Checkout.loadProducts = function loadProducts(products) {
    
    products.forEach(function( product) {
      if(product.meta.edb_is_bucket == '1'){
        Buckets[product.meta.edb_bucket_slug]=product;
      }else{
        Products.push( product );
      }
    }, Buckets );
    
    Products.forEach( function( product ){
     var productHasBucketAttributes = product.attributes.some( function( attribute ){
       var slug = 'edb_' + attribute.name;
       return !!Buckets[slug];
     });
     if(!productHasBucketAttributes){
       var token = genToken();
       var item = Object.assign( { catalogToken: token }, product );
       Catalog[token] = product;
     }else{
       var bucketAttributes = product.attributes.filter( function( attribute ){
        var slug = 'edb_' + attribute.name;
        return !!Buckets[slug];
       });
       var buckets = bucketAttributes.map( function( attribute ){
         var slug = 'edb_' + attribute.name;
         return Buckets[slug];
       });
       
       console.log('buckets', buckets);
     }
    });
    // console.log('loadProducts',Catalog );
    
  }
  EDB.Checkout = Checkout;






  // var getToken = function(){ return (Math.random()*Date.now() + '' +Date.now()).toString(24) }

  // var Customer = function( user ){
  //   var customer = this;
  //   var defaultValues = {
  //                         name: 'guest',
  //                         billing_address_1:'',
  //                         billing_address_2:'',
  //                         billing_city:'',
  //                         billing_company:'',
  //                         billing_country:'',
  //                         billing_email:'',
  //                         billing_first_name:'',
  //                         billing_last_name:'',
  //                         billing_phone:'',
  //                         billing_postcode:'',
  //                         billing_state:'',
  //                         shipping_address_1:'',
  //                         shipping_address_2:'',
  //                         shipping_city:'',
  //                         shipping_company:'',
  //                         shipping_country:'',
  //                         shipping_first_name:'',
  //                         shipping_last_name:'',
  //                         shipping_postcode:'',
  //                         shipping_state:''
  //                       };
  //   Object.keys( user ).reduce( function( instance, key ){
  //     instance[key]=user[key];
  //     return instance;
  //   }, this  )
  //   Object.keys(defaultValues).reduce( function( instance, key ){
  //     if(!instance[key]){
  //       instance[key]=  defaultValues[key];
  //     }
  //     return instance;
  //   }, this );
  // };

  // var Cart = function(  ){
  //   var cart = this;

  //   var items = {};
  //   cart.addItem = function( prod, qty ){
  //     var token = getToken();
  //     items[token]={ cartToken: token, product: prod, quantity: qty };
  //     return token;
  //   }
  //   cart.updateItem = function( token, data ){
  //     if(!items[token]) return;
  //     Object.keys(data).forEach( function( key ){
  //       items[token][key]=data[key];
  //     });
  //   }
  //   cart.removeItem = function( token ){
  //     delete items[token];
  //   }
  //   cart.getItems = function(){
  //     return Object.keys(items).map( function( token){
  //       var item = items[token];
  //     });
  //   }
  //   cart.eachItem = function( fn ){
  //     return Object.keys(items).map( function( token ){
  //       return fn.call( null, items[token] );
  //     });
  //   }
  //   return cart;
  // };


  // var Checkout = {};



  // var Calc = {};
  // Calc.cartItem = function( item ){}
  // Calc.cartItem = function( item ){}




})()