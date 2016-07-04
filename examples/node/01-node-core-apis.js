/* @flow */
const a = parseInt("100", "10")
setTimeout(() => {}, "100")

const date = new Date()
const str = date + "string"

const watman = Array(16).join(1) + 'Batman!'

import fs from 'fs'
const filename = 1
fs.readFileSync(filename)

import { resolve4 } from 'dns'
resolve4('139.130.4.5', (err, resolved) => {
  console.log(resolved[0])
})
