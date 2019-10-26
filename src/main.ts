import { mapObjIndexed as mapObj } from 'ramda'


const doOrMove = (creep: Creep) =>
  (action: ScreepsReturnCode) =>
    (moveTo: RoomPosition | { pos: RoomPosition }) =>
      (name?: string) => {
        if (action == ERR_NOT_IN_RANGE) {
          name && creep.say(name)
          return creep.moveTo(moveTo, { visualizePathStyle: { stroke: '#ffffff' } });
        }

        creep.say(action.toString())
      }

export const loop = () => {
  const { creeps } = Game

  // console.log(Game.rooms['E25N37'].createConstructionSite(24, 19, STRUCTURE_CONTAINER))

  mapObj(creep => {
    const creepDoOrMove = doOrMove(creep)

    const sources = creep.room.find(FIND_SOURCES)
    console.log(creep.carryCapacity <= creep.carry.energy, creep.carryCapacity, creep.carry.energy)

    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE && creep.carryCapacity > creep.carry.energy) {
      creep.say('harvest')

      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
      return
    }

    const [target] = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER)
      }
    });

    if (target) {
      creepDoOrMove(creep.transfer(target, RESOURCE_ENERGY))(target)('transfering')
    }


  }, creeps)
}

module.exports = { loop }