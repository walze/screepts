import {mapObjIndexed} from 'ramda';
import {getCreeps, makeCreep} from './functions/creep';
import {domove} from './functions/domove';
import {ROLES} from './types';

const runc = (r: Room) => (c: Creep) => {
	const ss = r.find(FIND_SOURCES);
	const s = ss[0]!;

	console.log(
		r.lookAt(s.pos.x, s.pos.y + 1),
	);

	return domove(() => c.harvest(s))(s)('HAVESTER')(c);
};

export const loop = () => {
	const {creeps, rooms} = Game;

	mapObjIndexed(c => c, creeps);

	mapObjIndexed(r => {
		const rCreeps = r.find(FIND_MY_CREEPS);
		const {HAVESTER} = getCreeps(rCreeps);

		HAVESTER
			?.map(runc(r));
		// .map(console.log);

		return r
			.find(FIND_MY_SPAWNS)
			.map(makeCreep(ROLES.HAVESTER));
	}, rooms);
};

module.exports = {loop};
