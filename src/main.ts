import { ap, identity, tryCatch } from 'ramda';
import { setMaxCreepPerSource } from './boot/source';
import { runCreep } from './functions/creep';
import { roomCreepSpawner, setRoomCreeps } from './functions/room';

Memory.bootFns = () => {
  setMaxCreepPerSource();
};

Memory.bootFns();

export const loop = () => {
  const { creeps: creepsObj, rooms: roomsObj } = Game;
  const creeps = Object.values(creepsObj);
  const rooms = Object.values(roomsObj);

  creeps.map(runCreep);

  ap([
    tryCatch(roomCreepSpawner, identity),
    setRoomCreeps(creeps),
  ], rooms);

  console.log(
    '---------------------------------------',
  );
};

module.exports = {
  loop: tryCatch(loop, (e: Error) => console.log(`${e.stack}\n`, `${e}`)),
};

// Harvest if
// current < total
