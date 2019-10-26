import { mapObjIndexed as mapObj, map } from 'ramda'
import { spawnCreep, CREEP_TYPES, runCreep } from './creep'
import { findCreepsByType, findInObjByValue } from './utils'


export const loop = () => {
  const { creeps, rooms } = Game

  // fix memory creeps leak

  mapObj(room => {
    const spawns = room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType == STRUCTURE_SPAWN
    }) as StructureSpawn[]


    const builders = findCreepsByType(room)(CREEP_TYPES.BUILDER)
    const harvesters = findCreepsByType(room)(CREEP_TYPES.HARVESTER)
    const upgraders = findCreepsByType(room)(CREEP_TYPES.UPGRADER)

    map(spawn => {
      if (builders.length < 2)
        spawnCreep(spawn)(CREEP_TYPES.BUILDER, builders.length + 1)

      if (harvesters.length < 2)
        spawnCreep(spawn)(CREEP_TYPES.HARVESTER, harvesters.length + 1)

      if (upgraders.length < 5)
        spawnCreep(spawn)(CREEP_TYPES.UPGRADER, upgraders.length + 1)
    }, spawns)


  }, rooms)


  mapObj(creep => {
    creep.memory.id = creep.id

    const type = creep.memory.type as CREEP_TYPES

    const runCode = runCreep[type](creep)

    if (runCode) creep.say(runCode.toString())
  }, creeps)
}

module.exports = { loop }