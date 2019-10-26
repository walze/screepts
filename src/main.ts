import { mapObjIndexed as mapObj } from 'ramda'
import { doOrMove } from './utils'


export const loop = () => {
  const { creeps } = Game

  // console.log(Game.rooms['E25N37'].createConstructionSite(24, 19, STRUCTURE_CONTAINER))

  mapObj(creep => {
    const creepDoOrMove = doOrMove(creep)

    const [source] = creep.room.find(FIND_SOURCES)

    if (creep.carryCapacity > creep.carry.energy) {
      creepDoOrMove(creep.harvest(source))(source)('harvest')
      return
    }

    const [target] = creep.room.find(FIND_STRUCTURES, {
      filter: structure => (structure.structureType == STRUCTURE_EXTENSION
        || structure.structureType == STRUCTURE_SPAWN
        || structure.structureType == STRUCTURE_TOWER)
        && structure.energy < structure.energyCapacity
    });

    if (target) {
      creepDoOrMove(creep.transfer(target, RESOURCE_ENERGY))(target)('transfering')
    }


  }, creeps)
}

module.exports = { loop }