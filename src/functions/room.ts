// eslint-disable-next-line no-redeclare
import { find, keys, map, pipe } from 'ramda';
import { getCreeps, makeCreep } from './creep';
import { assertThrow } from '../helpers';
import { ROLE, ROLES } from '../types';

const amountCreeps: (r: Room) => { [key in ROLES]: number }
  = _ => ({
    // Sum of all max creeps per source of all sources!
    [ROLES.HAVESTER]: 7,

    // One/2 per source?
    [ROLES.BUILDER]: 4,

    // Start with one and go up exponentially?
    [ROLES.UPGRADER]: 1,

    // One or two per squad
    [ROLES.HEALER]: 0,

    // 2 per squad?
    [ROLES.FIGHTER]: 0,

    // 1 per squad?
    [ROLES.RANGER]: 0,
  });

export const findSpawn = (room: Room) =>
  room.find(FIND_MY_SPAWNS, { filter: { spawning: null } })[0];

export const setRoomCreeps
= (cs: Creep[]) =>
  (room: Room) => pipe(
    getCreeps,
    Object.entries,
    map(([s, _cs]) => {
      room.memory[s as ROLE] = _cs.length;
    }),
    () => {},
  )(cs);

export const roomCreepSpawner
= (room: Room) => pipe(
  () => keys(ROLES),
  find(role => (room.memory[role] || 0) < amountCreeps(room)[role]),
  assertThrow(),
  makeCreep(assertThrow('no spawn')(findSpawn(room))),
)();
