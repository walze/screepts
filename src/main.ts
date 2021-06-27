import {map, mapObjIndexed} from 'ramda';
import {getCreeps, makeCreep, run} from './functions/creep';
import {ROLES} from './types';

export const loop = () => {
	const {creeps, rooms} = Game;

	mapObjIndexed(c => c, creeps);

	mapObjIndexed(r => {
		const rCreeps = r.find(FIND_MY_CREEPS);
		const {HAVESTER = []} = getCreeps(rCreeps);

		map(run(r), HAVESTER);

		return HAVESTER?.length < 1 && r
			.find(FIND_MY_SPAWNS)
			.map(makeCreep(ROLES.HAVESTER));
	}, rooms);
};

module.exports = {loop};
