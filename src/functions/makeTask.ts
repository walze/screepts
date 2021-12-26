import { applyTo, AtLeastOneFunctionsFlow, gt, pipeWith } from 'ramda';
import { CreepTask, CreepTaskResult, FailTasks, Tasks } from '../types';

export const taskBind = (...fns: CreepTask[]) => pipeWith<[Creep], CreepTaskResult>(
  (f: CreepTask, { code, creep, name }: CreepTaskResult) => code === OK
    ? { code, creep, name }
    : f(creep),
  fns as AtLeastOneFunctionsFlow<[Creep], CreepTaskResult>);

const defaultDontTask = (_: Creep, r: ReturnCode) => r;

export const makeTask
  = (
    name: Tasks,
    task: (c: Creep) => ReturnCode,
    tasknt: (c: Creep, r: ReturnCode) => ReturnCode | void = defaultDontTask,
  ) =>
    (...conditions: ((c: Creep) => ReturnCode)[]) =>
      (creep: Creep): CreepTaskResult => {
        const testConditions = () => conditions
          .map(applyTo(creep))
          .find(gt(0));

        const taskCode = testConditions() || task(creep);
        const code = taskCode === OK ? taskCode : (tasknt(creep, taskCode) || taskCode);

        if (code === OK && (Game.time % 3 === 0))
          creep.say(`${name}`);

        // Side-effects
        creep.memory.task.name = code === OK ? name : `fail_${name}` as FailTasks;
        creep.memory.task.code = code;
        // ${creep.name} task -> ${name} | ${code}

        return { creep, code, name };
      };
