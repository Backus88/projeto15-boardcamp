import { Router } from 'express';
import { insertGame,listGames } from '../controllers/gameController.js';
import validateGame from '../middlewares/validateGame.js';

const gameRouter = Router();

gameRouter.post('/games',validateGame, insertGame);
gameRouter.get('/games',listGames );

export default gameRouter;