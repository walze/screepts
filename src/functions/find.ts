import { countCreepsUsingSource, maxCreepsPerSource } from 'boot/source';
import { STORE_STRUCTURES } from 'consts';
import { nth, pipe } from 'ramda';

export const findSource = (creepId: string) => (r: Room) => {
  const sources = r.find(FIND_SOURCES);
  const source = sources.find(s => r.memory.sources[s.id]?.creeps[creepId])
  || sources.find(s => countCreepsUsingSource(s) < maxCreepsPerSource(s));

  return source;
};

export const findStorable = pipe(
  (r: Room) => r.find(FIND_MY_STRUCTURES, {
    filter: s => STORE_STRUCTURES.some(ss => s.structureType === ss),
  }) as AnyStoreStructure[],
  nth(0),
);

export const findConstruction = (r: Room) => r.find(FIND_CONSTRUCTION_SITES);
