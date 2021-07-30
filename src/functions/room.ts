import { keys, map, pipe, tap } from 'ramda';
import { getCreeps, makeCreep } from './creep';
import { assertThrow, iff } from '../helpers';
import { ROLE, ROLES } from '../types';

const amountCreeps = {
  [ROLES.HAVESTER]: 3,
  [ROLES.BUILDER]: 2,
  [ROLES.UPGRADER]: 1,
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
= (room: Room) =>
  pipe(
    () => keys(ROLES),
    tap(map(iff(
      role => (room.memory[role] || 0) < amountCreeps[role],
      makeCreep(assertThrow(findSpawn(room))),
    ))),
  )();

export const a = (r: Room) => pipe(
  () => r.find(FIND_SOURCES),
  map(s => s),
);
