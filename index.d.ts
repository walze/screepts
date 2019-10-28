interface CreepMemory {
}
interface FlagMemory { }
interface PowerCreepMemory { }
interface RoomMemory {
  busySources: { [key: string]: string }
}
interface SpawnMemory { }

type Filter<T extends AnyStructure, K> = T['structureType'] extends K ? T : never;

type Structures<T> = {
  [key in StructureConstant]: Filter<AnyStructure, key>
}