
import {movable} from '../helpers';
import {doTask, taskBind} from './doTask';

export const runHavester = (so: Parameters<Creep['harvest']>[0], storable: AnyCreep | AnyStoreStructure) => taskBind(
  doTask(
    'harvest',
    movable(c => c.harvest(so), so))(
    c => c.store.getFreeCapacity() > 0 ? OK : ERR_FULL,
  ),

  doTask(
    'transfer',
    movable(c => c.transfer(storable, RESOURCE_ENERGY), storable))(
    c => c.store.getUsedCapacity() > 0 || (storable.store.getFreeCapacity() || 0) > 0 ? OK : ERR_FULL),
);

export const runBuilder = (storable: AnyStoreStructure, cst: Parameters<Creep['build']>[0]) => taskBind(
  doTask(
    'withdraw',
    movable(c => c.withdraw(storable, RESOURCE_ENERGY), storable))(
    c => cst && c.store.getUsedCapacity() < 1 && storable.store.energy >= 200 ? OK : ERR_FULL,
  ),

  doTask(
    'build',
    movable(c => c.build(cst), cst))(
    c => c.store.getUsedCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY,
    _ => cst ? OK : ERR_INVALID_TARGET,
  ),
);