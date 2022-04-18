const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3333;
const customers = [];

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

  return response.status(201).send()
});

app.listen(PORT);
