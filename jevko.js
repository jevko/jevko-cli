import {jevkoml} from 'https://raw.githubusercontent.com/jevko/jevkoml/v0.3.4/jevkoml.js'
import {jevkocfg} from 'https://raw.githubusercontent.com/jevko/jevkoconfig1.js/v0.1.1/jevkocfg.js'
import {jevkodata} from 'https://raw.githubusercontent.com/jevko/jevkodata/v0.1.0/jevkodata.js'

import {parseJevkoWithHeredocs} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@v0.1.8/mod.js'

import {readTextFileSync, readStdinText, writeTextFileSync} from './io.js'

import { dirname, join, extname, isAbsolute } from "https://deno.land/std@0.165.0/path/mod.ts";

// todo: import from library
import { map, prep as prepdata } from './jevkodatatemp.js'

// todo: exactly 1?
let source
let dir
let format

const getArgmap = () => {
  const argj = prepdata(parseJevkoWithHeredocs(Deno.args.join(' ')))
  const argmap = map(argj.subjevkos)

  const fileName = argj.suffix.trim()

  if (fileName !== '') {
    if ('input' in argmap) throw Error('oops')
    argmap.input = fileName
  }
  return argmap
}

const withoutShebang = source => {
  if (source.startsWith('#!')) {
    const index = source.indexOf('\n')
    if (index === -1) return ""
    return source.slice(index)
  }
  return source
}


// console.log(map(argj.subjevkos), argj, Deno.args, `|${argj.suffix.trim()}|`)

let argmap
if (Deno.args.length > 0) {
  argmap = getArgmap()
} else {
  argmap = Object.create(null)
}

if ('format' in argmap) {
  format = argmap.format
}

if ('input' in argmap) {
  const fileName = argmap.input
  source = withoutShebang(readTextFileSync(fileName))
  dir = dirname(fileName)
  // format from args overrides extension
  // alternatively could error if extension doesn't match
  if (format === undefined) format = extname(fileName).slice(1)
} else {
  source = await readStdinText()
  dir = '.'
}

const jevko = parseJevkoWithHeredocs(source)

const string = jevko => {
  const {subjevkos, suffix} = jevko

  if (subjevkos.length > 0) throw Error("oops")

  return suffix
}

const listOfString = jevko => {
  const {subjevkos, suffix} = jevko

  if (subjevkos.length === 0) return [suffix]

  const ret = []
  for (const {prefix, jevko} of subjevkos) {
    if (prefix !== '') throw Error('oops')
    ret.push(string(jevko))
  }
  return ret
}

const prep = jevko => {
  const {subjevkos, ...rest} = jevko

  let subs
  let props = Object.create(null)
  if (subjevkos.length > 0) {
    let i = 0
    const sub0 = subjevkos[0]
    const pref = sub0.prefix

    if (pref.trim() === '') {
      // interpret top-level directives
      const tjevko = sub0.jevko
      const xyz = prepdata(tjevko)
      props = map(xyz.subjevkos)

      ++i
    }

    subs = subjevkos.slice(i)
  } else {
    subs = []
  }

  return {
    jevko: {subjevkos: subs, ...rest},
    props,
  }
}

const {jevko: preppedJevko, props} = prep(jevko)

if (format === undefined) {
  format = props.format
} else {
  const f = props.format
  if (f !== undefined && format !== f) throw Error(`declared format (${format}) inconsistent with command line format or file extension (${f})`)
}

let result
if (format === 'jevkoml') {
  // todo: impl jevkoml which takes in a jevko as first arg
  const document = await jevkoml(preppedJevko, dir)
  result = document
} else if (format === 'jevkocfg') {
  result = jevkocfg(preppedJevko)
} else if (format === 'jevkodata') {
  result = jevkodata(preppedJevko)
} else throw Error(`Unrecognized format: ${format}`)


const {output} = props
if (output === undefined) console.log(result)
else writeTextFileSync(join(dir, output), result)