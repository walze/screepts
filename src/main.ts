import { mapObjIndexed } from 'ramda'

const { creeps } = Game

module.exports.loop = () => {

  mapObjIndexed(x => console.log(x, 1), creeps)
}
