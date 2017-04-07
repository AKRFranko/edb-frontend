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
    var token = tokenizeAttr(product.id, option);
    
    
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
      var uuid = tokenizeAttr(pid, v.attributes);
      Blackboard[uuid] = Object.assign({
        variation: v
      }, catalogEntry);
    });
    // if(product.group){
      
    //   var uuid = tokenizeAttr(pid, product.attributes);
    //   Blackboard[uuid] = Object.assign({
    //     group: product.group
    //   }, catalogEntry);
    //   // console.log('variations',variations, pid);
    // }
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
    var lines = [];
    Object.keys(Cart).forEach(function(uuid) {
      var total = Cart[uuid].quantity * Checkout.getPrice(Cart[uuid].product.id, Cart[uuid].variation.attributes);
      subTotal += total;
      return lines.push({
        label: Cart[uuid].name + ' x' + Cart[uuid].quantity,
        value: total
      });
    });

    lines.unshift({
      label: 'subtotal',
      value: subTotal
    });
    lines.unshift({
      label: 'tax',
      value: (0.15 * subTotal)
    });
    lines.unshift({
      label: 'shipping',
      value: 0
    });
    lines.unshift({
      label: 'total',
      value: subTotal + (0.15 * subTotal)
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
            // var newVariations = [];
            // if(product.group){
            //   console.log('GRP', bucketOption, product.group );
            // }
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
    var allVar = {};
    if (product.group && product.group.length) {
      product.group.forEach(function(g) {
        g.attributes.forEach(function(a) {
          if (!allAttr[a.name]) {
            allAttr[a.name] = [];
            allVar[a.name] = [];
          }
          allAttr[a.name].push(a);
          allVar[a.name] = (allVar[a.name]||[]).concat( g.variations.filter( function( v ){
            return v.attributes.some( function( va){ return va.name = a.name});
          }));
        })
      });
      var optMap = {};
      var varMap = {};
      Object.keys(allAttr).forEach(function(name) {
        optMap[name] = {};
        varMap[name] = {};
        allAttr[name].forEach(function(attr, idx) {
          var opts = attr.options;
          opts.forEach(function(o) {
            if (!optMap[name][o]) {
              optMap[name][o] = [];
              varMap[name][o] = [];
            }
            optMap[name][o].push(idx);
            varMap[name][o].push(idx);
          });
        });
      });
      var newVar = [];
      var newAttr = Object.keys(allAttr).reduce(function(attrs, name) {
        var options = Object.keys(optMap[name]).filter(function(k) {
          return optMap[name][k].length == product.group.length
        });
        var orig = allAttr[name][0];
        orig.options = orig.options.filter(function(o) {
          return~options.indexOf(o)
        });
        orig.isFake = true;
        attrs.push(orig);

        return attrs;
      }, []);
      console.log('newVar', newVar, varMap);
      product.attributes = newAttr;
    }
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
  Checkout.addToCart = function(productId, attributes, qty) {
    var uuid = tokenizeAttr(productId, attributes);
    var entry = Blackboard[uuid];
    var cartItem = Cart[uuid];
    if (!entry) {
      console.error('NOT ENTRY', uuid,Object.keys(Blackboard));
      
      return null;
    } else {
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
          }
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

  Checkout.getStock = function(productId, attributes) {
    if (!attributes) {
      console.log('not attributes', productId, attributes);
    } else {

      var uuid = tokenizeAttr(productId, attributes);
      var entry = Blackboard[uuid];
      var cartItem = Cart[uuid];
      // console.log('getSTock', cartItem);
      var cartItemQty = (cartItem ? cartItem.quantity : 0);
      if (typeof cartItemQty == 'undefined') {
        cartItemQty = 0;
      }
      if (!entry) {
        // console.error('NOT ENTRY',productId,attrToken, Object.keys(Blackboard[productId]));
        return null;
      }
      var hasBuckets = Checkout.productHasBucketAttributes(entry.product);
      if (!hasBuckets) {
        // console.log('returning variation stock, cartItem:', cartItem);
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

  Checkout.getPrice = function(productId, attributes) {

    if (!attributes) {
      // console.log('not attributes', productId, attributes);
    } else {

      var uuid = tokenizeAttr(productId, attributes);


      var entry = Blackboard[uuid];
      var cartItem = Cart[uuid];
      // console.log('getPrice', uuid, entry, Blackboard)
      // console.log('getSTock', cartItem);
      if (!entry) {
        // console.error('NOT ENTRY',productId,attrToken, Object.keys(Blackboard[productId]));
        return null;
      }
      var price = entry.variation ? entry.variation.price || entry.product.price : entry.product.price;
      // console.log('price', price );
      var hasBuckets = Checkout.productHasBucketAttributes(entry.product);
      if (!hasBuckets) {
        // console.log('returning basic price');
        return price;
      }

      var bucketModifiers = entry.variation.attributes.reduce(function(mods, attr) {
        if (!attr.bucket) return mods;
        var mod = attr.bucket[attr.option].variation.price;
        if (!isNaN(mod)) {
          return Number(mods) + Number(mod);
        }
        return mods;
      }, 0);

      // console.log('returning basic price+bucket modifiers');
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