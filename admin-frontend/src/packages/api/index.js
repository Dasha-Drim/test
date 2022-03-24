import * as authorization from './rest/authorization';
import * as players from './rest/players';
import * as promocodes from './rest/promocodes';
import * as franchisee from './rest/franchisee';
import * as stats from './rest/stats';
import * as filials from './rest/filials';
import * as managers from './rest/managers';
import * as operators from './rest/operators';
import * as payments from './rest/payments';

import { setToken } from './config';

export default {
	authorization,
	players,
	promocodes,
	franchisee,
	stats,
	filials,
	managers,
	operators,
	payments,
}

export { setToken }