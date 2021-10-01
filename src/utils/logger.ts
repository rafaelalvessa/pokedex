import ILogger from '../models/iLogger';

export default class Logger implements ILogger {
  log(data: unknown): void {
    console.log(data);
  }
}
