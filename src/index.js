const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3333;
const customers = [];

// MIDDLEWARES
function verifyCpfExistence(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);
  
  if(!customer) {
    return response.status(400).json({ error: "CUSTOMER NOT FOUND" });
  }

  request.customer = customer; // creating new key and value inside request object

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if(operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount
    }
  }, 0);
  
  return balance;
} 
// I know this getBalance function is kind of dumb. I'm just practicing and learning
// http requests

app.use(express.json())

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  
  const customerAlreadyExists = customers.some(
    customer => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ 
      message: "Customer already exists"
    })
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  });

  return response.status(201).send({message: "ACCOUNT CREATED"})
});

// ONE WAY TO USE THE MIDDLEWARE IS THIS, SO EVERY NEXT ROUTE USES WILL USE IT:
// app.use(verifyCpfExistence);

// OTHER WAY IS THIS:
app.get("/statement/", verifyCpfExistence, (request, response, next) => {
  const { customer } = request;
  return response.json(customer.statement);
});

app.post("/deposit", verifyCpfExistence, (request, response, next) => {
  const { description, amount } = request.body;
  const { customer } = request;
  const statementOperation = {
    description,
    amount,
    created_At: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.post("/withdraw", verifyCpfExistence, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({error: "Insufficient funds"});
  };
  
  const statementOperation = {
    amount,
    created_At: new Date(),
    type: "debit"
  };

  customer.statement.push(statementOperation);
  
  return response.status(201).send();
});

app.get("/statement/date", verifyCpfExistence, (request, response, next) => {
  const { customer } = request;
  const {date} = request.query;

  const dateFormat = new Date(date + " 00:00") // NOTE THE SPACE BETWEEN " AND 0

  const statement = customer.statement.filter(statement => {
    statement.created_at.toDateString() === new Date(dateFormat).toDateString()
  })

  return response.json(customer.statement);
});

app.put("/account", (request, response) => {
  const { name } = request.body;
  const { customer } = request;
  
  customer.name = name;
  
  return response.status(201).send();
});

app.get("/account", verifyCpfExistence, (request, response) => {
  const { customer } = request;

  return response.json(customer);
})

app.delete("/account", verifyCpfExistence, (request, response) => {
  const { customer } = request;

  customers.splice(customer, 1);

  return response.status(200).json(customers);
})

app.get("/balance", verifyCpfExistence, (request, response) => {
  const { customer } = request;

  const balance = getBalance(customer.statement);
  
  return response.json(balance);
})

app.listen(PORT);
