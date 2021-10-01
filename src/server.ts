import express, {Express} from 'express';

import Middleware from './middleware';
import ILogger from './models/iLogger';
import Logger from './utils/logger';

export default class Server {
  logger: ILogger;
	server: Express;

	constructor() {
    this.logger = new Logger();
		this.server = express();

		this.server.use(express.json());

		const middleware = new Middleware(this.logger);
		const router = middleware.createRouter();
		this.server.use(router);
	}

	listen(port: number): void {
		this.server.listen(port, () => {
			this.logger.log(`Server listening on ${port}`);
		});
	}
}
