var {defineSupportCode} = require('cucumber');
var assert = require('assert');
var Index = require( process.cwd() + '/browser.js' ).CountIndex;


defineSupportCode(function({Given, When, Then}) {
  var json,index,text;
  
 Given('some JSON data', function (docString) {
   json = JSON.parse(docString.trim());
   return assert.ok(json);
 });
 
 Given('we use the same index as above', function () {
   return true;
 });
 
 Then('the total for {string} should be {int}', function (string, int) {
   return assert.equal( Index.getTotal( string ), int ) ;
 });
 

 When('I clear the indexes', function(){
   return assert.ok(Index.clear());
 })
 
 Then('The index for {string} should not exist', function(string){
   return assert.ok(!Index.hasCount(string));
 })
 
 When('I create indexes for {string} using {string}', function (string, string2) {
   json.forEach( ( item )=>{
     var idx = Index.createIndex( string );
     idx.set( item.id, item[string2] );
   })
   return assert.ok(true);
 });
 
 Then('the index {string} should have these ids [{string}]', function (string,string2) {
   return assert.deepEqual( Index.getIds( string ), string2.split(/\s?,\s?/));
 });
 
 Then('the item with id {int} should have a {string} of {int}', function (int, string, int2) {
   return assert.equal( Index.getCount( string , int ), int2);
 });
 
 When('I increase the {string} for {int} by {int}', function (name, id, qty) {
   return assert.ok( Index.incrCount( name, id, qty ) );
 });
 When('I decrease the {string} for {int} by {int}', function (name, id, qty) {
   return assert.ok( Index.decrCount( name, id, qty ) );
 });
 
 Then('the count for {string} at {int} should be {int}', function (name, id, qty) {
   return assert.equal( Index.getCount( name, id ) , qty);
 });
 
 
 Given('I link {string} to {string}', function (string, string2) {
   return assert.ok(Index.link( string, string2));
   
 });
 
 
 When('I create an virtual index for {string} with default value {int}', function (string,int) {
   return assert.ok(Index.createVirtual( string, int ));
 });
 
 Then('the {string} for {int} should be {int}', function (name, id, stock) {
   return assert.equal( Index.getCount( name, id ), stock );
 });
 
 When('I ask for an explanation for {string} of {int}', function (string, int) {
   return assert.ok( text = Index.explain(string,int));
 });
 
 Then('I get an explanation for {string} of {int}', function (string, int) {
   console.log(text)
   return assert.ok(text.length);
 });
 
 When('I reset the {string} for id {int}', function (string, int) {
   return assert.ok(Index.resetCount(string, int ))
 });
 
});