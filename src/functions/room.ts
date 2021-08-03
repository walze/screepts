import { find, keys, map, pipe } from 'ramda';
import { getCreeps, makeCreep } from './creep';
import { assertThrow } from '../helpers';
import { ROLE, ROLES } from '../types';

const amountCreeps: { [key in ROLES]: number }
  = {
    [ROLES.HAVESTER]: 6,
    [ROLES.BUILDER]: 4,
    [ROLES.UPGRADER]: 1,
    [ROLES.HEALER]: 0,
    [ROLES.FIGHTER]: 0,
  };

export const findSpawn = (room: Room) =>
  room.find(FIND_MY_SPAWNS, { filter: { spawning: null } })[0];

export const setRoomCreeps
= (cs: Creep[]) =>
  (room: Room) => pipe(
    getCreeps,
    Object.entries,
    map(([s, css]) => {
      room.memory[s as ROLE] = css.length;
    }),
    () => {},
  )(cs);

export const roomCreepSpawner
= (room: Room) => pipe(
  () => keys(ROLES),
  find(role => (room.memory[role] || 0) < amountCreeps[role]),
  assertThrow,
  makeCreep(assertThrow(findSpawn(room))),
)();
