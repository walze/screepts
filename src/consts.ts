declare global {

  type ReturnCode = ScreepsReturnCode
    | typeof ERR_NO_TASK
    | typeof ERR_NEW_BORN
    | typeof ERR_IDLE

  }

export const ERR_NEW_BORN = -998;
export const ERR_IDLE = -997;
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
