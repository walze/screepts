import { chain, keys, map, mapObjIndexed, pipe, tap } from 'ramda';
import { CreepsByRole, getCreeps, makeCreep, runCreep } from './functions/creep';
import { ROLES } from './types';

const runRoom = (r: Room) => (obj: CreepsByRole) => pipe(
  () => keys(ROLES),
  // Hard coded spawn
  tap(map(makeCreep(r.find(FIND_MY_SPAWNS)[0]!))),
  chain(role => obj[role]),
  map(runCreep(r)),
);

export const loop = () => {
  const { creeps, rooms } = Game;

  mapObjIndexed(c => c, creeps);

  mapObjIndexed(r => pipe(
    () => r.find(FIND_MY_CREEPS),
    getCreeps,
    runRoom(r),
  ), rooms);

  console.log('------------------------');
};

module.exports = { loop };
