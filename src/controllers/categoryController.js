import client from '../database/db.js';

export async function getCategorys(req, res){
  try{
    const {rows : categories} = await client.query('SELECT * FROM categories');
    res.send(categories).status(200);
  }catch(error){
    res.send(error).status(403);
  }
}