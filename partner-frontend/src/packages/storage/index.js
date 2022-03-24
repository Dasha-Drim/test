import { setStorage } from './storage';
import tokenAdapter from './adapters/token';
import roleAdapter from './adapters/role';

setStorage(localStorage);

export { tokenAdapter, roleAdapter }