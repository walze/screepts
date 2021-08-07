import { findConstruction, findSource, findStorable } from './find';
import { build, harvest, runTasks, transfer, upgradeController, withdraw } from './tasks';

export const runHarvester = (c: Creep) => {
  const { room, id } = c;

  const source = findSource(id)(room);
  const storable = findStorable(room);

  return runTasks(
    harvest(source),
    transfer(storable),
  )(c);
};

export const runBuilder = (c: Creep) => {
  const { room, id } = c;

  const source = findSource(id)(room);
  const storable = findStorable(room);
  const construction = findConstruction(room);

  return runTasks(
  // Delete construction?
    withdraw(storable, construction),
    harvest(source),
    build(construction),
    transfer(storable),
  )(c);
};

export const runUpgrader = (c: Creep) => {
  const { room, id } = c;

  const source = findSource(id)(room);
  const storable = findStorable(room);
  const construction = findConstruction(room);

  return runTasks(
    withdraw(storable, construction),
    harvest(source),
    upgradeController(room.controller),
    transfer(storable),
  )(c);
};
