import { ROLE } from "../.."


export const domove =
    (doFn: () => ScreepsReturnCode) =>
        (move: RoomPosition | { pos: RoomPosition }) =>
            (role: ROLE) =>
                (creep: Creep) => {
                    creep.memory.role = role

                    const doCode = doFn()
                    const done = doCode === OK
                    const returnCode = done
                        ? doCode
                        : creep.moveTo(
                            move,
                            { visualizePathStyle: { stroke: '#ffffff' } }
                        )

                    creep.say(`${role} ${doCode}`)

                    return [done, returnCode]
                }