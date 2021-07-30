import { applyTo, gt, pipeWith, PipeWithFns } from 'ramda';
import { ReturnCode } from '../consts';
import { CreepTask, CreepTaskResult, Tasks } from '../types';

export const taskBind = (...fns: CreepTask[]) => pipeWith(
  (f: CreepTask, { code, creep, name }: CreepTaskResult) => code === OK
    ? { code, creep, name }
    : f(creep),
)(fns as PipeWithFns<CreepTaskResult, CreepTaskResult>);

const defaultDontTask = (_: Creep, r: ReturnCode) => r;

export const makeTask
  = <T extends Tasks>(
    name: T,
    task: (c: Creep) => ReturnCode,
    tasknt: (c: Creep, r: ReturnCode) => ReturnCode | void = defaultDontTask,
  ) =>
      (...conditions: Array<(c: Creep) => ReturnCode>) =>
        (creep: Creep): CreepTaskResult => {
          const testConditions = () => conditions
            .map(applyTo(creep))
            .find(gt(0));

          const doCode = testConditions() || task(creep);
          const code = doCode === OK ? doCode : (tasknt(creep, doCode) || doCode);

          if (code === OK)
            creep.say(`${name}`);

          // Side-effects
          creep.memory.task.name = name;
          creep.memory.task.code = code;
          // Console.log(`${creep.name} task -> ${name} | ${code}`);

          return { creep, code, name };
        };

