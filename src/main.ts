import { ap, tryCatch } from 'ramda';
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

  console.log(
    creeps.map(runCreep),
  );

  ap([
    tryCatch(roomCreepSpawner, console.log),
    setRoomCreeps(creeps),
  ], rooms);

  console.log(
    '---------------------------------------',
  );
  console.log();
};

module.exports = {
  loop: tryCatch(loop, (e: Error) => console.log(`${e.stack}\n`, `${e}`)),
};

// Harvest if
// current < total
