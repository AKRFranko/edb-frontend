Feature: An auto count instance can be a property of any other object
  
Scenario: 
  Given any class
  When I define a count property called "cartItemCount" with an initial value of 0
   And I created an instance of that class
  Then the class instance should have a property "cartItemCount" 
   And the class instance should have an inital "cartItemCount" of 0

Scenario: 
  Given the same class
  When I define a count property called "cartItemCount" with an initial value of 0
  Then it should throw an error

Scenario: 
  Given the same class
  When I define a count property called "stockCount" with an initial value of 1
  Then the class instance should have a property "stockCount" 
  And the class instance should have an inital "stockCount" of 1
  And the class is explained
   
Scenario: 
 Given a blank object
 When I define a count property called "cartItemCount" with an initial value of 0
 Then the object instance should have a property "cartItemCount"
 Then the object instance should have a property "cartItemCountHistory" 
 Then the object instance should have a property "cartItemCountLog"
  And the object instance should have an inital "cartItemCount" of 0
  
Scenario: 
  Given the same blank object
  When I define a count property called "cartItemCount" with an initial value of 0
  Then it should throw an error
  
