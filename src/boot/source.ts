import { assoc, dissoc, forEachObjIndexed } from 'ramda';
import { countHarvestable, countObjectEntries } from '../helpers';

export const setMaxCreepPerSource = (room: Room) => {
  if (room.memory.sources) return console.log('WARNING: trying overriding max CPS starter');

  const sources = room.find(FIND_SOURCES);
  const cps = sources.map(countHarvestable);

  room.memory.sources = sources.reduce((ss, s, i) => ({
    ...ss,
    [s.id]: {
      creeps: {},
      total: cps[i]!,
    },
  }), {});
};

export const addCreep2Source
  = (s: Harvestable) => (c: Creep) =>
    c.room.memory.sources[s.id]!.creeps = assoc(c.id, c, c.room.memory.sources[s.id]?.creeps);

export const removeCreep2Source
    = (c: Creep) => {
      forEachObjIndexed(source =>
        dissoc(c.id, source.creeps), c.room.memory.sources);
    };

export const countCreepsUsingSource
  = (s: Harvestable) => countObjectEntries(s.room?.memory.sources[s.id]?.creeps);

export const maxCreepsPerSource
  = (s: Harvestable) => s.room?.memory.sources[s.id]?.total!;

