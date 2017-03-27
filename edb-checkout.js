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
    Buckets = {}, Catalog = {},Cart = {},Blackboard={};



  function tokenizeAttr(attributes){
    if(Array.isArray(attributes)){
      return attributes.reduce( function( s, a){
        return s + a.name+':'+a.option + ';';
      }, ''  );  
    }else{
      return Object.keys(attributes).reduce( function( s, a){
        return s + a+':'+attributes[a] + ';';
      }, ''  );  
    }
    
  }
  
  function bucketSlugIt(string) {
    return 'edb_' + string.replace(/$edb_/, '');
  }

  function genSlug(p,v) {
    return p.id+'-'+v;
  };
  function genToken(){
    return Number( Date.now() + '' + Math.floor( Math.random() * Date.now() )  ).toString(24);
  }
  
  
  // remove 99x99 from variation name;
  function removeDim( str ){
    return str.replace(/\d+x\d+/,'');
  }
  // create variation name
  function fullName( product, option ){
    return product.name + ' ' + removeDim(option);
  }
  
  function addCatalogEntry( product, option, variations ){
    var token = genSlug( product, option );
    
    var catalogEntry = { 
      token: token,
      product: product,
      variations: variations ,
      name: fullName( product, option )
    };
    var pid = product.id;
    Blackboard[pid]={};
    variations.forEach( function( v  ){
        var attrs = tokenizeAttr(v.attributes);
        Blackboard[pid][attrs]=Object.assign( { variation: v }, catalogEntry );
    }); 
    Catalog[token]=catalogEntry;
    
  }
  

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
  
  
  
  Checkout.productHasBucketAttributes = function productHasBucketAttributes( product ){
    return product.attributes.some( function( attribute){
        var slug = bucketSlugIt(attribute.name);
        return !!Buckets[slug];
    })
  }
  
  Checkout.getProductAttributeBuckets = function getProductAttributeBuckets( product ){
    var bucketAttributes = product.attributes.filter(function(attribute) {
      var slug = bucketSlugIt(attribute.name);
      return !!Buckets[slug];
    });
    return bucketAttributes.reduce(function(obj, attribute) {
      var slug = bucketSlugIt(attribute.name);
      
      obj[slug] = Buckets[slug];
      return obj;
    }, {});
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
      var hasBucketAttributes = Checkout.productHasBucketAttributes( product );
      if (!hasBucketAttributes) {
        console.error(new Error('Unhanded: NOT productHasBucketAttributes'));
        console.log(product);
        addCatalogEntry( product, '', product.variations );
        
      } else {
        console.log('productHasBucketAttributes')
        var buckets = Checkout.getProductAttributeBuckets( product );
        Object.keys(buckets).forEach( function( bucketSlug ){
          var bucket = buckets[bucketSlug];
          // expand variations to include bucket attributes.
          Object.keys(bucket).forEach( function( bucketOption ){
            var newVariations = [];  
            product.variations.forEach( function( variation ){
              var copy = Object.assign( {},variation );
              var copyAttributes = [].concat(variation.attributes);
              var newAttribute = {};
              Object.defineProperties(newAttribute, {
                name: { enumerable: true, value: bucketSlug },
                option: { enumerable: true, value: bucketOption },
                bucket: {enumerable: true, get: function(){
                  return buckets[bucketSlug];
                }}
              });
              copyAttributes.push(newAttribute);
              copy.attributes = copyAttributes;
              newVariations.push( copy );
            });
            addCatalogEntry( product, bucketOption, newVariations );
          });
        });

       
      }
    });

    

    var entries = Object.keys(Catalog).map( function( k ){ return Catalog[k]; });
    console.log('Catalog loaded with %s items',entries.length);
    catalogCallback( entries );
    
    runTest( entries );
    
  }
  
  


  

  // EDB.getProductStock = function(productId, attributes ){
  //   var baseStock = Products[productId].stockQuantity;
  //   if(Products[productId].variations.length == 0 ){
  //     return baseStock;
  //   }
  //   console.log('find stock',Products[productId], attributes );
  //   return 0;
  // }
  Checkout.addToCart = function( productId, attributes, qty ){
    console.log('addToCart',productId, attributes, qty);
    var token = genToken();
    Cart[token] = { 
      productId: productId, 
      attributes: attributes, 
      qty: qty, 
      token: token
    };
    return token;
  };
  
  Checkout.removeFromCart = function( token ){
    delete Cart[token];
  };
  
  Checkout.removeFromCart = function( token ){
    delete Cart[token];
  };

  Checkout.getStock = function( productId, attributes ){
    if(!attributes){
      console.log('not attributes', productId, attributes );
    }else{
      
      var attrToken = tokenizeAttr(attributes);
      var entry = Blackboard[productId][attrToken];  
      if(!entry){
        return console.log('NOT ENTRY',productId,attrToken);
      }
      var hasBuckets = Checkout.productHasBucketAttributes( entry.product );
      if(!hasBuckets){
        return entry.variation.stock_quantity;
      }else{
        var minBucketCount = entry.variation.attributes.reduce( function( min, attr ){
          if(!attr.bucket) return min;
          console.log('bucket', attr.bucket[attr.option].variation);
          return min;
        }, null );
        // console.log(entry.variation)
      }
      return entry;
    }
    
    
    
  
  }
  
  function runTest(entries){
     
      
      entries.forEach( function( e ){
        var pid = e.product.id;
        
        e.variations.forEach( function( v  ){
            var attrs = v.attributes.reduce( function( o, a){
                o[a.name]=a.option;
                return o;
            }, {} );
            console.log(e.name);
            console.log('', Checkout.getStock(pid, attrs) );
            console.log('______');
            // console.log( )  
        });  
        
        
        
      });
  }
  EDB.Checkout = Checkout;

})()