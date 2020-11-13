import { mapObjIndexed as mapObj, map } from 'ramda'
import { CREEP_TYPES, runCreep, spawnHarvester, spawnBuilder } from './creep'
import { findInObjByValue } from './utils/utils'
import { findCreepsByType } from './utils/find'

export const loop = () => {
  const { creeps, rooms } = Game

  // fix memory creeps leak

  mapObj((room) => {
    const spawns = room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_SPAWN,
    }) as StructureSpawn[]


    const findCreep = findCreepsByType(room)
    const builders = findCreep(CREEP_TYPES.BUILDER)
    const harvesters = findCreep(CREEP_TYPES.HARVESTER)
    const upgraders = findCreep(CREEP_TYPES.UPGRADER)

    map((spawn) => {
      if (harvesters.length < 2)
        return spawnHarvester(spawn)

      if (builders.length < 2)
        return spawnBuilder(spawn)

      // if (upgraders.length < 2) {
      //   return spawnUpgrader(spawn)
      // }
    }, spawns)


  }, rooms)


  mapObj((creep) => {
    if (creep.ticksToLive && creep.ticksToLive < 2) {
      delete Memory.creeps[creep.name]

      const id = findInObjByValue(
        Memory.rooms[creep.room.name].busySources, 
        creep.id
      ) as unknown as string
      delete Memory.rooms[creep.room.name].busySources[id]

      creep.suicide()
    }

    runCreep(creep)
  }, creeps)
}

module.exports = { loop }
