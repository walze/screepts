
import { ERR_NO_TASK, ReturnCode } from '../consts';
import { movable } from '../helpers';
import { CreepTask, Tasks } from '../types';
import { makeTask } from './makeTask';

export const _runTasks: (ts: CreepTask[]) => (c: Creep) => ReturnCode
  = ts => c => {
    const { memory: { task: { id } } } = c;

    const ct = ts[id];
    if (!ct) return ERR_NO_TASK;

    const { code } = ct(c);

    if (code === OK) return code;

    return runTasks(ts)(c);
  };

export const runTasks: (ts: CreepTask[]) => (c: Creep) => ReturnCode
  = ts => c => {
    const [ct] = ts;
    if (!ct) return ERR_NO_TASK;

    const { memory: { task: { id } } } = c;
    const { code } = ct(c);

    if (code === OK) return code;

    return runTasks(
      ts.filter((_, _id) => _id !== id),
    )(c);
  };

export const harvest = (so: Parameters<Creep['harvest']>[0]) => makeTask(
  'harvest',
  movable(c => c.harvest(so), so))(
  c => c.store.getFreeCapacity() > 0 ? OK : ERR_FULL,
);

export const transfer = (storable: AnyCreep | AnyStoreStructure) => makeTask(
  'transfer',
  movable(c => c.transfer(storable, RESOURCE_ENERGY), storable))(
  c => c.store.getUsedCapacity() > 0 || (storable.store.getFreeCapacity() || 0) > 0 ? OK : ERR_FULL,
);

export const withdraw = (storable: AnyStoreStructure, cst: Parameters<Creep['build']>[0]) =>
  makeTask(
    'withdraw',
    movable(c => c.withdraw(storable, RESOURCE_ENERGY), storable))(
    c => cst && c.store.getUsedCapacity() < 1 && storable.store.energy >= 200 ? OK : ERR_FULL,
  );

export const build = (cst: Parameters<Creep['build']>[0]) =>
  makeTask(
    'build',
    movable(c => c.build(cst), cst))(
    c => c.store.getFreeCapacity() < 1 ? OK : ERR_NOT_ENOUGH_ENERGY,
    _ => cst ? OK : ERR_INVALID_TARGET,
  );

export const tasks: { [key in Tasks]?: (...any: any[]) => CreepTask }
      = {
        harvest,
        transfer,
        withdraw,
        build,
      };
