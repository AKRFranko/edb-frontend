var {defineSupportCode} = require('cucumber');
var assert = require('assert');
var Count = require( process.cwd() + '/index.js' ).LoggingCount;

class TestClass{
  
}

defineSupportCode(function({Given, When, Then}) {
  var givenNumber,instance,result,target
  Given('any class', function () {
    target=TestClass;
    return true;
  });
  
  Given('a blank object', function () {
    target={};
    return true;
  });
  Given('the same blank object', function () {
    return true;
  });
  Given('the same class', function () {
    target=TestClass;
    return true;
  });
  
  When('I define a count property called {string} with an initial value of {int}', function (string,int) {
    try{
      Count.defineProperty( target, string, int, true, true );  
    }catch(e){
      result = e;
    }
    return true;
  });
  
  When('I created an instance of that class', function () {
    instance = new target();
    return true;
  });
  
  Then('the class is explained', function(){
    
    return assert.ok(instance.explainCounts());
  })
  
  Then('the class instance should have a property {string}', function (string) {
    
    return assert.ok( typeof instance[string] !== 'undefined' );
  });
  
  Then('the class instance should have an inital {string} of {int}', function (string,int) {
    return assert.equal( instance[string], int );
  });
  
  Then('the object instance should have a property {string}', function (string) {
    
    return assert.ok( typeof instance[string] !== 'undefined' );
  });
  
  Then('the object instance should have an inital {string} of {int}', function (string,int) {
    return assert.equal( instance[string], int );
  });
  
  Then('it should throw an error', function () {
    return assert.ok( result instanceof Error )
  });

});