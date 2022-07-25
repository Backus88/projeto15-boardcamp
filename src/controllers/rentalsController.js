import client from '../database/db.js';
import dayjs from 'dayjs';

export async function insertRent (req, res){
  const { customerId, gameId, daysRented } = req.body;
  try{
    const thereIsCustomer = await client.query('SELECT * FROM customers WHERE id = $1',[customerId]);
    const therIsGame = await client.query('SELECT * FROM games WHERE id = $1',[gameId]);
    const thereIsRent = await client.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);
    const game = therIsGame.rows[0];    
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

    res.status(200).send(newList);
  }catch(error){
    res.status(500).send(error);
  }
}

export async function finishRental (req, res){
  const rentalId = parseInt(req.params.id);
  let lateFee = null;

  try{
    const thereIsId = await client.query('SELECT * FROM rentals WHERE id = $1', [rentalId]);
    if(thereIsId.rowCount ===0){
      res.sendStatus(404);
      return;
    }
    const rentalIsFinished = thereIsId.rows.some(item => item.delayFee === null);
    const rentalInfo = thereIsId.rows[0];
    if(!rentalIsFinished){
      res.sendStatus(400);
      return;
    }
    const rentDate = dayjs(rentalInfo.rentDate).format('YYYY-MM-DD');
    const newDate = dayjs().format('YYYY-MM-DD');
    const daysPassed = Math.round((dayjs(newDate).valueOf() - dayjs(rentDate).valueOf())/86400000);

    if(daysPassed > rentalInfo.daysRented){
      lateFee = daysPassed - rentalInfo.daysRented;
    }
    const rentalObject = {
      customerId: rentalInfo.customerId,
      gameId:rentalInfo.gameId,
      rentDate: dayjs(rentalInfo.rentDate).format('YYYY-MM-DD'),
      daysRented: rentalInfo.daysRented,
      returnDate: dayjs().format('YYYY-MM-DD'),
      originalPrice: rentalInfo.originalPrice,
      delayFee: lateFee
    };

    console.log(rentalObject);

    await client.query(`UPDATE rentals SET 
                          "customerId" = $1, 
                          "gameId" = $2, 
                          "rentDate"= $3, 
                          "daysRented"= $4, 
                          "returnDate"= $5, 
                          "originalPrice"= $6, 
                          "delayFee"= $7 
                          WHERE id = $8`,[rentalObject.customerId, rentalObject.gameId, rentalObject.rentDate, rentalObject.daysRented,rentalObject.returnDate, rentalObject.originalPrice, rentalObject.delayFee, rentalId]);

    res.sendStatus(200);
    
  }catch(error){
    res.status(500).send(error);
  }

}