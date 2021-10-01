import {NextFunction, Request, Response, Router} from 'express';

import GetPokemon from './api/getPokemon';
import ResponseError from './errors/responseError';
import IEndpoint from './models/iEndpoint';
import ILogger from './models/iLogger';
import PokeApiService from './services/pokeApiService';

export default class Middleware {
  logger: ILogger;
  pokeApiService: PokeApiService;

  constructor(logger: ILogger) {
    this.logger = logger;
    this.pokeApiService = new PokeApiService();
  }

  createRouter(): Router {
    const router = Router();
    const getPokemon = new GetPokemon(this.pokeApiService);

    router.get('/status', (req: Request, res: Response) => {
      res.send('OK');
    });

    router.get('/pokemon/:name', this.execute.bind(this, getPokemon));

    router.use(this.respondError.bind(this));
    router.use(this.respondSuccess.bind(this));

    return router;
  }

  async execute(endpoint: IEndpoint<unknown, unknown>, req: Request, res: Response,
                next: NextFunction): Promise<void> {
    try {
      const response = await endpoint.execute(req.params);
      res.locals.responseBody = response;
      next();
    } catch (error) {
      next(error);
    }
  }

  respondError(err: ResponseError, req: Request, res: Response, next: NextFunction): void {
    this.logger.log({
			body: req.body,
			error: err,
			path: req.path,
			type: 'respondError',
    });
    res.status(err.statusCode).send(err.message);
  }

  respondSuccess(req: Request, res: Response, next: NextFunction): void {
    this.logger.log({
			body: req.body,
			path: req.path,
			result: res.locals.responseBody,
			type: 'respondSuccess',
    });
    res.json(res.locals.responseBody);
  }
}
