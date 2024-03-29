import { find, keys, map, pipe } from 'ramda';
import { getCreeps, makeCreep } from './creep';
import { assertThrow } from '../helpers';
import { ROLE, ROLES } from '../types';

const amountCreeps: (r: Room) => { [key in ROLES]: number }
  = _ => ({
    // Sum of all max creeps per source of all sources!
    [ROLES.HAVESTER]: 2,

    // One/2 per source?
    [ROLES.BUILDER]: 0,

    // Start with one and go up exponentially?
    [ROLES.UPGRADER]: 0,

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
    () => undefined,
  )(cs);

export const roomCreepSpawner
= (room: Room) => pipe(
  find((role: ROLE) => (room.memory[role] || 0) < amountCreeps(room)[role]),
  assertThrow('no role to spawn'),
  r => pipe(
    findSpawn,
    assertThrow('no spawn available'),
    makeCreep(r),
  )(room),
)(keys(ROLES));
