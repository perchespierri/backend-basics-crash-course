# BACKEND COURSE
## FinApi
We will build a finantial services API.

## DISCLAIMER:
This was made for study purposes only. Therefore, it may not follow every good practice there is. For instance, there are comments in parts of the code. Those are for me to remember a few steps or concepts, and would never make it to development or production were this a real project.

## Requisites:
- It should be possible to create an account
- It should be possible to fetch the customer's bank statement
- It must be possible to make a deposit
- It must be possible to make a withdrawal
- It must be possible to search for the customer's bank statement by date
- It should be possible to update customer account data
- It must be possible to get customer account data
- It must be possible to delete an account

## Business rules:
- It should not be possible to register an account with an existing CPF
- It should not be possible to deposit to a non-existing account
- It should not be possible to search for a statement on a non-existing account
- It should not be possible to withdraw cash from a non-existing account
- It should not be possible to delete a non-existing account
- It should not be possible to withdraw when the balance is insufficient
