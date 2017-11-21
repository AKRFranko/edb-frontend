Feature: An auto count instance class that keeps a 
    history of all changes for a count, in a strict manner.
  
Scenario: It cannot have blank values
  
  Given no arguments
  When I create a strict count instance
  Then I get an error
  
Scenario: I cannot increment by negative values

  Given a strict count instance of 1
  When I increment the strict value by -1
  Then I get an error
  
Scenario: I cannot decrement by negative values

  Given a strict count instance of 1
  When I decrement the strict value by -1
  Then I get an error
  
Scenario: Incrementing and decrementing changes the end value and keeps a history

  Given a strict count instance of 0
  
  When I increment the strict value by 2
  Then I get a strict count instance with a value of 2
  
  When I increment the strict value by 3
  Then I get a strict count instance with a value of 5
  
  When I decrement the strict value by 1
  Then I get a strict count instance with a value of 4
  
  When I query the strict number's history
  Then I get an strict array with [0,2,3,-1];