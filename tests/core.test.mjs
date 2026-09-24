import {test} from 'node:test';
import {checks} from '../checks.mjs';
for(const [name,fn] of checks)test(name,fn);
