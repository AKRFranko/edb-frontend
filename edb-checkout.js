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


  function bucketSlug(string) {
    return 'edb_' + string.replace(/$edb_/, '');
  }

  function genToken(suffix) {
    suffix = suffix || '';
    return Number(Math.floor(Math.random() * Date.now()) + '' + Date.now()).toString(24) + suffix;
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

  Checkout.loadProducts = function loadProducts(products) {

    products.forEach(function(product,productIndex) {
      if (product.meta.edb_is_bucket == '1') {
        Buckets[product.meta.edb_bucket_slug] = {};
        product.variations.forEach(function(variation,variationIndex) {
          var option = variation.attributes[0].option;
          Buckets[product.meta.edb_bucket_slug][option] = createProductProxy( products, productIndex, variationIndex );
        });
      } else {
        Products.push(product);
      }
    }, Buckets);

    Products.forEach(function(product) {
      var productHasBucketAttributes = product.attributes.some(function(attribute) {
        var slug = bucketSlug(attribute.name);
        return !!Buckets[slug];
      });
      if (!productHasBucketAttributes) {
        throw new Error('Unhanded: NOT productHasBucketAttributes');
        // var token = genToken();
        // var item = Object.assign( { token: token }, product );
        // Catalog[token] = product;
      } else {
        // console.log('productHasBucketAttributes')
        var bucketAttributes = product.attributes.filter(function(attribute) {
          var slug = bucketSlug(attribute.name);
          return !!Buckets[slug];
        });
        var buckets = bucketAttributes.reduce(function(obj, attribute) {
          var slug = bucketSlug(attribute.name);
          obj[slug] = Buckets[slug];
          return obj;
        }, {});
        function removeDim( str ){
          return str.replace(/\d+x\d+/,'');
        }
        function fullName( product, option ){
          return product.name + ' ' + removeDim(option);
        }
        product.variations.forEach( function( variation, variationIndex ){
          Object.keys(buckets).forEach( function( bucketSlug ){
            var bucket = buckets[bucketSlug];
            var attributes = variation.attributes;
            Object.keys(bucket).forEach( function( bucketOption ){
              attributes.push({
                name: bucketSlug,
                bucket: bucket,
                option: bucketOption
              });
              var token = genToken( bucketOption );
              var catalogEntry = { 
                token: token,
                product: product,
                variation: variation,
                attributes: attributes,
              };
              Catalog[token]=catalogEntry;
            });
          });
          // console.log('v',variation);
        });
        console.log('Catalog');
        console.log(Catalog);
        
        // console.log('buckets')
        // console.dir(buckets);
        

        // buckets.forEach( function( bucket ){
        //   var token = genToken( bucket.meta.edb_bucket_slug );
        //   var copy = Object.assign( { token: token, bucket: bucket  }, product );
        //   copy.attributes.forEach( function( attr, index ){
        //     var slug = bucketSlug(attr.name);
        //     if(slug == bucket.meta.edb_bucket_slug){
        //       copy.attributes[index].option = 
        //     }
        //   })
        //   Catalog[token] = product;
        // });

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