  /**
  * @file Count.js
  * @author Franko <franko@akr.club>
  * @version 0.1
  */
  
  /**
   * History WeakMap for all instances
   * @const histMap
   */
  const histMap = new WeakMap();
  
  /**
  * Loglines WeakMap for all instances
  * @const logMap
  */
  const logMap  = new WeakMap();
  
  /**
  * histories memo
  * @const histories
  */
  const histories = function (object) {
      if (!histMap.has(object))
          histMap.set(object, [ ]);
      return histMap.get(object);
  };
  
  
  
  /**
  * loglines memo
  * @const loglines
  */
  const loglines = function (object) {
      if (!logMap.has(object))
          logMap.set(object, [ ]);
      return logMap.get(object);
  };
  
  const explanation = function( loglines, history, result, indent ){
    result = result||['\nScenario: Explain a Count'];
    indent = indent||0;
    
    history.forEach( ( n, i )=>{
      let log = loglines[i];
      if(Array.isArray(log)){
        let hist = new Array(log.length);
        hist.fill( n );
        indent++;
        return explanation( log, hist, result, indent );
      }else{
        result.push( /^initialize/.test(log) ? 'When I ' + log : 'And I ' + log);
      }
    });
    var space = new Array(indent).fill(' ').join('');
    indent--;
    return result.join('\n'+space+' ');
  }
  
  
  
  class BaseCount{
    
    static __defineProperty( obj, name, instance, logging ){
      
      Object.defineProperty( obj, name, {
        enumerable: true,
        value: instance
      });
      
      if(!obj.__countProperties__){
        Object.defineProperty( obj, '__countProperties__', {
          enumerable: false,
          writeable: true,
          value: {}
        }); 
      }
      
      Object.defineProperty( obj.__countProperties__, name, {
        enumerable: true,
        get: ()=>{ return  instance }
      });
      
      Object.defineProperty( obj, name +'History', {
        get: ()=>{ return  instance.history }
      });
      
      if(logging){
        
        Object.defineProperty( obj, name + 'Log', {
          get: ()=>{ return  instance.log }
        });
        
        Object.defineProperty( obj, name + 'Explanation', {
          get: ()=>{ return  instance.explain().replace(/Explain a Count/g, 'Explain a Count named ' + name  ) }
        });  
        
        var oldExplain = obj.explainCounts;
        obj.explainCounts = ()=>{
          var previous = oldExplain ? oldExplain.call( obj ) : null;
          var bunch = previous ? [ previous ] : [];
          Object.keys(obj.__countProperties__).forEach( ( name )=>{
            bunch.push(obj[name+'Explanation'])
          });
          return bunch.join("\n");
        }
      }
  
    }
    
    
    static defineProperty( obj, name, init, strict, logging ){
      var clazz = BaseCount
      if( logging ){
        clazz = LoggingCount;
      }else if( strict ){
        clazz = StrictCount;
      }
      var instance = new clazz( init );
      
      if(typeof Object.getPrototypeOf(obj) == 'function'){
        BaseCount.__defineProperty( obj.prototype, name, instance, logging );
      }else{
        BaseCount.__defineProperty( obj, name, instance,logging );
      }
      
      return obj;
    }
    
    /**
    * Represents a Count.
    * @constructor
    * @param {number} initial - The initial value
    */  
    
    constructor(initial){
      if(isNaN(initial)){
        this.set( 0 );
      }else{
        this.set(initial);
      }
    }
    
    /**
    * Returns the numeric value of the count
    * @returns {number} The sum of the historical changes
    */  
    
    valueOf(){
      return Number(histories(this).reduce( (t,n)=>{ return t + n; }, 0 ));
    }
    
    /**
    * Returns the array of values used to calculate the result.
    * @returns {array} The values for all changes
    */  
    
    get history(){
      return Array.from(histories(this));
    }
    
    /**
    * Returns the length of the history
    * @returns {array} The values for all changes
    */  
    
    get length(){
      return histories(this).length;
    }
  
    /**
    * Returns the numeric value of the count
    * @returns {number} The sum of the historical changes
    */  
    
    get(){
      return 1*this;
    }
    
    /**
    * Adds a new value to the history
    * @param {number} value - An integer
    * @returns {number} The sum of the historical changes
    */  
    
    set(v){
      if(isNaN(v)){
        return this.valueOf;
      }
      
      if( typeof v.history !== 'undefined'){
        v.history.forEach( ( v )=>{
          this.set( v );
        });
      }else{
        histories(this).push( v );  
      }
      
      return this.valueOf;
    }
    
    /**
    * Adds a new value incrementation the history
    * @param {number} value - A non-negative integer
    * @returns {number} The sum of the historical changes
    */  
    
    incr(n){
      
      if(isNaN(n) ){
          n=0;
      }
      if(n<0 ){
        n = Math.abs(n);
      }
      return this.set( n );
    }
    
    /**
    * Adds a new value decrementation the history
    * @param {number} value - A non-negative integer
    * @returns {number} The sum of the historical changes
    */  
    
    decr(n){
      
      if(isNaN(n) ){
        n=0;
      }
      if(n<0 ){
        n = Math.abs(n);
      }
      
      return this.set( -1*n );
    }
    
    /**
    * Returns the history to the first value set.
    * @returns {number} The sum of the historical changes (the initial value) 
    */  
    
    reset(){
      var h = histories(this);
      var first = h.shift();
      h.splice(0, h.length);
      h.push( first );
      return this.get();
    }
    
    
  }
  
  class StrictCount extends BaseCount{
    /**
    * Represents a Strict Count.
    * @constructor
    * @param {number} initial - The initial value (required)
    */  
    constructor(initial){
      if(isNaN(initial)) throw new ReferenceError('Cannot initialize without numeric value');
      super(initial);
    }
    
    /**
    * Adds a new value incrementation the history
    * @param {number} value - A non-negative integer (required)
    * @returns {number} The sum of the historical changes
    */  
    
    incr(n){
      if(isNaN(n)) throw new ReferenceError('Cannot set non-numeric value');
      if(n < 0) throw new ReferenceError('Cannot increment by negative value');
      return super.incr(n);
    }
    
    /**
    * Adds a new value decrementation the history
    * @param {number} value - A non-negative integer (required)
    * @returns {number} The sum of the historical changes
    */  
    
    decr(n){
      if(isNaN(n)) throw new ReferenceError('Cannot set non-numeric value');
      if(n < 0) throw new ReferenceError('Cannot decrement by negative value');
      return super.decr(n);
    }
    
    /**
    * Adds a new value to the history
    * @param {number} value - An integer (required)
    * @returns {number} The sum of the historical changes
    */  
    
    set(v){
      if(isNaN(v)) throw new ReferenceError('Cannot set non-numeric value');
      return super.set(v);
    }
  }
  
  class LoggingCount extends StrictCount{
    
    __defaultMessage( v, message ){
      var prefix = this.length === 1 ? 'initialize to' : message ? message : v < 0 ? 'decrement by' : 'increment by';
      return [prefix, Math.abs(v) ].join(' ');
    }
    
    /**
    * Adds a new value to the history
    * @param {number} value - An integer (required)
    * @param {string} message - A message associated with this modification (required)
    * @returns {number} The sum of the historical changes
    */ 
    
    set( v, message, fn ){
      // fn = fn || 'set';
      var result = super.set( v );
      message = this.__defaultMessage( v, message );
      if( typeof v.log != 'undefined'){
        v.log.forEach( ( l, i )=>{
          loglines(this).push( l );
        });
      }else{
        loglines(this).push( message );
      }
      return result;
    }
    
    /**
    * Adds a new value incrementation the history
    * @param {number} value - A non-negative integer (required)
    * @param {string} message - A message associated with this modification (required)
    * @returns {number} The sum of the historical changes
    */  
    
    incr(v,message){
      return this.set(v,message);
    }
    
    /**
    * Adds a new value decrementation the history
    * @param {number} value - A non-negative integer (required)
    * @param {string} message - A message associated with this modification (required)
    * @returns {number} The sum of the historical changes
    */  
    
    decr(v,message){
      return this.set(-1* Math.abs(v),message);
    }
    
    /**
    * Returns log of messages associated with value changes.
    * @returns {mixed} an array of messages or message arrays
    */  
    
    get log(){
      return Array.from(loglines(this));
    }
    
    /**
    * Returns the history to the first value set, sets the first log entry as the entire log and adds a "reset" message
    * @returns {number} The sum of the historical changes (the initial value) 
    */  
    
    reset(){
      super.reset();
      var initial = histories(this)[0];
      var l = loglines(this);
      var first = Array.from(l);
      first.push('reset to ' + initial);
      l.splice(0, l.length);
      l.push( first );
      return this.get();
    }
    
    explain(){
      var explained = explanation( loglines(this), histories(this) );
      if(/Then the value equals \d/.test(explained)){
        return explained;
      }
      var total = this.get();
      var space = explained.split('\n').pop().replace(/^(\s+).+/,"$1");
      return explained + `\n${space}Then the value equals ${total}`;
    }
  }
  
  
  /**
   * Index Map
   * @const indexMap
   */
  const indexMap = new Map();
  const indexLinks = new Map();
  const virtMap = new Map();
  class CountIndex{
  
    static get map(){
      return indexMap;
    }
    
    static clear(){
      indexMap.clear();
      indexLinks.clear();
      virtMap.clear();
      return true;
    }
    
    static clearIndex( name ){
      indexMap.delete(name);
      indexLinks.delete(name);
      virtMap.delete(name);
      return true;
    }
    
    static createIndex( name ){
      if(!this.map.has(name)){
        var idMap = new Map();
        idMap.set('ids', new Map() );
        this.map.set( name, idMap );
      }
      return new CountIndex( name );
    }
    
    static createVirtual( name, defaultValue ){
      if(!this.map.has(name)){
        var idMap = new Map();
        idMap.set('ids', new Map() );
        this.map.set( name, idMap );
      }
      virtMap.set( name, defaultValue );
      return new CountIndex( name );
    }
    
    static index( name ){
      return this.map.get( name );
    }
    static exists( name ){
      return this.map.has( name );
    }
    
    static getIds( name ){
      if( !this.exists(name) ) return [];
      return Array.from(this.index(name).get('ids').keys());
    }
    
    static getCounts( name ){
      if( !this.exists(name) ) return [];
      return Array.from(this.index(name).get('ids').values());
    }
    static getTotal( name ){
      return this.getCounts(name).reduce( ( t, c )=>{
        return t + c;
      }, 0);
    }
    
    static hasCount( name, id ){
      return this.map.has(name) && this.index(name).has('ids') && this.index(name).get('ids').has( id );
    }
    
    static getCount( name, id ){
      if(!this.hasCount( name, id )){
        if(virtMap.has(name)) return virtMap.get(name);
        throw new ReferenceError('No index for "#'+id+'" @ "'+name+'".');
      }
      var count = this.map.get( name ).get( 'ids' ).get(id);
      if(!indexLinks.has( name )){
        return count;
      }
      var links = Array.from(indexLinks.get( name ).values());
      
      return links.reduce( (t,l)=>{
        return t - this.getCount( l, id );
      }, count )
      // console.log('lnk', linkName)
      // var linkCount = this.getCount(linkName, id );
      // return count - linkCount;
      
    }
    
    static setCount( name, id, value ){
      if(this.hasCount( name, id )){
        throw new ReferenceError('Initial Count can only me set once for "#'+id+'" @ "'+name+'".');
      }else{
        return this.map.get( name ).get('ids').set(id, new LoggingCount(value));
      }
    }
    
    static incrCount( name, id, n ){
      if(!this.hasCount( name, id )){
        if(virtMap.has(name)){
          this.setCount( name, id, virtMap.get(name));
          return this.incrCount( name, id, n );
        }
        throw new ReferenceError('No count for id "'+id+'".');
      }else{
        return this.map.get( name ).get('ids').get(id).incr( n );
      }
    }
    static decrCount( name, id, n ){
      if(!this.hasCount( name, id )){
        if(virtMap.has(name)){
          this.setCount( name, id, virtMap.get(name));
          return this.decrCount( name, id, n );
        }
        throw new ReferenceError('No count for id "'+id+'".');
      }else{
        return this.map.get( name ).get('ids').get(id).decr( n )
      }
    }
    
    static resetCount( name, id){
      if(!this.hasCount( name, id )){
        return true;
        // throw new ReferenceError('No count for id "'+id+'".');
      }else{
        return this.map.get( name ).get('ids').get(id).reset()
      }
    }
  
    static getHistory( name, id ){
      if(!this.hasCount( name, id )){
        throw new ReferenceError('No history for id "'+id+'".');
      }else{
        return this.map.get( name ).get('ids').get(id).history;
      }
    }
    
    static getLog( name, id ){
      if(!this.hasCount( name, id )){
        throw new ReferenceError('No log for id "'+id+'".');
      }else{
        return this.map.get( name ).get('ids').get(id).log;
      }
    }
    
    static explain( name, id ){
      if(!this.hasCount( name, id )){
        throw new ReferenceError('No explanation for id "'+id+'".');
      }else{
        return this.map.get( name ).get('ids').get(id).explain().replace('Scenario: Explain a Count', "Scenario: Explain "+name+" for the id " + id );
      }
    }
    
    static link( a, b ){
      if(!indexLinks.has(a)){
        indexLinks.set(a, new Set() );
      }
      indexLinks.get(a).add(b);
      return true;
    }
    
    constructor( name ){
      
      this.name = name;
    } 
    
    get ids(){
      return CountIndex.getIds( this.name );
    }
    
    get counts(){
      return CountIndex.getCounts( this.name );
    }
    
    set( id, initialCount ){
      return CountIndex.setCount( this.name, id, initialCount );
    }
    
    get( id ){
      return CountIndex.getCount( this.name, id );
    }
    
    incr( id, n ){
     return CountIndex.incrCount( this.name, id, n );
    }
    
    decr( id, n ){
     return CountIndex.decrCount( this.name, id, n );
    }
    
    
    history( id ){
      return CountIndex.getHistory( this.name, id );
    }
    
    log( id ){
      return CountIndex.getLog( this.name, id );
    }
    
    explain( id ){
      return CountIndex.explain( this.name, id );
    }
    
    link( name ){
      CountIndex.link( this.name, name );
      return true;
    }
    
  }
  
  class VirtualIndex extends CountIndex{
    constructor( name ){
      super(name);
      
      this.virtual = true;
    }
  }
  
  
module.exports = {
  CountIndex:CountIndex,
  Count:BaseCount,
  StrictCount:StrictCount,
  LoggingCount:LoggingCount
}  
