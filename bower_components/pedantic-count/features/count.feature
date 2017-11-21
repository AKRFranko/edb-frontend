Feature: An auto count instance class that keeps a history of all changes for a count.
  
Scenario: It has an initial value
  
  Given no number at all
  
  When I create a count instance
  Then I get a count instance with a value of 0
  

Scenario: Incrementing and decrementing changes the end value and keeps a history
  
  Given a count instance for 0
  
  When I increment the value by 2
  Then I get a count instance with a value of 2
  
  When I increment the value by 3
  Then I get a count instance with a value of 5
  
  When I decrement the value by 1
  Then I get a count instance with a value of 4
  
  When I query the number's history
  Then I get an array with [0,2,3,-1];
  
Scenario: Incrementing and decrementing with other count instances
  changes the end value and keeps an expanded history
  
  Given a count instance for 0
    And count instance A of 1
    And count instance B of 1
    And I increment A by 2
    And I increment B by 2
    
  When I increment the value by A
  Then I get a count instance with a value of 3
  When I query the number's history
  Then I get an array with [0,1,2];
  
  When I decrement the value by B
  Then I get a count instance with a value of 0
  When I query the number's history
  Then I get an array with [0,1,2,-3];
  
Scenario: Reset returns the value to it's initialized value
  Given a count instance for 0
  When I increment 3 times using random numbers 
   And I call reset
  Then I get a count instance with a value of 0
  
  Given a count instance for 10
  When I increment 3 times using random numbers 
  And I call reset
  Then I get a count instance with a value of 10
  
  
    
  
