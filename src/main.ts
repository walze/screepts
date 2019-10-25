import { mapObjIndexed as mapObj } from 'ramda'


export const loop = () => {
  const { creeps } = Game

  // console.log(Game.rooms['E25N37'].createConstructionSite(24, 19, STRUCTURE_CONTAINER))

  mapObj(creep => {

    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE && creep.carryCapacity < creep.carry.energy) {
      creep.say('harvest')

      return creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
    }

    if (creep.carryCapacity > creep.carry.energy) return;
      creep.say('transfer')


    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER)
      }
    });

    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.say('transfering')
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }


  }, creeps)
}

module.exports = { loop }