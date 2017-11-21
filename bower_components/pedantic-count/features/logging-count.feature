Feature: An auto count instance class that keeps a 
    history of all changes for a count, in a logging manner.
  
Scenario: Manipulating values creates a log of changes
  Given a logging count of 0
  When I increment the logging count by 2 with message "add-to-cart"
  Then I get a log with a length of 2 and an entries matching "initialize to 0" "add-to-cart 2";
  
Scenario: Reset keeps the entire log 
  Given a logging count of 0
  When I increment 3 times using 10 
   And I reset the logging count
  Then I get a log which the first item is an array
  Then the last item of the first array is "reset to 0"
  
Scenario: A log of changes can be explained
  Given i reuse the previous loggin count
  When I increment 3 times using 10
   And I reset the logging count
   And I increment 2 times using 5
   And I query the explain method
  Then I get a clear human-readable explanation