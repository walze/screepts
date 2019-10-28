import { mapObjIndexed as mapObj, map } from 'ramda'
import { spawnCreep, CREEP_TYPES, runCreep } from './creep'
import { findInObjByValue } from './utils/utils'
import { findCreepsByType } from './utils/find'


export const loop = () => {
  const { creeps, rooms } = Game

  // fix memory creeps leak

  mapObj((room) => {
    const spawns = room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_SPAWN,
    }) as StructureSpawn[]


    const builders = findCreepsByType(room)(CREEP_TYPES.BUILDER)
    const harvesters = findCreepsByType(room)(CREEP_TYPES.HARVESTER)
    const upgraders = findCreepsByType(room)(CREEP_TYPES.UPGRADER)

    map((spawn) => {
      if (harvesters.length < 2)
        return spawnCreep(spawn)(CREEP_TYPES.HARVESTER)

      if (builders.length < 2)
        return spawnCreep(spawn)(CREEP_TYPES.BUILDER)

      if (upgraders.length < 2) {
        return spawnCreep(spawn)(CREEP_TYPES.UPGRADER)
      }
    }, spawns)


  }, rooms)


  mapObj((creep) => {
    if (creep.ticksToLive && creep.ticksToLive < 2) {
      delete Memory.creeps[creep.name]

      const id = findInObjByValue(Memory.rooms[creep.room.name].busySources, creep.id) as unknown as string
      delete Memory.rooms[creep.room.name].busySources[id]

      creep.suicide()
    }

    const type = creep.memory.type as CREEP_TYPES
    const runCode = runCreep[type](creep)

    if (runCode) creep.say(runCode.toString())
  }, creeps)
}

module.exports = { loop }
