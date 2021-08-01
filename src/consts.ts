export type ReturnCode = ScreepsReturnCode
  | typeof ERR_NO_TASK

export const ERR_NO_TASK = -999;

export const STORE_STRUCTURES: AnyStoreStructure['structureType'][]
 = [
   'container',
   'storage',
   'extension',
   'powerSpawn',
   'factory',
   'lab',
   'link',
   'nuker',
   'tower',
   'terminal',
   'spawn',
 ];
