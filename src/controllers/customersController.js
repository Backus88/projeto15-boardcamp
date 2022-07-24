import client from '../database/db.js';


export async function insertCustomer(req,res){
  const {name, phone, cpf, birthday} = req.body;

  try{
    const thereIsCpf = await client.query('SELECT  FROM customers WHERE cpf = $1',[ cpf ]);
    if(thereIsCpf.rowCount >0){
      res.sendStatus(409);
      return;
    }
    await client.query('INSERT INTO customers (name, phone, cpf ,birthday) VALUES($1, $2, $3, $4)',[ name,phone, cpf, birthday ]);
    res.sendStatus(201);
  }catch(error){
    res.status(500).send(error);
  }
}


export async function updateCustomer(req, res){
  const {name, phone, cpf, birthday} = req.body;
  const customerId = parseInt(req.params.id);
  try{
    const thereIsCpf = await client.query('SELECT * FROM customers WHERE cpf = $1',[ cpf ]);
    const actualCpf = thereIsCpf.rows.some((item)=> item.cpf === cpf);
    if(thereIsCpf.rowCount >0 && !actualCpf){
      res.sendStatus(409);
      return;
    }
    await client.query('UPDATE customers SET "name" = $1, "phone"= $2, "cpf"= $3, "birthday"= $4 WHERE id = $5',[ name, phone, cpf, birthday, customerId ]);
    res.sendStatus(200);
  }catch(error){
    res.status(500).send(error);
  }
}

export async function listCustomers(req, res){
  const clientCpf = req.query.cpf;

  try{
    const {rows : clients} = await client.query('SELECT * FROM customers');
    if(clientCpf?.length > 0){
      const filterCpf = clients.filter((item)=> item.cpf.startsWith(clientCpf));
      res.status(200).send(filterCpf);
      return;
    }
    res.status(200).send(clients);
  }catch(error){
    res.status(500).send(error);
  }
}

export async function listCustomersById(req,res){
  const customerId = parseInt(req.params.id);
  try{
    if(customerId){
      const {rows: clients} = await client.query('SELECT * FROM customers WHERE id = $1', [ customerId ]);
      if(clients?.length > 0){
        res.status(200).send(clients);
        return;
      }
    } 
    res.sendStatus(404);

  }catch(error){
    res.status(500).send(error);
  }
}