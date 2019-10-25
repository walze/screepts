import { mapObjIndexed as mapObj } from 'ramda'

export const loop = () => {
  const { creeps } = Game
  console.log(1331)

  mapObj(creep => {

    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
    }

  }, creeps)
}

module.exports = { loop }