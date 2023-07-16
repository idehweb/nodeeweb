import { createLogger } from '@nodeeweb/core';
import { Logger } from '@nodeeweb/core/src/handlers/log.handler';

const logger: Logger = createLogger('shop', 'Shop', 5);
export default logger;
