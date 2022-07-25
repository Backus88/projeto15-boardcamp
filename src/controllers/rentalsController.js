import client from '../database/db.js';
import dayjs from 'dayjs';

export async function insertRent (req, res){
  const { customerId, gameId, daysRented } = req.body;
  try{
    const thereIsCustomer = await client.query('SELECT * FROM customers WHERE id = $1',[customerId]);
    const therIsGame = await client.query('SELECT * FROM games WHERE id = $1',[gameId]);
    const thereIsRent = await client.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);
    const game = therIsGame.rows[0];    
    console.log(therIsGame.rowCount);
    console.log(thereIsCustomer.rowCount);
    console.log(thereIsRent.rowCount);
    console.log(game);
    console.log(game?.stockTotal);
    if(therIsGame.rowCount<1 || thereIsCustomer.rowCount<1 || daysRented ===0 || thereIsRent.rowCount >= game?.stockTotal){
      res.sendStatus(400);
      return;
    }
    const originalPrice = daysRented*game?.pricePerDay;
    const rentalObject = {
      customerId: customerId,
      gameId: gameId,
      rentDate: dayjs().format('YYYY-MM-DD'),
      daysRented: daysRented,
      returnDate: null,
      originalPrice: originalPrice,
      delayFee: null
    };
    console.log(rentalObject);
    await client.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [rentalObject.customerId, rentalObject.gameId, rentalObject.rentDate, rentalObject.daysRented, rentalObject.returnDate, rentalObject.originalPrice, rentalObject.delayFee ]);

    res.sendStatus(201);
  }catch(error){
    res.status(500).send(error);
  }
}

export async function listRentals (req, res){
  const newList = [];
  const newCustomerId = parseInt(req.query.customerId);
  const newGameId = parseInt(req.query.gameId);

  try{
    const {rows: rentals} = await client.query(`
    SELECT json_build_object(
      'id', rental.id,
      'customerId', "customerId",
      'gameId', "gameId",
      'rentDate', "rentDate",
      'daysRented', "daysRented",
      'returnDate', "returnDate",
      'OriginalPrice', "originalPrice",
      'delayFee', "delayFee",
      'customer', json_build_object(
          'id', customer.id,
          'name', customer.name
          ),

      'game', json_build_object(
          'id', game.id,
          'name', game.name,
          'categoryId', game."categoryId",
          'categoryName', category.name
          )
    ) 
    FROM rentals rental
    JOIN games game on game.id = "gameId"
    JOIN customers customer on customer.id = "customerId"
    JOIN categories category on category.id = game."categoryId"
    `);
    
    for( const v of rentals ){
      newList.push(v.json_build_object);
    }
    if (newCustomerId){
      res.status(200).send(newList.filter((item)=> item.customerId === newCustomerId ));
      return;
    }

    if (newGameId){
      res.status(200).send(newList.filter((item)=> item.gameId === newGameId ));
      return;
    }

    console.log(newList);
    res.status(200).send(newList);
  }catch(error){
    res.status(500).send(error);
  }
}