import { setStorage } from './storage';
import tokenAdapter from './adapters/token';

setStorage(localStorage);

export { tokenAdapter }