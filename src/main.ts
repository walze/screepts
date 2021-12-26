
import { forEachValue } from 'helpers';
import { ap } from 'ramda';
import { setMaxCreepPerSource } from './boot/source';
import { runCreep } from './functions/creep';
import { roomCreepSpawner, setRoomCreeps } from './functions/room';

const bootFns = () => {
  forEachValue(setMaxCreepPerSource)(Game.rooms);
};

bootFns();
export const loop = (() => {
  const { creeps: creepsObj, rooms: roomsObj } = Game;
  const creeps = Object.values(creepsObj);
  const rooms = Object.values(roomsObj);

  try {
    console.log(
      creeps.map(runCreep),
      ap([
        roomCreepSpawner,
        setRoomCreeps(creeps),
      ], rooms),
    );
  } catch (error) {
    console.log(error);
  }

  console.log(
    '---------------------------------------',
  );
  console.log();
});

// HARFVESTERS SCALING //
// harvesters start with 7 or 8, max slots around spawner
// after container is build, make more harvesters

// TODO: SUBROLES
