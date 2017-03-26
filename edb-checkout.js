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
    Products = {},
    Buckets = {}, Catalog = {};


  function bucketSlugIt(string) {
    return 'edb_' + string.replace(/$edb_/, '');
  }

  function genToken(p,v) {
    return p.id+'-'+v;
  };

  

  function createProductProxy( products , productIndex, variationIndex, obj ){
    var proxy = obj||{};
    Object.defineProperties(proxy, {
      variation: {
        configurable: true,
        enumerable: true,
        get: function() {
            return products[productIndex].variations[variationIndex];
        },
        valueOf: function(){
          return products[productIndex].variations[variationIndex];
        }
      },
      product: {
        configurable: true,
        enumerable: true,
        get: function() {
            return products[productIndex];
        }
      }
    });
    return proxy;
  }
  
  Checkout.setCustomer = function setCustomer(user) {
    if (!user) {
      Customer = Guest;
    } else {
      Customer = Object.assign(Guest, user);
    }
  }

  Checkout.loadProducts = function loadProducts(products, catalogCallback ) {

    products.forEach(function(product,productIndex) {
      if (product.meta.edb_is_bucket == '1') {
        Buckets[product.meta.edb_bucket_slug] = {};
        product.variations.forEach(function(variation,variationIndex) {
          var option = variation.attributes[0].option;
          Buckets[product.meta.edb_bucket_slug][option] = createProductProxy( products, productIndex, variationIndex );
        });
      } else {
        if(product.variations.length == 0){
            console.log(product.name, 'has no variations but has attributes: ', product.attributes);
        }
        Products[product.id] = product;  

      }
    }, Buckets);

    Object.keys(Products).forEach(function(productId) {
      var product = Products[productId];
      var productHasBucketAttributes = product.attributes.some(function(attribute) {
        var slug = bucketSlugIt(attribute.name);
        return !!Buckets[slug];
      });
      if (!productHasBucketAttributes) {
        throw new Error('Unhanded: NOT productHasBucketAttributes');
        
      } else {
        console.log('productHasBucketAttributes')
        var bucketAttributes = product.attributes.filter(function(attribute) {
          var slug = bucketSlugIt(attribute.name);
          return !!Buckets[slug];
        });
        var buckets = bucketAttributes.reduce(function(obj, attribute) {
          var slug = bucketSlugIt(attribute.name);
          
          obj[slug] = Buckets[slug];
          return obj;
        }, {});
        function removeDim( str ){
          return str.replace(/\d+x\d+/,'');
        }
        function fullName( product, option ){
          return product.name + ' ' + removeDim(option);
        }
        Object.keys(buckets).forEach( function( bucketSlug ){
          var bucket = buckets[bucketSlug];
          
          Object.keys(bucket).forEach( function( bucketOption ){
            var newVariations = [];  
            product.variations.forEach( function( variation ){
              var copy = Object.assign( {},variation );
              var copyAttributes = [].concat(variation.attributes);
              
              copyAttributes.push({
                name: bucketSlug,
                option: bucketOption,
                bucket: bucket
              });
              copy.attributes = copyAttributes;
              newVariations.push( copy );
            });
            
            var token = genToken( product, bucketOption );
            
            var catalogEntry = { 
              token: token,
              product: product,
              variations: newVariations,
              name: fullName( product, bucketOption )
            };
            
            Catalog[token]=catalogEntry;
            
          });
        });

       
      }
    });


    console.log('Catalog Loaded!',Object.keys(Catalog).length, 'entries.' );
    
    if(catalogCallback){
      var entries = Object.keys(Catalog).map( function( k ){ return Catalog[k]; });
      console.log('Catalog', entries );
      catalogCallback( entries );
    }
    
  }
  EDB.Checkout = Checkout;


  

  EDB.getProductStock = function(productId, attributes ){
    var baseStock = Products[productId].stock
  }
  EDB.addToCart = function( productId, attributes, qty ){
    console.log('addToCart',productId, attributes, qty);
    
  }


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