(function() {
  var wpRest = document.createElement('wp-rest'),
    wcRest = document.createElement('wp-rest'),
    jwtRest = document.createElement('wp-rest');

  var jwt = localStorage.getItem('EDB_JWT');

  wpRest.name = 'worpdress';
  wcRest.name = 'woocommerce';
  wpRest.host = window.creds.apiHost;
  wpRest.namespace = window.creds.apiNamespace;
  wpRest.JWT = jwt;
  wpRest.authKey = window.creds.authKey;
  wpRest.authSecret = window.creds.authSecret;

  wcRest.host = window.creds.apiHost;
  wcRest.namespace = 'wc/v1';
  wcRest.JWT = jwt;
  wcRest.consumerKey = window.creds.consumerKey;
  wcRest.consumerSecret = window.creds.consumerSecret;
  wcRest.authKey = window.creds.authKey;
  wcRest.authSecret = window.creds.authSecret;

  jwtRest.host = window.creds.apiHost;
  jwtRest.namespace = 'jwt-auth/v1';
  jwtRest.JWT = jwt;
  wcRest.authKey = window.creds.authKey;
  wcRest.authSecret = window.creds.authSecret;

  if (!window.EDB) window.EDB = {};

  var app;
  var Customer;
  var Guest = {
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
  };
  window.Materials = {};
  window.Buckets = {};
  window.Products = {};
  window.Catalog = {};
  window.Inventory = {};


  // function expandToken(token) {

  //   var parts = token.split('?');
  //   var names;
  //   var attributes = {};
  //   if (parts[1]) {
  //     // console.log(parts[1])
  //     names = parts[1].split('&').map(function(p) {
  //       return p.slice(p.indexOf('=') + 1);
  //     });
  //   } else {
  //     names = [];
  //   }
  //   if (parts[1]) {
  //     attributes = parts[1].split('&').reduce(function(o, p) {
  //       var k = p.slice(0, p.indexOf('='));
  //       var v = p.slice(p.indexOf('=') + 1);
  //       if (k && v) {
  //         o[k] = v;
  //       }
  //       return o;
  //     }, {});
  //   }

  //   // console.log(token, !!Inventory[token], !!Catalog[token])
  //   var pid = parts[0].slice(parts[0].indexOf('/') + 1);
  //   var product = Products[pid];

  //   // if(!product){
  //   //   console.log(pid, token)  
  //   // }
  //   // console.log(Catalog[token])
  //   var name = [product.name].concat(names).join(' ');
  //   return {
  //     id: pid,
  //     name: name,
  //     token: token,
  //     // product: product,
  //     // catalog: Catalog[token],
  //     attributes: attributes
  //   };
  // }

  /** 
   *   HELPERS 
   */

  function stripEDBPrefix(s) {
    return s.replace(/^edb_/, '');
  }




  // function isBucket(name) {
  //   return !!Buckets[name];
  // }

  function isNamingBucket(name) {
    return name == 'leg';
  }

  function tokenizeAttr(attr) {
    var sortedKeys = Object.keys(attr || {}).sort(function(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    var tok = sortedKeys.reduce(function(token, at) {
      return [token, at + '=' + encodeURIComponent(attr[at])].join('&');
    }, '');
    return tok.replace(/^\&/, '');
  }


  function getCombinations(options, optionIndex, results, current) {
    var allKeys = Object.keys(options);
    var optionKey = allKeys[optionIndex];

    var vals = options[optionKey];

    for (var i = 0; i < vals.length; i++) {
      current[optionKey] = vals[i];

      if (optionIndex + 1 < allKeys.length) {
        getCombinations(options, optionIndex + 1, results, current);
      } else {
        // The easiest way to clone an object.
        var res = JSON.parse(JSON.stringify(current));
        results.push(res);
      }
    }

    return results;
  }

  function hasAttribute(object, name, value) {
    var checkValue = arguments.length == 3;
    return object.attributes.some(function(a) {
      if (checkValue) {
        return a.name == name && a.option == value;
      } else {
        return a.name == name;
      }
    });
  }

  function findVariationByOption(variations, name, value) {
    var matched = variations.filter(function(v) {
      return hasAttribute(v, name, value)
    });
    if (matched.length > 0) return matched[0];
  }

  function findGroupVariationByOption(id, products, name, value) {
    var product = products[id];
    var gids = product.meta_box.edb_group_ids;
    if (!gids) return;
    gids = gids.trim().split(',').map(function(s) {
      return s.trim()
    });
    return gids.map(function(gid) {
      return findVariationByOption(products[gid].variations, name, value);
    });
  }

  function getGroupProductAttributes(id, products) {
    var product = products[id];
    var gids = product.meta_box.edb_group_ids;
    if (!gids) return;
    gids = gids.trim().split(',').map(function(s) {
      return s.trim()
    });
    var attributes = {};
    gids.forEach(function(id) {
      products[id].attributes.reduce(function(kept, a) {
        if (!kept[a.name]) kept[a.name] = {};
        a.options.forEach(function(o) {
          if (!kept[a.name][o]) {
            kept[a.name][o] = [];
          }
          kept[a.name][o].push(id);
        });
        return kept;
      }, attributes)

    });
    var final = [];
    Object.keys(attributes).forEach(function(k) {
      var attr = {
        name: k,
        options: []
      };
      Object.keys(attributes[k]).forEach(function(o) {
        if (attributes[k][o].length == gids.length) {
          attr.options.push(o);
        }
      });
      final.push(attr);
    });
    return final;
  }

  var refMap = {};

  function setupRefMap(items) {


    var buckets = {};
    var products = {};
    


    items.forEach(function(item, index) {


      if (item.meta_box.edb_is_bucket == '1') {
        var name = stripEDBPrefix(item.meta_box.edb_bucket_slug);
        Object.defineProperty(buckets, name, {
          enumerable: true,
          get: function() {
            return items[index];
          }
        });
      } else {
        Object.defineProperty(products, item.id, {
          enumerable: true,
          get: function() {
            return items[index];
          }
        });
        // others.push(index);
      }

      if (item.meta_box.edb_group_ids) {
        var gids = item.meta_box.edb_group_ids;
        gids = gids.trim().split(',').map(function(s) {
          return s.trim()
        });
        Object.defineProperty(items[index], 'group', {
          enumerable: true,
          get: function() {
            return gids.map(function(id) {
              return products[id]
            });
          }
        });
      }

    });

    Object.keys(buckets).forEach(function(name) {
      buckets[name].attributes[0].options.forEach(function(option) {
        Object.defineProperty(buckets, name + '=' + option, {
          enumerable: true,
          get: function() {
            return findVariationByOption(buckets[name].variations, name, option);
          }
        })
      });
    });

    Object.keys(products).forEach(function(id) {
      var attributes, attrMap = {};
      if (products[id].type !== 'variable') {
        products[id].attributes = getGroupProductAttributes(id, products);
      }
      attributes = products[id].attributes;
      attributes.forEach(function(a) {
        if (!attrMap[a.name]) {
          attrMap[a.name] = [];
        }
        attrMap[a.name] = a.options;
      });

      var combos = getCombinations(attrMap, 0, [], {});
      combos.forEach(function(combo) {
        var token = tokenizeAttr(combo);
        var refs = {};
        Object.keys(combo).forEach(function(name) {
          if (buckets[name]) {
            refs[name] = buckets[name + '=' + combo[name]];
          } else {
            if (products[id].variations.length) {
              refs[name] = findVariationByOption(products[id].variations, name, combo[name]);
            } else {
              refs[name] = findGroupVariationByOption(id, products, name, combo[name]);
            }
          }
        });
        refMap[id + '?' + token] = {
          product: products[id],
          combination: refs
        };

      });
    });


    Object.keys(refMap).forEach(function(key) {

      Object.defineProperty(refMap[key], 'stock_quantity', {
        enumerable: true,
        get: function() {
          var item = refMap[key];
          var inCart = 0;
          var stock = 0;
          if (item.product.type == 'variable') {
            var base = item.product.stock_quantity;
            var combos = Object.keys(item.combination).map(function(k) {
              return item.combination[k]
            });
            var comboStock = combos.reduce(function(all, one) {
              all.push(one.stock_quantity)
              return all;
            }, [])
            stock = Math.min.apply(Math, [base].concat(comboStock));
          } else {
            var base = Math.min.apply(Math, item.product.group.map(function(p) {
              return p.stock_quantity;
            }));
            var groupStocks = item.product.group.map(function(p) {
              var id = p.id;
              var k = id + '?' + key.replace(/^.+\?/, '');
              return refMap[k].stock_quantity;
            })
            stock = Math.min.apply(Math, [base].concat(groupStocks));
          }
          return stock - inCart;
        }
      });

      Object.defineProperty(refMap[key], 'price', {
        enumerable: true,
        get: function() {
          var item = refMap[key];
          if (item.product.type == 'variable') {
            if (!item.product.meta_box) {
              console.log('no box', item)
            }
            var combos = Object.keys(item.combination).map(function(k) {
              return item.combination[k]
            });
            var comboPrices = combos.reduce(function(all, one) {
              all.push(one.price)
              return all;
            }, [])
            // console.log('comboPrices', comboPrices);
            return comboPrices.reduce(function(s, p) {
              return s + p;
            });

          } else {
            return item.product.group.reduce(function(sum, p) {
              var id = p.id;
              var k = id + '?' + key.replace(/^.+\?/, '');
              return sum + refMap[k].price;
            }, 0);
          }
          return;
        }
      });

      Object.defineProperty(refMap[key], 'sale_price', {
        enumerable: true,
        get: function() {
          var item = refMap[key];
          if (item.product.type == 'variable') {
            if (!item.product.meta_box) {
              console.log('no box', item)
            }
            var combos = Object.keys(item.combination).map(function(k) {
              return item.combination[k]
            });
            var comboPrices = combos.reduce(function(all, one) {
              all.push(one.sale_price)
              return all;
            }, [])
            console.log('comboPrices', comboPrices);
            return comboPrices.reduce(function(s, p) {
              return s + p;
            });

          } else {
            return item.product.group.reduce(function(sum, p) {
              var id = p.id;
              var k = id + '?' + key.replace(/^.+\?/, '');
              return sum + refMap[k].sale_price;
            }, 0);
          }
          return;
        }
      });
    });

    return products;
    // console.log(refMap['198?leg=Natural&slipcover=slipcover-004'].sale_price);

  }

  function setupMaterials(items) {
    items.forEach(function(item) {
      if (!item.meta_box) return;
      setupMaterial(item);
    });
    console.log('Materials Mapped');
  }

  function setupMaterial(item) {
    var attribute = item.meta_box.edb_material_attribute;
    var slug = item.meta_box.edb_material_number;
    if (!attribute || !slug) return;
    var attr = stripEDBPrefix(attribute);
    var token = attr + '/' + slug;
    if (!Materials[attr]) {
      Materials[attr] = {};
    }
    Materials[attr][slug] = item;
    Materials[token] = item;
  }





  function setupProducts(items) {
    items.forEach(function(item) {
      if (!item.meta_box) return;

      // NOTE: Use this section  here to filter out invlaids.
      setupProduct(item)

    });

  }

  function setupProduct(item) {
    console.log('setupProduct', item);

  }

  function hasNamingBucket(item) {
    var attributes = item.attributes;
    if (item.meta_box.edb_is_bucket == '1') return false;
    var bucketattributes = attributes.filter(function(attr) {
      return isNamingBucket(attr.name)
    });
    return bucketattributes.length > 0 ? bucketattributes : false;
  }

  function CatalogItem(item, name) {
    this.isGroup = !! item.group;
    this.name = item.name + ' ' + name;
    this.image = item.images[0];
    this.images = item.images.slice(1);
    this.description = /^\<p/.test(item.description) ? item.description.slice(3, -5) : item.description;
    this.id = item.id;
    this.attributes = item.attributes;
    var attrMap = {};
    this.attributes.forEach(function(a) {
      if (!attrMap[a.name]) {
        attrMap[a.name] = [];
      }
      attrMap[a.name] = a.options;
    });
    var combos = getCombinations(attrMap, 0, [], {});
    var combinations = {};
    combos.forEach(function(combo) {
      var token = tokenizeAttr(combo);
      combinations[token] = refMap[item.id + '?' + token];

    });
    var priceMap = {};
    Object.keys(combinations).forEach( function( key ){
      priceMap[ key ] = combinations[key].price;
    });
    var priceValues = Object.keys(priceMap).map( function( key ){
      return priceMap[ key ];
    })
    var minPrice = Math.min.apply(Math, priceValues );
    var maxPrice = Math.max.apply(Math, priceValues );
    this.prices = {
      min: minPrice,
      max: maxPrice
    };
    
    this.getPrice = function( options ){
      if(Object.keys(options).length !== Object.keys(attrMap).length){
        throw "Cannot calculate price, missing options";
      }
      var token = tokenizeAttr(options);
      return priceMap[token];
    };
    this.getStock = function( options ){
      if(Object.keys(options).length !== Object.keys(attrMap).length){
        throw "Cannot count stock, missing options";
      }
      var token = tokenizeAttr(options);
      return refMap[item.id + '?' + token].stock_quantity;
    };
    this.getAvailability = function( options ){
      if(Object.keys(options).length !== Object.keys(attrMap).length){
        throw "Cannot get availability, missing options";
      }
      return this.getStock( options ) >0 ? 'available' : 'backorder';
    }
    
    
    
    
    console.log('prices', this.getAvailability( { leg: 'Natural', slipcover: 'slipcover-004' } ) );
    
    
    return this;
  }

  function setupCatalog(products) {
    items = Object.keys(products).map(function(k) {
      return products[k];
    });
    // console.log('setupCatalog',items);
    var catalog = [];
    items.forEach(function(item) {
      var buckets = hasNamingBucket(item);
      if (buckets) {
        buckets.forEach(function(bucket) {
          bucket.options.forEach(function(option) {
            catalog.push(new CatalogItem(item, option));
            console.log('copy item as', item.name, bucket.name, option)
          })
        });
      } else {

        if (item.meta_box.edb_is_bucket == '1') {
          // console.log('bucket has no naming', item  );
        } else {
          catalog.push(new CatalogItem(item, null));
          // console.log('add this as simple catalog item', item );
          // console.log('item has no naming', item  );.
        }

      }
    });
    console.log(catalog);
  }

  // function createInventoryItems(item, prefix, group) {
  //   var buckets = Object.keys(item.variationMap).filter(function(k) {
  //     return isBucket(k);
  //   }).map(function(k) {
  //     return item.variationMap[k]
  //   });
  //   var others = Object.keys(item.variationMap).filter(function(k) {
  //     return !isBucket(k);
  //   }).map(function(k) {
  //     return item.variationMap[k]
  //   });
  //   buckets.forEach(function(bucket) {
  //     Object.keys(bucket).forEach(function(bucketOption) {
  //       var bucketName = bucket[bucketOption].name;
  //       var attr = {};
  //       attr[bucketName] = bucketOption;
  //       if (others.length) {
  //         item.variations.forEach(function(variation) {
  //           var tokenAttrs = Object.assign({}, variation.attributeMap, attr);
  //           var pfx = prefix || 'product/' + item.id;
  //           var token = pfx + '?' + tokenizeAttr(tokenAttrs);
  //           addInventoryItem(token, item, variation, tokenAttrs);
  //         });
  //       } else {
  //         var pfx = prefix || 'product/' + item.id;
  //         var token = pfx + '?' +tokenizeAttr(attr);
  //         addInventoryItem(token, item, null, attr);
  //       }
  //     });
  //   });
  //   // if(item.group){
  //   //   var groupKeys = Object.keys(item.group);
  //   //   var matchKeys = Object.keys(Inventory);
  //   //   var found = [];
  //   //   matchKeys.forEach( function( k ){
  //   //     groupKeys.forEach( function( gk ){
  //   //       var re = new RegExp( gk.replace('?','\\\?') + '.+?' );
  //   //       if(re.test(k)){
  //   //         found.push( k );
  //   //       }
  //   //     })
  //   //   });
  //   //   var copyKeys = {};
  //   //   found.forEach( function( key ){
  //   //     var stripped = key.replace(/^product\/\d+/,'');
  //   //     copyKeys[stripped]=stripped;
  //   //   });
  //   //   Object.keys(copyKeys).forEach( function(copy){
  //   //     var pfx = prefix || 'product/' + item.id;
  //   //     var token = pfx + copy;
  //   //     addInventoryItem( token, item, null, expandToken(token).attributes, item.group );
  //   //   });

  //   //   // Object.keys(item.group).forEach( function( sub ){
  //   //   //   var subItem = item.group[sub];
  //   //   //   subItem.forEach( function( i ){
  //   //   //     console.log(i,)
  //   //   //     // createInventoryItems( i, 'product/' + item.id, group );
  //   //   //   });

  //   //   //   // 
  //   //   // });

  //   // }
  //   return item;
  // }

  // function addInventoryItem(token, product, variation, tokenAttrs, group) {
  //   var attributeProducts = Object.keys(tokenAttrs).reduce(function(obj, attr) {
  //     var sub = tokenAttrs[attr];
  //     obj[sub] = product.variationMap[attr][sub];
  //     return obj;
  //   }, {});

  //   Inventory[token] = {
  //     token: token,
  //     product: product,
  //     variation: variation,
  //     attributeProducts: attributeProducts,
  //     group: group
  //   };
  // }

  // function createCatalogItems(item) {
  //   var buckets = Object.keys(item.variationMap).filter(function(k) {
  //     return isBucket(k);
  //   }).map(function(k) {
  //     return item.variationMap[k]
  //   });
  //   var others = Object.keys(item.variationMap).filter(function(k) {
  //     return !isBucket(k);
  //   }).map(function(k) {
  //     return item.variationMap[k]
  //   });
  //   if (!others.length) {
  //     var token = 'product/' + item.id;
  //     item.catalogItems = [item];
  //     addCatalogItem(token, item);
  //   } else {
  //     var catalogItems = [];
  //     // var itemNames = [];
  //     buckets.forEach(function(bucket) {
  //       Object.keys(bucket).forEach(function(bucketOption) {
  //         var bucketName = bucket[bucketOption].name;
  //         if (isNamingBucket(bucketName)) {
  //           var attr = {};
  //           attr[bucketName] = bucketOption;
  //           var token = 'product/' + item.id + '?' + tokenizeAttr(attr);
  //           catalogItems.push(item);
  //           // itemNames.push(bucketOption);
  //           // item.additionalName = bucketOption;
  //           addCatalogItem(token, item);
  //         }
  //       });
  //     })

  //     item.catalogItems = catalogItems;
  //   }

  //   return item;
  // }

  // function addCatalogItem(token, product) {
  //   product.token = token;
  //   Catalog[token] = new CatalogItem( token, product );
  // }
  /** 
   *   DATA ACCESSORS 
   */

  // function getStock( pid, attributes ){
  //   var stored = Inventory['product/'+pid+ '?' + tokenizeAttr(attributes) ];
  //   return stored;
  // }

  /** 
   *   WP REST API 
   */
  function fetchMaterials() {
    return wpRest.__request('GET', 'materials', null, {
      context: 'view'
    });
  }

  function fetchProducts() {
    return wcRest.__request('GET', 'products', null, {
      context: 'view',
      'filter[limit]': -1,
      per_page: 100
    });
  }

  function test() {
    console.log('BEGIN TESTS');

  }

  function rebuild() {
    return fetchMaterials().then(setupMaterials).then(fetchProducts).then(setupRefMap).then(setupCatalog).then(test);
  }


  window.EDB.Magic = {
    init: function(polymerApp) {
      app = polymerApp;
      rebuild()
    }

  }




})();