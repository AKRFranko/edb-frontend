Feature: A registry of counts by product id would hepl centralize all stock and cart counts.
  
Scenario Outline: Indexes can be made.
  Given some JSON data
    """
    [ 
      { "id": 0, "stock": 5 , "cart" : 0}, 
      { "id": 1, "stock": 10, "cart" : 0 },
      { "id": 2, "stock": -5, "cart" : 0 },
      { "id": 3, "stock": 15, "cart" : 0 },
      { "id": 4, "stock": 100, "cart" : 0 },
      { "id": 5, "stock": 1000, "cart" : 0 }
    ] 
    """
  When I clear the indexes
  Then The index for "stockCount" should not exist
  Then The index for "cartCount" should not exist
  
  When I create indexes for "stockCount" using "stock" 
   And I create indexes for "cartCount" using "cart"
  Then the index "<indexName>" should have these ids [<ids>]
  Examples:
    | indexName  |      ids      |
    | stockCount | "0,1,2,3,4,5" |
    | cartCount  | "0,1,2,3,4,5" |

Scenario Outline: Counts are indexed.
  Given some JSON data
    """
    [ 
      { "id": 0, "stock": 5 , "cart" : 0}, 
      { "id": 1, "stock": 10, "cart" : 0 },
      { "id": 2, "stock": -5, "cart" : 0 },
      { "id": 3, "stock": 15, "cart" : 0 },
      { "id": 4, "stock": 100, "cart" : 0 },
      { "id": 5, "stock": 1000, "cart" : 0 }
    ] 
    """
  When I clear the indexes
  Then The index for "stockCount" should not exist
  Then The index for "cartCount" should not exist
  When I create indexes for "stockCount" using "stock" 
   And I create indexes for "cartCount" using "cart"
    Then the item with id <id> should have a "<indexName>" of <value>
    Examples:
      |  id   | indexName   | value |
      |  0    | stockCount  | 5     |
      |  0    | cartCount   | 0     |
      |  1    | stockCount  | 10    |
      |  1    | cartCount   | 0     |
      |  2    | stockCount  | -5    |
      |  2    | cartCount   | 0     |
      |  3    | stockCount  | 15    |
      |  3    | cartCount   | 0     |
      |  4    | stockCount  | 100   |
      |  4    | cartCount   | 0     |
      |  5    | stockCount  | 1000  |
      |  5    | cartCount   | 0     |

Scenario Outline: Counts can be virtual
  Given we use the same index as above
  When I create an virtual index for "selectedQuantity" with default value 0
  Then the item with id <id> should have a "selectedQuantity" of <value>
  Examples:
    | id |  value   |
    | 0  |   0      |
    | 1  |   0      |
    | 2  |   0      |
    | 3  |   0      |
    | 4  |   0      |
    | 5  |   0      |

Scenario Outline: Counts have a total
  Given we use the same index as above
  Then the total for "<indexName>" should be <total>
  Examples:
    | indexName  |  total  |
    | stockCount | 1125    |
    | cartCount  | 0       |
    
Scenario Outline: Counts can be increased
  Given we use the same index as above
  When I increase the "<indexName>" for <id> by <incr>
  Then the count for "<indexName>" at <id> should be <count>
  Examples:
    | indexName  | id  | initial  | incr | count |
    | stockCount | 0   | 5        | 5    | 10    |
    | stockCount | 1   | 10       | 10   | 20    |
    | stockCount | 2   | -5       | 5    | 0     |
    | stockCount | 3   | 15       | 5    | 20    |
    | stockCount | 4   | 100      | 80   | 180   |
    | stockCount | 5   | 1000     | 300  | 1300  |

Scenario Outline: Counts can be decreased
  Given we use the same index as above
  When I decrease the "<indexName>" for <id> by <decr>
  Then the count for "<indexName>" at <id> should be <count>
  Examples:
    | indexName  | id  | initial  | decr | count |
    | stockCount | 0   | 10       | 10   | 0     |
    | stockCount | 1   | 20       | 10   | 10    |
    | stockCount | 2   | 0        | 10   | -10   |
    | stockCount | 3   | 20       | 20   | 0     |
    | stockCount | 4   | 180      | 80   | 100   |
    | stockCount | 5   | 1300     | 300  | 1000  |
      
  
Scenario Outline: Changing a stockCount should refelct on cartCount
  Given we use the same index as above
    And I link "stockCount" to "cartCount"
  When I increase the "cartCount" for <id> by <incr>
  Then the "stockCount" for <id> should be <stock>
  Examples:
    | id | incr | stock |
    | 0  | 1    |  -1   |
    | 1  | 10   |  0    |
    | 2  | 10   |  -20  |
    | 3  | 10   |  -10  |
    | 4  | 10   |  90   |
    | 5  | 10   |  990  |
  
Scenario Outline: Changing a selectedQuantity should refelct on cartCount
  Given we use the same index as above
    And I link "stockCount" to "selectedQuantity"
  When I increase the "selectedQuantity" for <id> by <incr>
  Then the "stockCount" for <id> should be <stock>
  Then the "selectedQuantity" for <id> should be <qty>
  Examples:
    | id | incr | stock | qty |
    | 0  | 1    |  -2   |  1  |
    | 1  | 10   |  -10  |  10 |
    | 2  | 10   |  -30  |  10 |
    | 3  | 10   |  -20  |  10 |
    | 4  | 10   |  80   |  10 |
    | 5  | 10   |  980  |  10 |


Scenario Outline: Changing a selectedQuantity should refelct on cartCount
  Given we use the same index as above
  When I decrease the "selectedQuantity" for <id> by <decr>
  Then the "stockCount" for <id> should be <stock>
  Then the "selectedQuantity" for <id> should be <qty>
  Examples:
    | id | decr | stock | qty |
    | 0  | 1    |  -1    |  0  |
    | 1  | 10   |  0    |  0  |
    | 2  | 10   |  -20  |  0  |
    | 3  | 10   |  -10  |  0  |
    | 4  | 10   |  90   |  0  |
    | 5  | 10   |  990  |  0  |

Scenario Outline: Counts are multi linkable.
  Given some JSON data
    """
    [ 
      { "id": 0, "stock": 0}, 
      { "id": 1, "stock": 0 },
      { "id": 2, "stock": 0 },
      { "id": 3, "stock": 0 },
      { "id": 4, "stock": 0 },
      { "id": 5, "stock": 0 }
    ] 
    """
  When I clear the indexes
  Then The index for "stockCount" should not exist
  Then The index for "cartCount" should not exist
  Then The index for "selectedQuantity" should not exist
  
  When I create indexes for "stockCount" using "stock" 
   And I create an virtual index for "cartCount" with default value 0
   And I create an virtual index for "selectedQuantity" with default value 0
   And I link "stockCount" to "selectedQuantity"
   And I link "stockCount" to "cartCount"
   And I increase the "selectedQuantity" for <id> by <selected>
   And I increase the "cartCount" for <id> by <incart>
   Then the item with id <id> should have a "stockCount" of <stockCount>
    Examples:
      |  id   | selected | incart | stockCount |
      |  0    | 1        |    1   |  -2        |
      |  1    | 1        |    2   |  -3        |
      |  2    | 1        |    3   |  -4        |
      |  3    | 1        |    4   |  -5        |
      |  4    | 1        |    5   |  -6        |
      |  5    | 1        |    6   |  -7        |

Scenario: Indexes can be verbosely logged.
  Given we use the same index as above
  When I ask for an explanation for "stockCount" of 0
  Then I get an explanation for "stockCount" of 0
      
Scenario: Indexes can be reset
  Given we use the same index as above
  When I reset the "selectedQuantity" for id 0
  Then the item with id 0 should have a "selectedQuantity" of 0