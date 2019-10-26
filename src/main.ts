import { mapObjIndexed as mapObj } from 'ramda'


const doOrMove =
  (creep: Creep) =>
    (action: ScreepsReturnCode) =>
      (moveTo: RoomPosition | { pos: RoomPosition }) =>
        (name?: string) => {
          if (action == ERR_NOT_IN_RANGE) {
            name && creep.say(name)
            return creep.moveTo(moveTo, { visualizePathStyle: { stroke: '#ffffff' } });
          }

          creep.say(action.toString())
          return action
        }

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