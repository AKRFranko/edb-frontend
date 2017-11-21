var {defineSupportCode} = require('cucumber');
var assert = require('assert');
var Count = require( process.cwd() + '/index.js' ).StrictCount;


defineSupportCode(function({Given, When, Then}) {
  var givenNumber,instance,result;
  Given('no arguments', function () {                                
    return true;
  });          
  Given('a strict count instance of {int}', function (int) {       
    givenNumber = int;
    instance = new Count(givenNumber);
    return true;
  });                                                                                                                                                    
                                                                             
  When('I create a strict count instance', function () {             
    try{
      instance = new Count(givenNumber);
    }catch(E){
      result = E;
    }
    return true;
  });                                                                        
                                                                             
  Then('I get an error', function () {                               
    return assert.ok( result instanceof Error );
  });                                                                                                                                                    
                                                                             
  
                                                                                                                                                  
                                                                             
  When('I increment the strict value by {int}', function (int) {
    try{
      instance.incr( int );
    }catch(E){
      result = E;
    }
    return true;
  });
  
  When('I decrement the strict value by {int}', function (int) {
    try{
      instance.decr( int );
    }catch(E){
      result = E;
    }
    return true;
  });
  
  
  When('I query the strict number\'s history', function () {
    return assert.ok(instance.length);
  });
  
  Then('I get an strict array with [{int},{int},{int},{int}];', function (int, int2, int3, int4) {
    return assert.deepEqual( instance.history, [int, int2, int3, int4]);
  });
  

  
  Then('I get a strict count instance with a value of {int}', function (int) {
    return assert.equal( instance, int );
    
  });
  
  
});