import { mapObjIndexed, find, either } from "ramda";
import { harvesterCreep } from "./creeps/harvester";

export type creepAction = (creep: Creep) => ScreepsReturnCode | undefined

export const doOrMove =
  (creep: Creep) =>
    (action: ScreepsReturnCode) =>
      (moveTo: RoomPosition | { pos: RoomPosition }) =>
        (name?: string) => {
          creep.memory.state = name

          if (action == ERR_NOT_IN_RANGE) {
            name && creep.say(name)
            return creep.moveTo(moveTo, { visualizePathStyle: { stroke: '#ffffff' } });
          }


          action && creep.say(action.toString())
          return action
        }


export const findCreepsByType = (room: Room) => (type: string) => room
  .find(
    FIND_MY_CREEPS,
    { filter: creep => creep.memory.type === type }
  )

export const ObjectEntries = <T>(obj: T) => Object.entries(obj) as unknown as [keyof T, T[keyof T]][]

export const findInObjByValue = <T>(
  obj: T,
  value: T[keyof T]
) => find(([, v]) => v === value, ObjectEntries(obj))


export const findClosestContainer = (pos: RoomPosition) => pos.findClosestByRange(
  FIND_STRUCTURES,
  { filter: (CS) => CS.structureType === STRUCTURE_CONTAINER },
) as StructureContainer | null


export const findClosestSpawn = (pos: RoomPosition) => pos.findClosestByRange(
  FIND_STRUCTURES,
  { filter: (struct) => struct.structureType === STRUCTURE_SPAWN },
) as StructureSpawn | null


export const findClosestStructure = <T extends StructureConstant>(pos: RoomPosition, structure: T) =>
  pos.findClosestByRange(
    FIND_STRUCTURES,
    { filter: (struct) => struct.structureType === structure },
  )

const a: Structures<STRUCTURE_CONTAINER>


export const withdrawFromContainer = (creep: Creep) => {
  const creepDoOrMove = doOrMove(creep)

  const a = findClosestStructure(creep.pos, STRUCTURE_SPAWN)


  const container = findClosestContainer(creep.pos)
  if (!container) return 'no container'

  if (container.store.energy < 50) return harvesterCreep(creep)

  if (creep.carry.energy < 1) {
    return creepDoOrMove(creep.withdraw(container, RESOURCE_ENERGY))(container)('getting energy')
  }
}


export const withdrawFromSpawner = (creep: Creep) => {
  const creepDoOrMove = doOrMove(creep)

  const spawn = findClosestSpawn(creep.pos)
  if (!spawn) return 'no spawn'

  if (spawn.energy < 50) return harvesterCreep(creep)

  if (creep.carry.energy < 1) {
    return creepDoOrMove(creep.withdraw(spawn, RESOURCE_ENERGY))(spawn)('getting energy')
  }
}


export const ensureCreepHasEnergy = (creep: Creep) => {
  const run = () => {

    return withdrawFromContainer(creep)
  }

  const code = run()

  // [if_has_energy, run_code]
  return [code === undefined, code] as [boolean, ScreepsReturnCode]
}