import { ReturnCode } from './consts';

export enum ROLES {
  BUILDER = 'BUILDER',
  HAVESTER = 'HAVESTER',
  UPGRADER = 'UPGRADER',
}

export type ROLE = keyof typeof ROLES

export type CreepTaskResult = {creep: Creep, code: ReturnCode, name: Tasks}
export type CreepTask = (c: Creep) => CreepTaskResult

export type Tasks = KeysOfType<Creep, (...args: any) => any> | ''

export type KeysOfType<C, T> = {
  [K in keyof C]: C[K] extends T ? K : never
}[keyof C]

export type NonEmptyArray<T> = [T, ...T[]];
declare global {

  interface CreepMemory {
    role: ROLE
    task: {
      name: Tasks
      repeating: boolean
      id: number
      code: number
    }
  }

  interface FlagMemory { }
  interface PowerCreepMemory { }
  interface RoomMemory { }

  interface SpawnMemory { }
}

export type Structures = {
  [STRUCTURE_CONTAINER]: StructureContainer
  [STRUCTURE_CONTROLLER]: StructureController
  [STRUCTURE_EXTENSION]: StructureExtension
  [STRUCTURE_EXTRACTOR]: StructureExtractor
  [STRUCTURE_KEEPER_LAIR]: StructureKeeperLair
  [STRUCTURE_LAB]: StructureLab
  [STRUCTURE_LINK]: StructureLink
  [STRUCTURE_NUKER]: StructureNuker
  [STRUCTURE_OBSERVER]: StructureObserver
  [STRUCTURE_PORTAL]: StructurePortal
  [STRUCTURE_POWER_BANK]: StructurePowerBank
  [STRUCTURE_POWER_SPAWN]: StructurePowerSpawn
  [STRUCTURE_RAMPART]: StructureRampart
  [STRUCTURE_WALL]: StructureWall
  [STRUCTURE_TOWER]: StructureTower
  [STRUCTURE_TERMINAL]: StructureTerminal
  [STRUCTURE_STORAGE]: StructureStorage
  [STRUCTURE_SPAWN]: StructureSpawn
  [STRUCTURE_ROAD]: StructureRoad
}
