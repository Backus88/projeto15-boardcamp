import client from '../database/db.js';

export async function getCategories(req, res){
  try{
    const {rows : categories} = await client.query('SELECT * FROM categories');
    res.send(categories).status(200);
  }catch(error){
    res.send(error).status(404);
  }
}

export async function insertCategories(req, res){
  const {name} = req.body;

  console.log(name);
  if(name?.length ===0|| !name){
    res.sendStatus(400);
    return;
  }
  try{
    const nameExist = await client.query('SELECT * FROM categories WHERE name = $1', [name]);
    console.log(nameExist);
    if(nameExist.rowCount){
      res.sendStatus(409);
      return;
    }
    await client.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    res.sendStatus(201);
  }catch(error){
    res.send(error).status(404);
  }

}