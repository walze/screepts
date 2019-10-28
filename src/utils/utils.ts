import { find } from "ramda";
import { harvesterCreep } from "../creeps/harvester";
import { findClosestStructure } from "./find";


export enum ACTION_DONE {
  NEXT,
  PREVIOUS,
  START,
}

export type AnyFunction = (...a: any[]) => any
export type creepAction = (creep: Creep) => [boolean, ScreepsReturnCode | string]


export const eitherFunction = <F1 extends AnyFunction, F2 extends AnyFunction>(f1: F1, f2: F2) =>
  (...args: Parameters<F1 | F2>) => {
    const f1result = f1(...args)

    return (f1result !== (false && null) ? f1result : f2(...args)) as ReturnType<F1 | F2>
  }


export const doOrMove =
  (creep: Creep) =>
    (action: ScreepsReturnCode) =>
      (moveTo: RoomPosition | { pos: RoomPosition }) =>
        (name?: string): [boolean, ScreepsReturnCode] => {
          creep.memory.state = name

          if (action === ERR_NOT_IN_RANGE) {
            if (name) creep.say(name)
            const moveCode = creep.moveTo(moveTo, { visualizePathStyle: { stroke: '#ffffff' } });
            return [false, moveCode]
          }


          if (action) creep.say(action.toString())
          // [if_did, code]
          return [true, action]
        }


export const ObjectEntries = <T>(obj: T) => Object.entries(obj) as unknown as Array<[keyof T, T[keyof T]]>

export const findInObjByValue = <T>(
  obj: T,
  value: T[keyof T],
) => find(([, v]) => v === value, ObjectEntries(obj))

export const withdrawFromContainer = (creep: Creep) => {
  const container = findClosestStructure(creep.pos)(STRUCTURE_CONTAINER)
  if (!container) return false

  if (container.store.energy <= 300) return false

  return doOrMove
    (creep)
    (creep.withdraw(container, RESOURCE_ENERGY))
    (container)
    ('getting energy')
}


export const withdrawFromSpawner = (creep: Creep) => {
  const spawn = findClosestStructure(creep.pos)(STRUCTURE_SPAWN)
  if (!spawn) return false

  if (spawn.energy <= 250) return false

  return doOrMove
    (creep)
    (creep.withdraw(spawn, RESOURCE_ENERGY))
    (spawn)
    ('getting energy')
}

export const withdrawEnergy = eitherFunction(withdrawFromContainer, withdrawFromSpawner)

export const ensureCreepHasEnergy = (creep: Creep): [boolean, ScreepsReturnCode?] => {
  const code = withdrawEnergy(creep)
  if (!code) return [code]

  // [if_has_energy, run_code]
  return code
}


const transferEnergySpawner = (creep: Creep) => {
  const spawn = findClosestStructure(creep.pos)(STRUCTURE_SPAWN)
  if (!spawn) return false
}
