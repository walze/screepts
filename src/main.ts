import {applyTo, map, mapObjIndexed, pipe} from 'ramda';
import {getCreeps, makeCreep, runCreep} from './functions/creep';
import {first, of} from './functions/BiFunctor';
import {ROLES} from './types';

const runner = (r: Room) => pipe(
  map((c: Creep) => of(c)),
  map(applyTo([])),
  map(first(runCreep(r))),
);

export const loop = () => {
  const {creeps, rooms} = Game;

  mapObjIndexed(c => c, creeps);

  mapObjIndexed(r => {
    const rCreeps = r.find(FIND_MY_CREEPS);
    const cps = getCreeps(rCreeps);
    const {HAVESTER = [], BUILDER = []} = cps;

    runner(r)(HAVESTER);
    runner(r)(BUILDER);

    if (HAVESTER?.length < 0) {
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.HAVESTER));
    }

    if (BUILDER?.length < 1) {
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.BUILDER));
    }
  }, rooms);

  console.log('------------------------');
};

module.exports = {loop};
