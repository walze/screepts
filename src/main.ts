import {map, mapObjIndexed} from 'ramda';
import {getCreeps, makeCreep, run} from './functions/creep';
import {ROLES} from './types';

export const loop = () => {
	const {creeps, rooms} = Game;

	mapObjIndexed(c => c, creeps);

	mapObjIndexed(r => {
		const rCreeps = r.find(FIND_MY_CREEPS);
		const {HAVESTER = [], BUILDER = []} = getCreeps(rCreeps);

		map(run(r), HAVESTER);
		map(run(r), BUILDER);

		console.log(BUILDER);

		if (HAVESTER?.length < 0) {
			r.find(FIND_MY_SPAWNS)
				.map(makeCreep(ROLES.HAVESTER));
		}

		if (BUILDER?.length < 2) {
			r.find(FIND_MY_SPAWNS)
				.map(makeCreep(ROLES.BUILDER));
		}
	}, rooms);
};

module.exports = {loop};
