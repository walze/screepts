
export type creepAction = (creep: Creep) => ScreepsReturnCode | undefined

export const doOrMove =
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


export const findCreepsByType = (room: Room) => (type: string) => room
  .find(
    FIND_MY_CREEPS,
    { filter: creep => creep.memory.type === type }
  )