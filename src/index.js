const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3333;
const customers = [];

// MIDDLEWARE
function verifyCpfInAccount(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);
  
  if(!customer) {
    return response.status(400).json({ error: "CUSTOMER NOT FOUND" });
  }

  request.customer = customer; // creating new key and value inside request object

  return next();
}

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
// app.use(verifyCpfInAccount);

// OTHER WAY IS THIS:
app.get("/statement/", verifyCpfInAccount, (request, response, next) => {
  const { customer } = request;
  return response.json(customer.statement);
});

app.listen(PORT);
