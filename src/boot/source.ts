import { countHarvestable } from '../helpers';

export const setMaxCreep2Source = () => {
  // Refactor this
  for (const key in Game.rooms) if (Object.prototype.hasOwnProperty.call(Game.rooms, key)) {
    const room = Game.rooms[key] as Room;
    const sources = room?.find(FIND_SOURCES);

    room.memory.sources = {};
    sources.map(s => (
      room.memory.sources[s.id] = {
        creeps: {},
        total: countHarvestable(s),
      }
    ));
  }
};
