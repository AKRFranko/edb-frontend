var {defineSupportCode} = require('cucumber');
var assert = require('assert');
var Count = require( process.cwd() + '/index.js' ).LoggingCount;


defineSupportCode(function({Given, When, Then}) {
  var givenNumber,instance,result;
  Given('a logging count of {int}', function (int) {
    instance = new Count(int);
    return true;
  });
  
  When('I increment the logging count by {int} with message {string}', function (int, string) {
    instance.incr(int,string);
    return true;
  });
  
 
  
  When('I increment {int} times using {int}', function (int, int2) {
    Array(int).fill().forEach( function(){
      instance.incr( int2 );
    })
    return assert.ok( instance );
  });
  
  When('I reset the logging count', function () {
    instance.reset();
    return true;
  });
  
  Then('I get a log with a length of {int} and an entries matching {string} {string};', function (int, string, string2) {                     
    return assert.deepEqual( instance.log, [string,string2])
  });
  
  Then('I get a log which the first item is an array', function () {
    return assert.ok(Array.isArray(instance.log[0]))
  });
  
  Then('the last item of the first array is {string}', function (string) {
    
    return assert.equal(instance.log[0].pop(), string);
  });
  
  Given('i reuse the previous loggin count', function () {
    return assert.ok(typeof instance !== 'undefined' && instance !== null);
  });
  
  When('I query the explain method', function () {
    return assert.ok( result = instance.explain() );
  });
  
  Then('I get a clear human-readable explanation', function () {
    // console.log(result)
    var expected = 'Scenario: Explain a CountWhen I initialize to 0And I increment by 10And I increment by 10And I increment by 10And I increment by 10And I increment by 10And I increment by 10And I reset to 0And I increment by 5And I increment by 5Then the value equals 10'
    return assert.equal( result.replace(/[\n\s\t]+/g,''),expected.replace(/[\n\s\t]+/g,''));
  });
  
});