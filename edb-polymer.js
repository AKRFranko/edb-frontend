(function(EDB){
  if(!EDB) throw new Error('Missing EDB namespace.');
  var app;
  EDB.PolymerAuth = Polymer({
    is: 'edb-auth',
    properties: {
      user: {
        type: Object,
        value: function(){
          return window.CurrentUser;
        },
        notify: true
      },
      isAuthenticated: {
        type: Boolean,
        value: function(){
          // return EDB.isAuthenticated();
        },
        notify: true
      },
      email: {
        type: String,
        notify: true
      },
      password: {
        type: String,
        notify: true
      },
      passwordConfirmation: {
        type: String,
        notify: true
      }
    },
    login: function(  ){
      var auth = this;
      EDB.login( this.email, this.password ).then( function(){
        if(EDB.isAuthenticated()){
          auth.set('user', window.CurrentUser );
          auth.set('password', null)
          auth.set('passwordConfirmation', null)
        }else{
          auth.set('user', null );
        }
        auth.set('isAuthenticated', EDB.isAuthenticated());
      });
    },
    register: function(  ){
      var auth = this;
      EDB.register( this.email, this.password ).then( function(){
        auth.login();
      });
    },
    logout: function(  ){
      var auth = this;
      EDB.logout().then( function(){
        auth.set('user', null );
        auth.set('isAuthenticated', false);
      });
    },
    ready: function(){
      
      EDB.autoLogin( this );
    }
  });
  EDB.PolymerResource = Polymer({
    is: 'edb-resource',
    properties: {
      name: {
        type: String,
        notify: true,
        value: null
      },
      ref: {
        type: Object,
        value: null,
        computed: '__getRef(name)'
      },
      params: {
        type: Object,
        notify: true,
        value: function(){
          return { context: 'view' };
        }
      },
      selectedId: {
        type: String,
        notify: true,
        value: null,
        observer: '__getSelectedItem'
      },
      loading: {
        type: Boolean,
        notify: true,
        value: false
      },
      items: {
        type: Array,
        value: function() {
          return [];
        },
        notify: true
      },
      item: {
        type: Object,
        value: function() {
          return {};
        },
        notify: true
      }
    },
    __getRef: EDB.getResourceReference,
    __loadList: function(items) {
      var hasSortOrder = items.some( function(i){ return i||i.hasOwnProperty('sortOrder')});
      if(hasSortOrder){
        items = items.sort( function(a,b){
          checkA =  1*a.sortOrder;
          checkB =  1*b.sortOrder;
          return checkA > checkB ? 1 : checkB > checkA ? -1 : 0;
        });
        // console.log('sorted!', this.name, items.map(function(i){return i.title.en}))
      }else{ 
        // console.log('unsorted', items)
      }
      
      this.set('loading', false );
      this.set('items', items || []);
      if(this.app){
        // console.log(this.name+'.items', items);
        this.app.set(this.name+'.loading', false );
        this.app.set(this.name+'.items', items || [] );
        // (items||[]).forEach( function( itm, idx ){
        //   Object.keys(itm).forEach(function(k){
        //     var value = items[idx][k];
        //     this.app.notifyPath(this.name+'.items.'+idx+'.'+k, value );  
        //   }, this )
        // }, this )
      }
    },
    __loadItem: function(item) {
      this.set('loading', false );
      this.set('item', item || {});
      if(this.app){
        this.app.set(this.name+'.loading', false );
        this.app.set(this.name+'.item', item || {} );
      }
    },
    __unloadList: function() {
      this.set('loading', false );
      this.set('items', []);
      if(this.app){
        this.app.set(this.name+'.loading', false );
        this.app.set(this.name+'.items', [] );
      }
    },
    __unloadItem: function() {
      this.set('loading', false );
      this.set('item', {});
      if(this.app){
        this.app.set(this.name+'.loading', false );
        this.app.set(this.name+'.item', {} );
        
      }
    },
    __triggerError: function(error) {
      this.fire('error', error);
      console.log(error);
    },
    __getSelectedItem: function(id) {
      console.log('__getSelectedItem', id );
      if (id == 'new' || !id) {
        this.__unloadItem();
      } else {
        this.getItem(id);
      }
    },
    
    factoryImpl: function(refName, appRef) {
      var it = this;
      var params = { context: 'view'};
      this.set('name',refName);
      this.app = appRef;
      
      this.refreshItems = function() {
        this.set('loading', true );
        var op = it.ref.list( it.params );
        op.then(it.__loadList.bind(it)).
        catch (it.__triggerError.bind(it));
        return op;
      };
      this.clearItems = function() {
        this.set('loading', true );
        return Promise.resolve(this.unloadList());
      };
      this.getItem = function() {
        this.set('loading', true );
        var op = it.ref.get(this.selectedId, it.params);
        op.then(it.__loadItem.bind(it)).
        catch (it.__triggerError.bind(it));
        return op;
      };
      this.updateItem = function(id, data) {
        this.set('loading', true );
        var op = it.ref.update( this.selectedId,this.item , it.params);
        op.then(it.__loadItem.bind(it)).
        catch (it.__triggerError.bind(it));
        return op;
      };
      this.updateItems = function( items ) {
        this.set('loading', true );
        var op = it.ref.batchUpdate( this.items, it.params );
        op.then(it.__loadItem.bind(it)).
        catch (it.__triggerError.bind(it));
        return op;
      };
      this.removeItem = function() {
        this.set('loading', true );
        var op = it.ref.remove(this.selectedId, it.params);
        op.then(it.__unloadItem.bind(it)).
        catch (it.__triggerError.bind(it));
        return op;
      }
      Object.defineProperty(this, 'params', {
        enumberable: true,
        get: function(){
          if(!params.context){
            params.context = 'edit';
          }
          return params;
        },
        set: function( v ){
          if(!v){
            params = {context: 'edit'}
          }else{
            params = v;
          }
        }
      });
      
    }
  });
 
})(this.EDB)