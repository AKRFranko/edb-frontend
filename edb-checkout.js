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
    Buckets = {}, Catalog = {}, Cart = {}, Blackboard = {};


  function sortAlpha(array, key) {
    return array.sort(function(a, b) {
      var textA = a[key];
      var textB = b[key];
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }


  function tokenizeAttr(pid, attributes) {
    if (!Array.isArray(attributes)) {
      attributes = Object.keys(attributes).map(function(k) {
        return {
          name: k,
          option: attributes[k]
        };
      })
    }
    return pid + ';' + sortAlpha(attributes, 'name').reduce(function(s, a) {
      return s + stripEDB(a.name) + ':' + a.option + ';';
    }, '');

  }

  function bucketSlugIt(string) {
    return 'edb_' + stripEDB(string);
  }

  function stripEDB(string) {
    return string.replace(/edb_/, '');
  }

  function genSlug(p, v) {
    return p.id + '-' + v;
  };

  function genToken() {
    return Number(Date.now() + '' + Math.floor(Math.random() * Date.now())).toString(24);
  }


  // remove 99x99 from variation name;
  function removeDim(str) {
    return str.replace(/\d+x\d+/, '');
  }
  // create variation name
  function fullName(product, option) {
    return product.name + ' ' + removeDim(option);
  }

  function loadSessionCart(){
    var sessionCartKeys = Object.keys(sessionStorage).filter( function( key ){
      return /^EDB_CART|/.test( key );
    });
    var sessionItems = sessionCartKeys.map( function( key ){
      return sessionStorage.getItem(key);
    });
    console.log('sessionItems',sessionItems);
    
  }
  function addCatalogEntry(product, option, variations) {
    var token = genSlug(product, option);

    var catalogEntry = {
      token: token,
      product: product,
      variations: variations,
      name: fullName(product, option)
    };

    var pid = product.id;
    // Blackboard[pid]=Blackboard[pid]||{};
    variations.forEach(function(v) {
      var uuid = tokenizeAttr(pid, v.attributes);
      Blackboard[uuid] = Object.assign({
        variation: v
      }, catalogEntry);
    });
    Catalog[token] = catalogEntry;

  }


  function createProductProxy(products, productIndex, variationIndex, obj) {
    var proxy = obj || {};
    Object.defineProperties(proxy, {
      variation: {
        configurable: true,
        enumerable: true,
        get: function() {
          return products[productIndex].variations[variationIndex];
        },
        valueOf: function() {
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



  Checkout.productHasBucketAttributes = function productHasBucketAttributes(product) {
    return product.attributes.some(function(attribute) {
      var slug = bucketSlugIt(attribute.name);
      return !!Buckets[slug];
    })
  }

  Checkout.getProductAttributeBuckets = function getProductAttributeBuckets(product) {
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

  Checkout.init = function loadProducts(products, catalogCallback) {
    

    products.forEach(function(product, productIndex) {
      if (product.meta.edb_is_bucket == '1') {
        Buckets[product.meta.edb_bucket_slug] = {};
        product.variations.forEach(function(variation, variationIndex) {
          var option = variation.attributes[0].option;
          Buckets[product.meta.edb_bucket_slug][option] = createProductProxy(products, productIndex, variationIndex);
        });
      } else {
        if (product.variations.length == 0) {
          console.log(product.name, 'has no variations but has attributes: ', product.attributes);
        }
        Products[product.id] = product;

      }
    }, Buckets);

    Object.keys(Products).forEach(function(productId) {
      var product = Products[productId];
      var hasBucketAttributes = Checkout.productHasBucketAttributes(product);
      if (!hasBucketAttributes) {
        console.error(new Error('Unhanded: NOT productHasBucketAttributes'));
        console.log(product);
        addCatalogEntry(product, '', product.variations);

      } else {
        console.log('productHasBucketAttributes')
        var buckets = Checkout.getProductAttributeBuckets(product);
        Object.keys(buckets).forEach(function(bucketSlug) {
          var bucket = buckets[bucketSlug];
          // expand variations to include bucket attributes.
          Object.keys(bucket).forEach(function(bucketOption) {
            var newVariations = [];
            product.variations.forEach(function(variation) {
              var copy = Object.assign({}, variation);
              var copyAttributes = [].concat(variation.attributes);
              var newAttribute = {};
              Object.defineProperties(newAttribute, {
                name: {
                  enumerable: true,
                  value: bucketSlug
                },
                option: {
                  enumerable: true,
                  value: bucketOption
                },
                bucket: {
                  enumerable: true,
                  get: function() {
                    return buckets[bucketSlug];
                  }
                }
              });
              copyAttributes.push(newAttribute);
              copy.attributes = copyAttributes;
              newVariations.push(copy);
            });
            addCatalogEntry(product, bucketOption, newVariations);
          });
        });


      }
    });



    var entries = Object.keys(Catalog).map(function(k) {
      return Catalog[k];
    });
    
    console.log('Catalog loaded with %s items', entries.length);

    catalogCallback(entries);
    
    loadSessionCart();
    
    runTest(entries);
  
  }






  // EDB.getProductStock = function(productId, attributes ){
  //   var baseStock = Products[productId].stockQuantity;
  //   if(Products[productId].variations.length == 0 ){
  //     return baseStock;
  //   }
  //   console.log('find stock',Products[productId], attributes );
  //   return 0;
  // }
  Checkout.addToCart = function(productId, attributes, qty) {
    var uuid = tokenizeAttr(productId, attributes);
    var entry = Blackboard[uuid];
    var cartItem = Cart[uuid];
    if (!entry) {
      console.error('NOT ENTRY', uuid);
      return null;
    } else {
      // if already in cart, update quantity;
      if (cartItem) {
        cartItem.quantity = cartItem.quantity + qty;
        sessionStorage.setItem('EDB_CART|'+uuid, cartItem.quantity );
        if (cartItem.quantity == 0) {
          Checkout.removeFromCart(uuid);
        }
      } else {
        // add to cart.
        Cart[uuid] = Object.assign({
          quantity: qty
        }, entry);
        sessionStorage.setItem('EDB_CART|'+uuid, qty );
      }
    }
  };

  Checkout.removeFromCart = function(uuid) {
    delete Cart[uuid];
    sessionStorage.removeItem('EDB_CART|'+uuid);
  };

  Checkout.getStock = function(productId, attributes) {
    if (!attributes) {
      console.log('not attributes', productId, attributes);
    } else {

      var uuid = tokenizeAttr(productId, attributes);
      var entry = Blackboard[uuid];
      var cartItem = Cart[uuid];
      var cartItemQty = (cartItem ? cartItem.quantity : 0);
      if (!entry) {
        // console.error('NOT ENTRY',productId,attrToken, Object.keys(Blackboard[productId]));
        return null;
      }
      var hasBuckets = Checkout.productHasBucketAttributes(entry.product);
      if (!hasBuckets) {
        console.log('returning variation stock, cartItem:', cartItem);
        return entry.variation.stock_quantity;
      }
      var minBucketCount = entry.variation.attributes.reduce(function(min, attr) {
        if (!attr.bucket) return min;
        var qty = attr.bucket[attr.option].variation.stock_quantity - cartItemQty;
        if (qty === null) return min;
        if (min === null) return qty;
        if (qty < min) return qty;
        return min;
      }, null);
      var variationQty = entry.variation.stock_quantity === null ? 0 : entry.variation.stock_quantity;
      // console.log('returning min stock, cartITem', cartItem );
      return Math.min(minBucketCount === null ? 0 : minBucketCount, variationQty) - cartItemQty;
    }
  }


  function runTest(entries) {


    entries.forEach(function(e) {
      var pid = e.product.id;

      e.variations.forEach(function(v) {
        var attrs = v.attributes.reduce(function(o, a) {
          o[a.name] = a.option;
          return o;
        }, {});
        console.log(e.name, 'Stock', Checkout.getStock(pid, attrs));


      });

    });
  }
  EDB.Checkout = Checkout;

})()