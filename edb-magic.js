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


   
  var CatalogItem = function CatalogItemConstructor( token, product ){
    Object.defineProperty( this, 'token', {
      enumerable: true,
      value: token
    } );
    Object.defineProperty( this, 'name', {
      enumerable: true,
      get: function(){
        return expandToken(token).name;
      }
    });
    Object.defineProperty( this, 'image', {
      enumerable: true,
      get: function(){
        return product.images[0];
      }
    });
    Object.defineProperty( this, 'description', {
      enumerable: true,
      get: function(){
        return product.description;
      }
    });
    Object.defineProperty( this, 'price', {
      enumerable: true,
      get: function(){
        return product.price;
      }
    });
    Object.defineProperty( this, 'stock', {
      enumerable: true,
      get: function(){
        var baseStock = product.stock_quantity;
        var vStock = Object.keys(product.variationMap).reduce( function(all,key){
          all[key]=[];
          Object.keys(product.variationMap[key]).reduce( function(a,v){
            // console.log(product.variationMap[key][v].variation)
            a.push(product.variationMap[key][v].variation.stock_quantity);
            return a;
          }, all[key]);
          all[key] = Math.min.apply(Math, all[key] );
          return all;
        },{});
        var minvStock = Object.keys(vStock).map( function( k ){ return vStock[k]; })
        if(product.group){
          var stocks = [];
          Object.keys( product.group ).forEach( function( tok ){
            stocks.push(Catalog[tok].stock);
          });
          // console.log('stocks',stocks)
          return Math.min.apply(Math, stocks.concat(minvStock) );
        }else{
          return Math.min.apply(Math, [baseStock].concat(minvStock) );
        }
        return baseStock;
      }
    });
    Object.defineProperty( this, 'stock', {
      
    });
    
    
    return this;
  }
  
  function expandToken( token ){

    var parts = token.split('?');
    var names;
    var attributes = {};
    if(parts[1]){
      // console.log(parts[1])
      names = parts[1].split('&').map( function( p ){
        return p.slice(p.indexOf('=')+1);
      });  
    }else{
      names = [];
    }
    if(parts[1]){
      attributes = parts[1].split('&').reduce( function(o,p){
        var k = p.slice(0,p.indexOf('='));
        var v = p.slice(p.indexOf('=')+1);
        if(k && v){
          o[k]=v;
        }
        return o;
      }, {});  
    }
    
    // console.log(token, !!Inventory[token], !!Catalog[token])
    var pid = parts[0].slice( parts[0].indexOf('/')+1 );
    var product = Products[pid];
    
    // if(!product){
    //   console.log(pid, token)  
    // }
    // console.log(Catalog[token])
    var name = [product.name].concat(names).join(' ');
    return { 
      id: pid, 
      name: name, 
      token: token,
      // product: product,
      // catalog: Catalog[token],
      attributes: attributes
    };
  } 

 /** 
  *   HELPERS 
  */
 
  function stripEDBPrefix(s) {
    return s.replace(/^edb_/, '');
  }




  function isBucket(name) {
    return !!Buckets[name];
  }

  function isNamingBucket(name) {
    return name == 'leg';
  }

  function tokenizeAttr(attr) { 
    var sortedKeys = Object.keys(attr||{}).sort(function(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    var tok = sortedKeys.reduce(function(token, at) {
      return [token, at +'=' +  encodeURIComponent(attr[at])].join('&');
    }, '');
    return tok.replace(/^\&/,'');
  }

  /** 
  *   CATALOG MAKING 
  */
  function createAttributeMap(item, parent) {
    var attributes = item.attributes;
    item.attributeMap = attributes.reduce(function(keys, attribute) {
      var attr = stripEDBPrefix(attribute.name);
      if (attribute.option) {
        keys[attr] = attribute.option;
      } else if (attribute.options) {
        keys[attr] = attribute.options.reduce(function(obj, opt) {
          obj[opt] = attribute;
          return obj;
        }, {});
      }
      return keys;
    }, {});
    // if(parent){
    //   item.attributeMap = Object.assign( {}, item.attributeMap, parent.attributeMap );
    // }
    return item;
  }

  function createVariationMap(item) {
    var map = {};
    var variations = {
      bucket: {},
      product: {}
    };
    Object.keys(item.attributeMap).reduce(function(variations, attributeName) {
      var attributes = item.attributeMap[attributeName];

      Object.keys(attributes).forEach(function(k) {
        var token = attributeName + '/' + k;
        var bucket = Buckets[token];
        if (bucket) {
          if (!variations.bucket[attributeName]) {
            variations.bucket[attributeName] = {};
          }
          variations.bucket[attributeName][k] = bucket;
          // variations.bucket[token]=bucket;
        } else {
          if (!variations.product[attributeName]) {
            variations.product[attributeName] = {};
          }
          Object.keys(attributes).forEach(function(attribute) {
            var variation = item.variations.filter(function(v) {
              return v.attributeMap[attributeName] == attribute;
            }).reduce(function(n) {
              return n
            });
            var proxy = createVariationProxy(item, variation);
            variations.product[attributeName][k] = proxy;
            // variations.product[token]=proxy; 
          });
        }
      });
      return variations;
    }, variations);
    item.variationMap = Object.assign({}, variations.bucket, variations.product);
  }

  function createVariationProxy(product, variation) {
    var proxy = {};
    Object.defineProperty(proxy, 'product', {
      enumerable: true,
      get: function() {
        return product;
      }
    });
    Object.defineProperty(proxy, 'variation', {
      enumerable: true,
      get: function() {
        return variation;
      }
    });
    // Object.defineProperty( proxy, 'material', {
    //   enumerable: true,
    //   get: function(){
    //     return material;
    //   }
    // });
    return proxy;
  }

  function createBucketProxy(product, variation, material, bucketName) {
    var proxy = {};
    Object.defineProperty(proxy, 'product', {
      enumerable: true,
      get: function() {
        return product;
      }
    });
    Object.defineProperty(proxy, 'variation', {
      enumerable: true,
      get: function() {
        return variation;
      }
    });
    Object.defineProperty(proxy, 'material', {
      enumerable: true,
      get: function() {
        return material;
      }
    });
    Object.defineProperty(proxy, 'name', {
      enumerable: true,
      value: bucketName
    });
    return proxy;
  }


  function setupCatalog(items) {
    var sorted = items.reduce(function(obj, item) {
      createAttributeMap(item);
      if (item.variations) {
        item.variations.forEach(function(variation) {
          createAttributeMap(variation, item);
        });
      };
      if (item.meta_box && item.meta_box.edb_is_bucket == '1') {
        obj.buckets.push(item);
      } else if (item.type == 'variable') {
        obj.variables.push(item);
      } else if (item.type == 'grouped') {
        obj.groups.push(item);
      }
      return obj;
    }, {
      buckets: [],
      variables: [],
      groups: []
    });
    setupBuckets(sorted.buckets);
    setupProducts(sorted.variables);
    setupGroups(sorted.groups);
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



  function setupBuckets(items) {
    items.forEach(function(item) {
      if (!item.meta_box) return;
      setupBucket(item);
    });
  }

  function setupBucket(item) {
    var attribute = item.meta_box.edb_bucket_slug;
    var attr = stripEDBPrefix(attribute);
    item.variations.forEach(function(variation) {
      var vattr = variation.attributes[0];
      var slug = vattr.option;
      var token = attr + '/' + slug;
      var material = Materials[token];
      var data = createBucketProxy(item, variation, material, attr);
      if (!Buckets[attr]) {
        Buckets[attr] = {};
      }
      Buckets[attr][slug] = data;
      Buckets[token] = data;
    });
  }

  function setupGroups(items) {
    items.forEach(function(item) {
      if (!item.meta_box) return;
      // NOTE: Use this section here to filter out invlaids.
      setupGroup(item);
    });
  };

  function setupGroup(item) {
    var groupids = item.meta_box.edb_group_ids.trim().split(',');
    console.log(groupids)
    var catalogItems = groupids.map(function(id) {
      
      return Products[id].catalogItems;
    });
    var attrMap = {};
    var vMap = {};
    catalogItems.forEach(function(citem) {
      citem.forEach(function(c) {
        attrMap = Object.assign(attrMap, c.attributeMap)
      });
      citem.forEach(function(c) {
        vMap = Object.assign(vMap, c.variationMap)
      });
    })
    item.attributeMap = attrMap;
    item.variationMap = vMap;
    item.group = catalogItems.reduce(function(a, itm) {
      itm.forEach(function(i) {
        a[i.token] = itm;
      })
      return a;
    }, {});
    Products[item.id]=item;
    // TODO BEFORE ADDING TO CATALOG:
    // 1- validate that sub-products have same attributes
    // 2- create proxy item and store that.
    createInventoryItems(item);
    createCatalogItems(item);
  }

  function setupProducts(items) {
    items.forEach(function(item) {
      if (!item.meta_box) return;

      // NOTE: Use this section  here to filter out invlaids.
      setupProduct(item)
      Products[item.id] = item;
    });
    // setupProduct(items[0])
    // setupProduct(items[9])
    console.log( Catalog);
    // console.log('Inventory',Inventory);
  }

  function setupProduct(item) {
    // console.log('setupProduct', item);
    createVariationMap(item);
    createInventoryItems(item);
    createCatalogItems(item);
    // console.log( item );
  }


  function createInventoryItems(item, prefix, group) {
    var buckets = Object.keys(item.variationMap).filter(function(k) {
      return isBucket(k);
    }).map(function(k) {
      return item.variationMap[k]
    });
    var others = Object.keys(item.variationMap).filter(function(k) {
      return !isBucket(k);
    }).map(function(k) {
      return item.variationMap[k]
    });
    buckets.forEach(function(bucket) {
      Object.keys(bucket).forEach(function(bucketOption) {
        var bucketName = bucket[bucketOption].name;
        var attr = {};
        attr[bucketName] = bucketOption;
        if (others.length) {
          item.variations.forEach(function(variation) {
            var tokenAttrs = Object.assign({}, variation.attributeMap, attr);
            var pfx = prefix || 'product/' + item.id;
            var token = pfx + '?' + tokenizeAttr(tokenAttrs);
            addInventoryItem(token, item, variation, tokenAttrs);
          });
        } else {
          var pfx = prefix || 'product/' + item.id;
          var token = pfx + '?' +tokenizeAttr(attr);
          addInventoryItem(token, item, null, attr);
        }
      });
    });
    // if(item.group){
    //   var groupKeys = Object.keys(item.group);
    //   var matchKeys = Object.keys(Inventory);
    //   var found = [];
    //   matchKeys.forEach( function( k ){
    //     groupKeys.forEach( function( gk ){
    //       var re = new RegExp( gk.replace('?','\\\?') + '.+?' );
    //       if(re.test(k)){
    //         found.push( k );
    //       }
    //     })
    //   });
    //   var copyKeys = {};
    //   found.forEach( function( key ){
    //     var stripped = key.replace(/^product\/\d+/,'');
    //     copyKeys[stripped]=stripped;
    //   });
    //   Object.keys(copyKeys).forEach( function(copy){
    //     var pfx = prefix || 'product/' + item.id;
    //     var token = pfx + copy;
    //     addInventoryItem( token, item, null, expandToken(token).attributes, item.group );
    //   });
      
    //   // Object.keys(item.group).forEach( function( sub ){
    //   //   var subItem = item.group[sub];
    //   //   subItem.forEach( function( i ){
    //   //     console.log(i,)
    //   //     // createInventoryItems( i, 'product/' + item.id, group );
    //   //   });
        
    //   //   // 
    //   // });
      
    // }
    return item;
  }

  function addInventoryItem(token, product, variation, tokenAttrs, group) {
    var attributeProducts = Object.keys(tokenAttrs).reduce(function(obj, attr) {
      var sub = tokenAttrs[attr];
      obj[sub] = product.variationMap[attr][sub];
      return obj;
    }, {});

    Inventory[token] = {
      token: token,
      product: product,
      variation: variation,
      attributeProducts: attributeProducts,
      group: group
    };
  }

  function createCatalogItems(item) {
    var buckets = Object.keys(item.variationMap).filter(function(k) {
      return isBucket(k);
    }).map(function(k) {
      return item.variationMap[k]
    });
    var others = Object.keys(item.variationMap).filter(function(k) {
      return !isBucket(k);
    }).map(function(k) {
      return item.variationMap[k]
    });
    if (!others.length) {
      var token = 'product/' + item.id;
      item.catalogItems = [item];
      addCatalogItem(token, item);
    } else {
      var catalogItems = [];
      // var itemNames = [];
      buckets.forEach(function(bucket) {
        Object.keys(bucket).forEach(function(bucketOption) {
          var bucketName = bucket[bucketOption].name;
          if (isNamingBucket(bucketName)) {
            var attr = {};
            attr[bucketName] = bucketOption;
            var token = 'product/' + item.id + '?' + tokenizeAttr(attr);
            catalogItems.push(item);
            // itemNames.push(bucketOption);
            // item.additionalName = bucketOption;
            addCatalogItem(token, item);
          }
        });
      })
      
      item.catalogItems = catalogItems;
    }
   
    return item;
  }

  function addCatalogItem(token, product) {
    product.token = token;
    Catalog[token] = new CatalogItem( token, product );
  }
  /** 
  *   DATA ACCESSORS 
  */
  
  function getStock( pid, attributes ){
    var stored = Inventory['product/'+pid+ '?' + tokenizeAttr(attributes) ];
    return stored;
  }
  
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

  function test(){
    console.log('BEGIN TESTS');
    console.log(Inventory)
    Object.keys(Catalog).forEach( function( key ){
      var item = window.EDB.Magic.getCatalogItem( key );
      console.log(
        'Token: '+key+'\n -name: %s\n -stock: %s\n -price: %s',
        item.name,
        item.stock,
        item.price
        // Catalog[key].description.slice(0,20)
      );
      if(/198/.test(key)){
        window.EDB.Magic.getCatalogItem(key+'&slipcover=slipcover-004');
      }
    });
    
  }
  function rebuild(){
    return fetchMaterials().then(setupMaterials).then(fetchProducts).then(setupCatalog).then( test );
  }  
  
  function loadSessionCart() {
    var sessionCartKeys = Object.keys(localStorage).filter(function(key) {
      return /^EDB_CART/.test(key)
    });
    var h48 = 60 * 60 * 48 * 1000;
    var sessionItems = sessionCartKeys.map(function(key) {
      return JSON.parse(localStorage.getItem(key));
    }).filter( function( item ){
      return (Date.now() - item.stored < h48)
    });
    sessionItems.forEach(function(item) {
      Checkout.addToCart(item.pid, item.attributes, item.quantity);
    });
    return true;
    // console.log('sessionItems', sessionItems);
  }


  function updateApp(){
    if(!app) return;
    app.debounce('updateApp', function() {

      Checkout.setCustomer(window.CurrentUser);
      
      app.set('customer',Customer);
      
      // app.set('cart', [] );
      // app.set('catalog', []);
      
      app.set('cart', Object.keys(Cart).map(function(uuid) {
        return Cart[uuid];
      }));
      
      if(!app.catalog){
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
  };
  
  var Checkout = {};
  Checkout.getStock = function(){}
  
  Checkout.setCustomer = function setCustomer(user) {
    user = user;
    // console.log('setCustomer', user );
    
    if (!user) {
      Customer = Guest;
    } else {
      Customer = Object.assign(Guest, user.customer_meta, {name: user.name });
    }
    
  }
  
  Checkout.updateCartItemQuantity = function( productId, attributes, qty ){
    // console.log('updateCartItemQuantity')
    var uuid = 'product/'+ productId + '?' + tokenizeAttr( attributes);
    var cartItem = Cart[uuid];
    if(cartItem){
      cartItem.quantity = qty;
    }
    updateApp();
  }
  
  Checkout.addToCart = function(productId, attributes, qty) {
    var uuid = 'product/'+ productId + '?' + tokenizeAttr( attributes);
    var entry = Inventory[uuid];
    var cartItem = Cart[uuid];
    if (!entry) {
      console.error('NOT ENTRY', uuid);
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
  
  Checkout.computeCartTotals = function(){
    var subTotal=0;
    var lines = [];
    Object.keys(Cart).forEach( function( uuid ){
      var total = Cart[uuid].quantity * Checkout.getPrice( Cart[uuid].product.id, Cart[uuid].variation.attributes );
      subTotal += total;
      return lines.push({ label: Cart[uuid].name + ' x' + Cart[uuid].quantity, value: total });
    });
    
    lines.unshift( { label: 'subtotal', value: subTotal });
    lines.unshift( { label: 'tax', value: (0.15 * subTotal) });
    lines.unshift( { label: 'shipping', value: 0 });
    lines.unshift( { label: 'total', value: subTotal + (0.15 * subTotal) });
    
    return lines;    
    
  }
  
  
  Checkout.removeFromCart = function(uuid) {
    delete Cart[uuid];
    localStorage.removeItem('EDB_CART|' + uuid);
    updateApp()
  };

  // Object.keys(Checkout).forEach( function(k){
  //   if(window.EDB.Checkout){
  //     window.EDB.Checkout[k] = Checkout[k];
  //   }
  // });
  Checkout.init = function( polymerApp ){
    app = polymerApp;
    console.log('Magic ready');
    rebuild().then(loadSessionCart).then( updateApp );
  }
  window.EDB.Checkout = window.EDB.Checkout||Checkout;
  window.EDB.Magic = {
    init: function( polymerApp ) {
      app = polymerApp;
      console.log('Magic ready');
      rebuild().then(loadSessionCart).then( updateApp );
    },
    getCatalogItem: function( token ){
      if(arguments.length == 2){
        var token = 'product/'+token+tokenizeAttr(arguments[1]);
        return window.EDB.Magic.getCatalogItem( token );
      };
      var catalogItem = Catalog[token];
      if(!catalogItem){
        var data = expandToken(token);
        
        console.log('FIND CATALOG ITEM',  Products[data.id] );
      }

      return catalogItem;
    }
  }





})();