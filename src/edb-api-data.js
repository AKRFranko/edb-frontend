if(window.EdbApiData) return;
//
// Define your database
// //
var db = new Dexie("edb_dev_api");
var resources = {
  jwtAuth: {
    store:  'token',
    url: '/wp-json/jwt-auth/v1/token',
    method: 'post'
  },
  
  currentUser: {
    store:'id,designer_meta.designer_level',
    url: '/wp-json/wp/v2/users/me',
    method: 'get'
  },
  pages: {
    store: 'id,status',
    url:'/wp-json/wp/v2/pages',
    method: 'get'
  },
  materials: {
    store: 'id,&meta_box.edb_material_number,meta_box.edb_material_attribute',
    url:'/wp-json/wp/v2/materials',
    method: 'get'
  },
  slides:{
    store: 'id,meta_box.edb_sort_order',
    url:'/wp-json/wp/v2/slides',
    method: 'get'
  },
  features: {
    store: 'id,meta_box.edb_sort_order',
    url:'/wp-json/wp/v2/features',
    method: 'get'
  },
  inspirations: {
    store: 'id,meta_box.edb_sort_order',
    url:'/wp-json/wp/v2/inspirations',
    method: 'get'
  },
  lookbooks: {
    store: 'id,meta_box.edb_sort_order',
    url:'/wp-json/wp/v2/lookbooks',
    method: 'get'
  },
  products: {
    store: 'id,*categories.slug,meta_box.edb_wireframe,meta_box.edb_is_bucket',
    url:'/wp-json/wc/v2/products',
    method: 'get',
    params: {
      per_page: 100
    }
  },
  variations: {
    store: 'id,parent_id,*categories.slug,meta_box.edb_wireframe,meta_box.edb_is_bucket',
    method: 'get',
    url:'/wp-json/wc/v2/products/:pid/variations',
    childOf: 'products'
  }
};
var stores = Object.keys(resources).reduce( function( stores, key ){
  stores[key] = resources[key].store;
  return stores;
}, {} );


stores.last_refresh = 'table,stamp';
stores.product_variations = 'product,*variations',
         

db.version(1).stores( stores );





class EdbApiData extends Polymer.Element {
  static get is() { return 'edb-api-data'; }
  static get properties(){
    var storeProperties = Object.keys( stores ).reduce( (props, key )=>{
      if(key !== 'currentUser'){
        props[key] = {
          type: Array,
          notify: true,
          readOnly: true,
          value: ()=>{
            return [];
          }
        }  
      }
      return props;
    }, {} );
    return Object.assign({
      currentUser: {
        type: Object,
        notify: true,
        readOnly: true,
        value: ()=>{
          return {};
        }
      },
      log: {
        type: Boolean,
        value: false
      },
      jwtAuth: {
        type: Object,
        notify: true,
        value: ()=>{
          return {};
        }
      },
      dataSource: {
        type: Object,
        notify: true,
        value: ()=>{
          return {};
        }
      },
      headers: {
        type: Object,
        computed: '_computeHeaders(defaultHeaders,authHeaders)'
      },
      defaultHeaders: {
        type: Object,
        value: function(){
          return {
            "X-Requested-With": "XMLHttpRequest",
            "cache-control": "max-stale"
          };
        }
      },
      authHeaders: {
        type: Object,
        value: function(){
          return {};
        }
      },
      apiRoot: {
        type: String,
        value: 'https://installatex.ca'
      },
      rootPath: {
        type: String,
      },
      route: {
        type: Object
      },
      routeData:{
        type: Object
      }
    },storeProperties);
  }
  
  static get observers(){
    return ['_onJwtAuthChanged(jwtAuth)','_prepareForRoute(route,routeData)']
  }
  
  _computeHeaders(defaultHeaders,authHeaders){
    return Object.assign({},defaultHeaders,authHeaders);
  }
  
  _onJwtAuthChanged(jwtAuth){
    if(!this.ajax || (this.ajax && !this.ajax.jwtAuth)){
      return;
    }
    if(this._isNotDefined(jwtAuth) || jwtAuth === null){
      this.set('authHeaders', {});
    }else{
      this.set('authHeaders', { 'Authorization': 'Bearer ' + jwtAuth.token });
      Polymer.Async.microTask.run( this.ajax.currentUser.generateRequest.bind( this.ajax.currentUser ) );
    }
  }
  
  _populateStore(key){
    
    var newData = this[key];
    if(this.log) console.log('_populateStore', key, newData );
    var newDataIds = Array.prototype.map.call(newData,(data)=>{ return data.id });
    var table = db[key];
    var deletions = [];
    var batchCreate = [];
    return table.each( ( item )=>{
      var id = item.id;
      var index = newDataIds.indexOf(id);
      if(!~index && !resources[key].childOf){
        deletions.push( id );
      }
      
    }).then( ()=>{
      if(this.log) console.log('found items to delete: ' + deletions.length );
      return deletions.length > 0 ? table.bulkDelete(deletions) : Promise.resolve();
    }).then( ()=>{
      if(this.log) console.log('bulkPut', newData );
      return table.bulkPut(newData);
    });
  }
  
  _populateFromStore(key){
    if(this.log) console.log('_populateFromStore',key);
    if(this.dataSource[key] == 'remote'){
      if(this.log) console.log('no populating, data comes from remote.');
      return Promise.resolve();
    }
    var table = db[key];
    return table.toArray( ( array )=>{
      var setter = '_set' + key.slice(0,1).toUpperCase() + key.slice(1);
      this.set('dataSource.'+key, 'indexdb');
      this[setter].call( this, array );
      if(this.log) console.log('populating From Store',key, array );
    });
  }
  
  constructor(){
    super();
    if(this.log) console.log('// Opening database...');
    
    db.open().then( (db)=> {
      if(this.log) console.log('// Database opened successfully');
    }).catch ( (err)=> {
      if(this.log) console.log('// Error occurred', err );
    });
    
      

  }
  
  // _createAjaxElement( key, url ){
  //   var method = resources[key].method;
  //   var params = resources[key].params;
  //   elements[key] = document.createElement('iron-ajax');
  //   elements[key].addEventListener('last-response-changed', ()=>{
  //     var setter = '_set' + key.slice(0,1).toUpperCase() + key.slice(1);
  //     this.set('dataSource.'+key,'remote');
  //     this[setter].call(this,elements[key].lastResponse);
  //     this._populateStore( key );
  //   });
  //   elements[key].addEventListener('error', (event)=>{
  //     console.log('Ajax error, could not populate: ' + key );
  //     console.log(event.detail.error.message);
  //   });
  //   elements[key].url = url;
  //   elements[key].method = method;
  //   elements[key].params = params;
  //   if(method === 'get'){
  //     Polymer.Async.idlePeriod.run( elements[key].generateRequest.bind(elements[key]));
  //   }
  //   return elements;
  // }
  
  // _createAjaxElements(){
  //   this.ajax = Object.keys(resources).reduce(( elements, key )=>{
  //     if(resources[key].childOf){
        
  //     }else{
  //       return this._createAjaxElement( key, this.apiRoot + resources[key].url );
  //     }
      
  //   }, {} );
  // }
  connectedCallback(){
    super.connectedCallback();
    Object.keys(resources).forEach( ( key )=>{
      this._populateFromStore( key );
      var hasBody = this[key+'Body'];
      if(resources[key].method == 'post' && !hasBody){
        return;
      }else{
        this._syncFromRemote( key );
      }
    });
  }
  
  _syncFromRemote( key, url, method, body  ){
    if(this.log) console.log('_syncFromRemote',key,url);
    if(!resources[key] && !url){
      console.error('Dont know what to do with: ' + key );
      return;
    }
    
    var request = {
      url: this.apiRoot  + ( resources[key] ? resources[key].url  : url ) ,
      method: ( method || ( resources[key] ? resources[key].method : 'get' ) ),
      body: ( body || this[key+'Body'] ),
      params: ( resources[key] ? resources[key].params : {} ),
      contentType:'application/json',
      handleAs: 'json',
      headers: this.headers  
    }
    
    var xhr = document.createElement('iron-request'); 
    var onComplete = ()=>{
      var response = xhr.response;
      var keyParts = key.split(':');
      if(keyParts.length > 1){
        key = keyParts[0];
        if(response){
          response.parent_id = keyParts[0];
        }
      }
      var setter = '_set' + key.slice(0,1).toUpperCase() + key.slice(1);
      
      var newValue = response;
      if(resources[key].childOf){
        var values = this[key];
        var ids = response.map( ( v )=>{return v.id });
        var others = values.filter( ( r )=>{
          return !(~ids.indexOf(r.id));
        });
        newValue = others.concat( response );
      }
      this.set('dataSource.'+key,'remote');
      this[setter].call( this, newValue );
      this._populateStore( key );
    }
    var onError = (error)=>{
      console.log('onError', error )
    }
    
    xhr.send( request ).then( onComplete ).catch( onError );
    
  }
  
  _prepareForRoute(route,data){
    // var path = route.path.slice(1);
    // var parts = path.split('/');
    // if(parts[0] == 'shop'){}
    console.log('_prepareForRoute', route,data);
    
  }
  
  /**
   * Checks if arguments are not undefined or empty strings
   *
   * @return {Boolean}
   */
  _isNotDefined() {
    let i;
    for (i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] === 'undefined' || arguments[i] === '') return true;
    }
  }
  
 
  
} 


window.EdbApiData = EdbApiData;
window.customElements.define(EdbApiData.is, EdbApiData);
