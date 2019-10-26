import { mapObjIndexed as mapObj, map } from 'ramda'
import { spawnCreep, CREEP_TYPES, runCreep } from './creep'
import { harvesterCreep } from './creeps/harvester'
import { findCreepsByType } from './utils'


export const loop = () => {
  const { creeps, rooms } = Game

  for (var name in Memory.creeps) if (!Game.creeps[name]) {
    delete Memory.creeps[name];
    console.log('Clearing non-existing creep memory:', name);
  }



  // console.log(Game.rooms['E25N37'].createConstructionSite(24, 19, STRUCTURE_CONTAINER))
  mapObj(room => {
    const spawns = room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType == STRUCTURE_SPAWN
    }) as StructureSpawn[]

    // console.log(spawnCreep(spawn))

    const builders = findCreepsByType(room)(CREEP_TYPES.BUILDER)
    const harvesters = findCreepsByType(room)(CREEP_TYPES.HARVESTER)

    map(spawn => {
      if (builders.length < 2)
        spawnCreep(spawn)(CREEP_TYPES.BUILDER, builders.length + 1)

      if (harvesters.length < 2)
        spawnCreep(spawn)(CREEP_TYPES.HARVESTER, harvesters.length + 1)
    }, spawns)


  }, rooms)


  mapObj(creep => {
    const type = creep.memory.type as CREEP_TYPES

    const runCode = runCreep[type](creep)

    if (runCode) creep.say(runCode.toString())
  }, creeps)
}

module.exports = { loop }