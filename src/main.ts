import {map, mapObjIndexed} from 'ramda';
import {getCreeps, makeCreep, runCreep} from './functions/creep';
import {ROLES} from './types';

export const loop = () => {
  const {creeps, rooms} = Game;

  mapObjIndexed(c => c, creeps);

  mapObjIndexed(r => {
    const rCreeps = r.find(FIND_MY_CREEPS);
    const cps = getCreeps(rCreeps);
    const {HAVESTER = [], BUILDER = []} = cps;

    map(runCreep(r))(HAVESTER);
    map(runCreep(r))(BUILDER);

    if (HAVESTER?.length < 2) {
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.HAVESTER));
    }

    if (BUILDER?.length < 2) {
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.BUILDER));
    }
  }, rooms);

  console.log('------------------------');
};

module.exports = {loop};
