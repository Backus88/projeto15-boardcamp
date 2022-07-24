import client from '../database/db.js';

export async function insertGame (req, res){
  const { name, image, stockTotal, categoryId, pricePerDay }= req.body;

  try{
    const thereIsId = await client.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    if(thereIsId.rowCount > 0){
      const thereIsName = await client.query('SELECT * FROM games WHERE name = $1', [name]);
      if(thereIsName.rowCount >0) {
        res.sendStatus(409);
        return;
      }
      await client.query('INSERT INTO "games" (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
      res.sendStatus(201);
    }else{
      res.sendStatus(400);
    }
  }catch(error){
    res.status(500).send(error);
  }
}

export async function listGames(req, res){
  const nameGame = req.query.name;

  try{
    const { rows: games } = await client.query('SELECT games.id, games.name, games.image,games."stockTotal", games."categoryId", games."pricePerDay", categories.name as categoryName FROM categories RIGHT JOIN  games ON categories.id = games."categoryId"');
    if(nameGame?.length> 0){
      const filterGames = games.filter((item)=> item.name.toLowerCase().startsWith(nameGame.toLowerCase()));
      res.status(200).send(filterGames);
      return;
    }
    res.status(200).send(games);
  }catch(error){
    res.status(500).send(error);
  }

}