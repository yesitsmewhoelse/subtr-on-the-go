## Subtraction on the go

## Problem Statement

Make a Node.js service/server which exposes these APIs:

```
  • Subtraction API:
    o Inputs:
      ▪ Number of questions
      ▪ Number of digits in minuend (first number in subtraction) and number of
        digits in subtrahend (second number in subtraction)
      ▪ A Boolean flag which tells each question should have some borrowing or not
  o Output:
      ▪ List of questions, with each question containing:
        • Minuend
        • Subtrahend
        • Correct Answer
        • List of 4 possible options

Example:
  • Input:
    o Number of questions: 1
    o Number of digits in minuend (4) and number of digits in subtrahend (3)
    o A Boolean flag, true
  • Output:
    o Question 1:
      ▪ Minuend: 7568
      ▪ Subtrahend: 896
      ▪ Correct Answer: 6672
      ▪ Options: [6987, 6672, 7672, 9947]

```


## API Methods

## To call the service

### `GET  https://subtr.herokuapp.com/?borrowing=%&questions=%&minuend_digits=%&subtrahend_digits=%`

This method takes the number of questions, borrowing flag, minuend_digits and subtrahend_digits as query parameter and the appropriate outputs.

**query parameters**|**type**|**description**
-----|-----|-----
borrowing|boolean|Flag to enable or disable borrowing
questions|Number|Number of questions to be given
minuend_digits|Number|Number of digits in the minuend
subtrahend_digits|Number|Number of digits in the subtrahend

**returns**|**description**
-----|-----
[]|Array containg minuend, subtrahend, options and correct answers.

Sample Request:
```
        /?borrowing=true&questions=1&minuend_digits=4&subtrahend_digits=3

```

## Health check

### `GET  https://subtr.herokuapp.com/health`

This method is used to check if the service is reachable or not.

**returns**|**description**
-----|-----
*|Service Healthy.


## Run test case

```
        npm run test
```