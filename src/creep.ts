import { harvesterCreep } from "./creeps/harvester"
import { builderCreep } from "./creeps/builder"
import { creepAction, ACTION_DONE } from "./utils/utils"
import { upgraderCreep } from "./creeps/upgrader"

export enum CREEP_ACTIONS {
  HARVESTING,
  BUILDING,
  FLEEING,
  UPGRADING,
}

export enum CREEP_TYPES {
  HARVESTER,
  BUILDER,
  UPGRADER,
}

export const runCreep = (creep: Creep) => {
  const { actions, actionIndex } = creep.memory
  const [action, whenDone] = actions[actionIndex]

  const [succ, actionCode] = action(creep)

  if (actionCode === 0) {
    if (!whenDone) return creep.memory.actionIndex = 0
    if (whenDone === ACTION_DONE.START) return creep.memory.actionIndex = 0
    if (whenDone === ACTION_DONE.PREVIOUS) return creep.memory.actionIndex--
    if (whenDone === ACTION_DONE.NEXT) return creep.memory.actionIndex++
  }

  if (!succ) creep.say(actionCode.toString())
}


export const spawnCreep = (spawn: StructureSpawn) =>
  (type: CREEP_TYPES, body: BodyPartConstant[] = [WORK, CARRY, MOVE, MOVE]) =>
    (actions: CreepMemory['actions']) => {
      const name = `${CREEP_TYPES[type]}_${Date.now()}`

      const code = spawn.spawnCreep(
        body,
        name,
        { memory: { type, actions, actionIndex: 0 } },
      )

      return code
    }


export const spawnHarvester = (spawn: StructureSpawn) =>
  spawnCreep
    (spawn)
    (CREEP_TYPES.HARVESTER)
    ([
      [harvesterCreep],
    ])


export const spawnBuilder = (spawn: StructureSpawn) =>
  spawnCreep
    (spawn)
    (CREEP_TYPES.BUILDER)
    ([
      [builderCreep, ACTION_DONE.START],
      [harvesterCreep],
    ])


export const spawnUpgrader = (spawn: StructureSpawn) =>
  spawnCreep
    (spawn)
    (CREEP_TYPES.UPGRADER)
    ([
      [upgraderCreep, ACTION_DONE.START],
      [harvesterCreep],
    ])

