var {defineSupportCode} = require('cucumber');
var assert = require('assert');
var Count = require( process.cwd() + '/index.js' ).Count;


defineSupportCode(function({Given, When, Then}) {
  var givenNumber,notdefined;
  var instance;
  var history;
  var A,B;
  Given('no number at all', function () {                            
    givenNumber = notdefined;
    return true;
  });                                                                                                                               
                                                                             
  When('I create a count instance', function () {                      
    instance = new Count(givenNumber);
    return assert.ok( instance instanceof Count);
  });                                                                                                                                                    
                                                                             
  Then('I get a count instance with a value of {int}', function (int) {                                                                          
    return assert.equal( instance, int );
  });                                                                        
               
                                                                             
  Given('a count instance for {int}', function (int) {               
    givenNumber = int;
    instance = new Count( givenNumber );
    return assert.ok( instance instanceof Count);
  });   
  
  Given('count instance A of {int}', function (int) {
    A = new Count( int );
    return true;
  });
  
  Given('count instance B of {int}', function (int) {
    B = new Count( int );
    return true;
  });
  
  Given('I increment A by {int}', function (int) {
    return assert.ok(A.incr( int ));
    
  });
  
  Given('I increment B by {int}', function (int) {
    return assert.ok(B.incr( int ));
  });
                                                                             
  When('I increment the value by {int}', function (int) {          
    var error;
    try{
      instance.incr( int );
    }catch(e){
      error = true;
    }finally{
      return assert.ok( !error );  
    }
  });   
  
  When('I decrement the value by {int}', function (int) {
    var error;
    try{
      instance.decr( int );
    }catch(e){
      
      error = true;
    }finally{
      return assert.ok( !error );  
    }
  });
  
  When('I increment the value by A', function() {          
    var error;
    try{
      instance.incr( A );
    }catch(e){
      
      error = true;
    }
     return assert.ok( !error );  
  
  });   
  
  When('I decrement the value by B', function () {
    var error;
    try{
      instance.decr( B );
    }catch(e){
      error = true;
    }
    return assert.ok( !error );  
  });
  
  Then('I get an array with [{int},{int},{int},{int},{int}];', function (int, int2, int3, int4, int5) {
    return assert.deepEqual( history, [int, int2, int3, int4, int5]  );
  });
  
  When('I query the number\'s history', function () {                
    return assert.ok(history = instance.history);
  });                                  
  
  Then('I get an array with [{int},{int},{int}];', function (int, int2, int3) {                                                    
    return assert.deepEqual( history, [int, int2, int3]  );
  });    
  
  Then('I get an array with [{int},{int},{int},{int}];', function (int, int2, int3, int4) {                                                    
    return assert.deepEqual( history, [int, int2, int3, int4 ]  );
  });
  
  Then('I get a log with [{string},{string},{string},{string},{string}];', function (string, string2, string3, string4, string5) {
    
    return assert.deepEqual( instance.log, [string, string2, string3, string4, string5] );
  });
  
  When('I increment {int} times using random numbers', function (int) {
    Array(int).fill().forEach( function(){
      instance.incr( Math.floor(Math.random() * 10) );
    })
    return assert.ok( instance );
  });
  
  When('I call reset', function () {
    instance.reset();
    return true;
  });
  
  
  
});