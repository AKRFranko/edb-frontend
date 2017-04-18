(function() {


  var app;
  var Checkout = {}, Guest = {
    name: 'guest',
    billing_first_name: '',
    billing_last_name: '',
    billing_company: '',
    billing_phone: '18888888888',
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
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_company: '',
    shipping_phone: '',
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
  
  var taxes = {
    AB: [0, 0.05],
    BC: [0.07,0.05],
    MB: [0.08,0.05],
    NB:[0.10,0.05],
    NL:[0.10,0.05],
    NS:[0.10,0.05],
    NT:[0,0.05],
    NU:[0,0.05],
    ON:[0.08,0.05],
    PE:[0.10,0.05],
    QC:[0.09975,0.05],
    SK:[0.06,0.05],
    YT:[0.00,0.05]
  }
  
  function calcTax( province, amount, tax){
    var t = 0;
    if(tax === 0){
     t = taxes[province][0];
    }else if( tax === 1){
     t = taxes[province][1];
    }else{
      t = taxes[province][0] + taxes[province][1];
    }
    return Number((amount*t).toFixed(2));
    
  }
  
   
  
  
  
  

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
        var opt = attributes[k];
        return {
          name: k,
          option: Array.isArray(opt) ? '*' : opt
        };
      })
    }
    attributes = attributes.filter(function(a) {
      return a
    });
    return pid + ';' + sortAlpha(attributes, 'name').reduce(function(s, a) {
      return s + stripEDB(a.name) + ':' + a.option + ';';
    }, '');

  }
  
  function expandToken( uuid ){
    var parts = uuid.split(';');
    var pid = parts.shift();
    var obj = parts.reduce( function(o,p){
      var ab = p.split(':');
      o[ab[0]]=ab[1];
      return o;
    }, {});
    return [ pid, obj ];
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
    return (str || '').replace(/\d+x\d+/, '');
  }
  // create variation name
  function fullName(product, option) {
    return product.name + ' ' + removeDim(option);
  }

  function loadSessionCart() {
    var sessionCartKeys = Object.keys(localStorage).filter(function(key) {
      return /^EDB_CART/.test(key)
    });
    var h48 = 60 * 60 * 48 * 1000;
    var sessionItems = sessionCartKeys.map(function(key) {
      return JSON.parse(localStorage.getItem(key));
    }).filter(function(item) {
      return (Date.now() - item.stored < h48)
    });
    sessionItems.forEach(function(item) {
      Checkout.addToCart(item.pid, item.attributes, item.quantity);
    });
    // console.log('sessionItems', sessionItems);
  }


  function updateApp() {
    if (!app) return;
    app.debounce('updateApp', function() {


      EDB.Checkout.setCustomer(window.CurrentUser);

      app.set('customer', Customer);

      // app.set('cart', [] );
      // app.set('catalog', []);

      app.set('cart', Object.keys(Cart).map(function(uuid) {
        return Cart[uuid];
      }));

      if (!app.catalog) {
        app.set('catalog', Object.keys(Catalog).map(function(uuid) {
          return Catalog[uuid];
        }));
      }




      app.get('cart').forEach(function(item, index) {
        Object.keys(item).forEach(function(k) {
          app.notifyPath('cart.' + index + '.' + k, item[k]);
        });
      });

      app.get('catalog').forEach(function(item, index) {
        Object.keys(item).forEach(function(k) {
          app.notifyPath('catalog.' + index + '.' + k, item[k]);
        });
      });

      // console.log('updateApp', app.get('cart'));

    })


  }

  function addCatalogEntry(product, option, variations) {
    var token = tokenizeAttr(product.id, option, product.group);

    if (product.id == 198) {
      console.log('token', token);
    }
    var catalogEntry = {
      token: token,
      product: product,
      variations: variations,
      name: fullName(product, option[Object.keys(option)[0]]),
      option: option
    };


    var pid = product.id;
    // Blackboard[pid]=Blackboard[pid]||{};

    variations.forEach(function(v) {

      var uuid = tokenizeAttr(pid, v.attributes, product.group);
      Blackboard[uuid] = Object.assign({
        uuid: uuid,
        variation: v
      }, catalogEntry);


    });

    if (product.group) {

      var uuid = tokenizeAttr(pid, product.attributes, product.group);
      Blackboard[uuid] = Object.assign({
        uuid: uuid,
        group: product.group
      }, catalogEntry);
      //   // console.log('variations',variations, pid);
    }
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

  Checkout.computeCartTotals = function() {
    var subTotal = 0;
    var shippingClass= getShippingClassForCart();
    var shippingZone = Checkout.getZone();
    
    var lines = [];
    Object.keys(Cart).forEach(function(uuid) {
      var total = Cart[uuid].quantity * Checkout.getPrice(Cart[uuid].product.id, Cart[uuid].variation.attributes);
      subTotal += total;
      return lines.push({
        label: (Cart[uuid].name + ' x' + Cart[uuid].quantity).toLowerCase(),
        value: total
      });
    });
    var shippingCost = Checkout.getShippingRate( shippingClass,shippingZone, subTotal );
    
    subTotal += shippingCost;
    lines.push({
      label: 'shipping',
      value:shippingCost,
      note: shippingZone
    });
    lines.push({
      label: 'SUBTOTAL',
      value: subTotal
    });
    lines.push({
      label: 'tax',
      value: calcTax( 'QC', subTotal, 0 ) ,
      note: 'provincial'
    });
    lines.push({
      label: 'tax',
      value: calcTax( 'QC', subTotal, 1 ) ,
      note: 'federal'
    });
    
    lines.push({
      label: 'tax total',
      value: calcTax( 'QC', subTotal ) 
    });


    lines.push({
      label: 'TOTAL',
      value: subTotal +  calcTax( 'QC', subTotal ) 
    });
    

    return lines;

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
    user = user;
    // console.log('setCustomer', user );

    if (!user) {
      Customer = Guest;
    } else {
      Customer = Object.assign(Guest, user.customer_meta, {
        name: user.name
      });
    }

  }

  Checkout.init = function loadProducts(polymerApp, products) {
    app = polymerApp;

    products.forEach(function(product, productIndex) {

      if (product.meta.edb_is_bucket == '1') {
        Buckets[product.meta.edb_bucket_slug] = {};
        product.variations.forEach(function(variation, variationIndex) {
          var option = variation.attributes[0].option;
          Buckets[product.meta.edb_bucket_slug][option] = createProductProxy(products, productIndex, variationIndex);
        });
      } else {
        if (product.variations.length == 0) {
          if (product.meta.edb_group_ids) {
            var gids = product.meta.edb_group_ids.trim().split(',').map(function(id) {
              return id.trim()
            });

            Object.defineProperty(product, 'group', {
              enumerable: true,
              get: function() {
                return gids.map(function(i) {
                  var prod = Products[i];

                  return Products[i];
                });
              }
            });
          };
        }
        Products[product.id] = product;

      }
    }, Buckets);

    Object.keys(Products).forEach(function(productId) {
      var product = Products[productId];
      if (product.group) {
        Checkout.enhanceGroupAttributes(product);
        // addCatalogEntry(product, {}, [], product.group ) ;

      }

      var hasBucketAttributes = Checkout.productHasBucketAttributes(product);
      if (!hasBucketAttributes) {
        console.error(new Error('Unhanded: NOT productHasBucketAttributes'));
        // console.log(product);
        addCatalogEntry(product, {}, product.variations);

      } else {
        // console.log('productHasBucketAttributes')
        var buckets = Checkout.getProductAttributeBuckets(product);
        Object.keys(buckets).forEach(function(bucketSlug) {
          var bucket = buckets[bucketSlug];
          // expand variations to include bucket attributes.
          Object.keys(bucket).forEach(function(bucketOption) {
            var newVariations = [];

            product.variations.forEach(function(variation) {
              if (Array.isArray(variation)) {
                console.log('what to do with', variation);
              } else {
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
              }

            });
            var attr = {};
            attr[bucketSlug] = bucketOption;
            addCatalogEntry(product, attr, newVariations);
          });
        });


      }
    });




    loadSessionCart();

    updateApp();



  }


  Checkout.enhanceGroupAttributes = function(product) {
    if (!product.group && (product.meta && product.meta.edb_group_ids)) {
      var gids = product.meta.edb_group_ids.trim().split(',').map(function(id) {
        return id.trim()
      });
      Object.defineProperty(product, 'group', {
        enumerable: true,
        get: function() {
          return gids.map(function(i) {
            var prod = Products[i];

            return Products[i];
          });
        }
      });
    }
    var allAttr = {};
    // var allVar = {};
    if (product.group && product.group.length) {
      product.group.forEach(function(g) {
        g.attributes.forEach(function(a) {
          if (!allAttr[a.name]) {
            allAttr[a.name] = [];
            // allVar[a.name] = [];
          }
          allAttr[a.name].push(a);
          // allVar[a.name] = (allVar[a.name]||[]).concat( g.variations.filter( function( v ){
          // return v.attributes.some( function( va){ return va.name = a.name});
          // }));
        })
      });
      var optMap = {};
      // var varMap = {};
      Object.keys(allAttr).forEach(function(name) {
        optMap[name] = {};
        // varMap[name] = {};
        allAttr[name].forEach(function(attr, idx) {
          var opts = attr.options;
          opts.forEach(function(o) {
            if (!optMap[name][o]) {
              optMap[name][o] = [];
              // varMap[name][o] = [];
            }
            optMap[name][o].push(idx);
            // varMap[name][o].push(idx);
          });
        });
      });
      // var newVar = [];
      var newAttr = Object.keys(allAttr).reduce(function(attrs, name) {
        var options = Object.keys(optMap[name]).filter(function(k) {
          return optMap[name][k].length == product.group.length
        });
        var orig = allAttr[name][0];
        // var origV = allVar[name][0];
        orig.options = orig.options.filter(function(o) {
          return~options.indexOf(o)
        });
        // orig.options.forEach( function(){

        // });
        orig.isFake = true;
        attrs.push(orig);

        return attrs;
      }, []);
      // console.log('newVar', newVar, varMap );
      product.attributes = newAttr;
      createGroupProductVariations(product);
    }
    return product;
  }

  function createGroupProductVariations(product) {
    var group = product.group;
    var all = {};
    group.forEach(function(g) {
      g.variations.forEach(function(v, i) {
        all[i] = all[i] || [];
        all[i].push(v);
      })
    });

    product.variations = Object.keys(all).map(function(i) {
      var proxy = {};
      Object.defineProperty(proxy, 'name', {
        enumerable: true,
        get: function() {
          return all[i].reduce(function(a, b) {
            return a ? a.name + b.name : b.name;
          });
        }
      })
      Object.defineProperty(proxy, 'price', {
        enumerable: true,
        get: function() {
          return all[i].reduce(function(a, b) {
            return a ? a.price + b.price : b.price;
          });
        }
      })
      Object.defineProperty(proxy, 'stockQuantity', {
        enumerable: true,
        get: function() {
          return all[i].reduce(function(a, b) {
            return a ? a.stockQuantity + b.stockQuantity : b.stockQuantity;
          });
        }
      })
      Object.defineProperty(proxy, 'attributes', {
        enumerable: true,
        get: function() {
          return group[0].variations[i].attributes;
        }
      });
      Object.defineProperty(proxy, 'image', {
        enumerable: true,
        get: function() {
          return {
            id: null,
            src: null
          };
        }
      });

      // console.log('proxy.attributes', proxy.attributes);
      return proxy;
    });
    return product;
  }



  Checkout.updateCartItemQuantity = function(productId, attributes, qty) {
    // console.log('updateCartItemQuantity')
    var uuid = tokenizeAttr(productId, attributes)
    var cartItem = Cart[uuid];
    if (cartItem) {
      cartItem.quantity = qty;
    }
    updateApp();
  }

  function findBoardEntry(productId, attributes) {
    var uuid = tokenizeAttr(productId, attributes);
    var entry = Blackboard[uuid];
    if (!entry) {
      // console.log('!attributes',uuid);
      uuid = tokenizeAttr(productId, Object.keys(attributes).reduce(function(no, name) {
        no[name] = no[name];
        return no;
      }, {}));

      entry = Blackboard[uuid];
      // console.log('uuid???', uuid, Object.keys(Blackboard));
      return entry && entry.group ? entry : null;
    }
    return entry;
  }

  Checkout.addToCart = function(productId, attributes, qty) {

    var entry = findBoardEntry(productId, attributes);
    
    if (!entry) {
      console.error('NOT ENTRY', productId, attributes);
      return null;
    } else {
      var uuid = entry ? entry.uuid : null;
      var cartItem = Cart[uuid];
      // if already in cart, update quantity;
      if (cartItem) {
        cartItem.quantity = cartItem.quantity + qty;
        localStorage.setItem('EDB_CART|' + uuid, JSON.stringify({
          pid: productId,

          stored: Date.now(),
          attributes: attributes,
          quantity: cartItem.quantity
        }));
        if (cartItem.quantity == 0) {
          Checkout.removeFromCart(uuid);
        }
      } else {
        
        // add to cart.
        Cart[uuid] = Object.assign({
          quantity: qty,
          remove: function() {
            Checkout.removeFromCart(uuid);
          },
        }, entry);

        localStorage.setItem('EDB_CART|' + uuid, JSON.stringify({
          pid: productId,

          stored: Date.now(),
          attributes: attributes,
          quantity: qty
        }));
      }
      updateApp();

    }
  };


  Checkout.removeFromCart = function(uuid) {
    delete Cart[uuid];
    localStorage.removeItem('EDB_CART|' + uuid);
    updateApp()
  };

  function getCartItemsByProductId( pid ){
    return Object.keys(Cart).filter(function( k ){ return new RegExp('^'+pid+';').test(k) }).map( function( k ){ return Cart[k]; });
  }
  
  Checkout.getStock = function(productId, attributes) {
    if (!attributes) {
      console.log('not attributes', productId, attributes);
    } else {


      var entry = findBoardEntry(productId, attributes);

      if (!entry) {
        // console.error('NOT ENTRY',productId,attrToken, Object.keys(Blackboard[productId]));
        return null;
      }
      var cartItem = Cart[entry.uuid];
      var cartItems = getCartItemsByProductId( entry.uuid.slice(0,entry.uuid.indexOf(';')));
      var output = {};
      console.log('attributes',attributes);
      
      var attrNames = attributes.map( function( a ){ return a.name });
      var qtys = cartItems.filter( function( c ){
        // keep if it has any matching attribute;
        
        return c.variation.attributes.some( function( vattr ){
          return ~attrNames.indexOf(vattr.name);
        })
      }).map( function( itm){
        return itm.quantity;
      });
      console.log('qtys',qtys);
      
      // console.log('cartItems',output)
      // var cartItemData = expandToken(entry.uuid);
      // console.log('getSTock', cartItem);
      
      // var cartItemQty = (cartItem ? cartItem.quantity : 0);
      // if (typeof cartItemQty == 'undefined') {
      //   cartItemQty = 0;
      // }
      // cartItemQty = Math.max.apply(qtys);

      var hasBuckets = Checkout.productHasBucketAttributes(entry.product);
      if (!hasBuckets) {
        // console.log('returning variation stock, cartItem:', cartItem);
        return entry.variation.stock_quantity;
      }
      if (entry.variation) {
        var minBucketCount = entry.variation.attributes.reduce(function(min, attr) {
          if (!attr.bucket) return min;
          
          // console.log('minBucketCountLoop', , attr);
          var qty = attr.bucket[attr.option].variation.stock_quantity;
          if (qty === null) return min;
          if (min === null) return qty;
          if (qty < min) return qty;
          return min;
        }, null);
        var variationQty = entry.variation.stock_quantity === null ? 0 : entry.variation.stock_quantity;
        // console.log('returning min stock, cartITem', minBucketCount, variationQty, entry.uuid );
        return Math.min(minBucketCount === null ? 0 : minBucketCount, variationQty) ;
      } else {
        return Infinity;
      }

    }
  }

  Checkout.getZone = function(postcode) {
    var code = postcode || EDB.Checkout.useBillingAddressForShipping ?  Customer.billing_postcode : Customer.shipping_postcode;
    var zone = 'zone-2';
    if (!code) return 'zone-3';
    if (!/^([a-zA-Z]\d[a-zA-Z]\s?\d[a-zA-Z]\d)$/.test(code)) return 'zone-3';
    code = code.toUpperCase().trim();
    var matchtable = {
      'zone-1': /^(H..|G1.|M..|K1.|T2.|T3.|T5.|T6.|V5.|V6.|C1A|R2.|R3.|E2.|E1.|E3.|B3.|S7.|S4.|A1.|J4.).+$/,
      'zone-3': /^(J|G|K|L|N|P|T|V|C|R|E|B|S|A|Y|X)0.+$/
    }
    return Object.keys(matchtable).reduce(function(z, k) {
      if (matchtable[k].test(code)) return k;
      return z;
    }, zone);
  }

   function getShippingClassForCart(){
    var items = Object.keys(Cart).map( function(k){ return Cart[k]; } );
    if (items && items.length) {
      if (items.some(function(item) {
        return item.shippingClass = 'furniture';
      })) {
        return 'furniture';
      } else if (items.some(function(item) {
        return item.shippingClass = 'small-furniture';
      })) {
        return 'small-furniture';
      }
      return 'accessories';
    }
    return null;
  }


  Checkout.getShippingRate = function(shippingClass, shippingZone, total) {
    var ratesTable = {
      'furniture': {
        'min': 500,
        'below': {
          'zone-1': 65,
          'zone-2': 150,
          'zone-3': 250
        },
        'above': {
          'zone-1': 0,
          'zone-2': 85,
          'zone-3': 150
        }
      },
      'small-furniture': {
        'min': 500,
        'below': {
          'zone-1': 18,
          'zone-2': 25,
          'zone-3': 28
        },
        'above': {
          'zone-1': 0,
          'zone-2': 10,
          'zone-3': 15
        }
      },
      'accessories': {
        'min': 50,
        'below': {
          'zone-1': 15,
          'zone-2': 15,
          'zone-3': 15
        },
        'above': {
          'zone-1': 0,
          'zone-2': 0,
          'zone-3': 0
        }
      }
    };
    var classRates = ratesTable[shippingClass];
    if(!classRates) return 0;
    var min = classRates.min;
    if(total < min){
      return classRates.below[shippingZone];
    }else{
      return classRates.above[shippingZone];
    }
    return 0;

  }



  Checkout.getPrice = function(productId, attributes) {

    if (!attributes) {
      console.log('not attributes', productId, attributes);
    } else {

      var entry = findBoardEntry(productId, attributes);
      // console.log('getPrice', uuid, entry, Blackboard)
      // console.log('getSTock', cartItem);
      if (!entry) {
        // console.error('NOT ENTRY',productId);
        return null;
      }
      var cartItem = Cart[entry.uuid];
      var price = entry.variation ? entry.variation.price || entry.product.price : entry.product.price;
      // console.log('price', price );
      var hasBuckets = Checkout.productHasBucketAttributes(entry.product);
      if (!hasBuckets) {
        console.log('returning basic price');
        return price;
      }
      var bucketModifiers = 0;
      if (entry.variation) {
        bucketModifiers = entry.variation.attributes.reduce(function(mods, attr) {
          if (!attr.bucket) return mods;
          var mod = attr.bucket[attr.option].variation.price;
          // .log(attr.option, attr.bucket[attr.option].variation);
          if (!isNaN(mod)) {
            return Number(mods) + Number(mod);
          }
          return mods;
        }, 0);
      }


      // console.log('returning basic price+bucket modifiers',price,bucketModifiers);
      return Number(price) + Number(bucketModifiers);

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
        // console.log(e.name, 'Stock', Checkout.getStock(pid, attrs));


      });

    });
  }
  EDB.Checkout = Checkout;

})()