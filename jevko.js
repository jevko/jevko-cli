import {jevkoml} from 'https://raw.githubusercontent.com/jevko/jevkoml/v0.3.3/jevkoml.js'
import {jevkocfg} from 'https://raw.githubusercontent.com/jevko/jevkoconfig1.js/v0.1.1/jevkocfg.js'

import {parseJevkoWithHeredocs} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@v0.1.8/mod.js'

import {readTextFileSync, readStdinText, writeTextFileSync} from './io.js'

import { dirname, join, extname } from "https://deno.land/std@0.165.0/path/mod.ts";

// todo: exactly 1?
let source
let dir
let format
if (Deno.args.length > 0) {
  const fileName = Deno.args[0]
  source = readTextFileSync(fileName)
  dir = dirname(fileName)
  format = extname(fileName).slice(1)
} else {
  source = await readStdinText()
  dir = '.'
  // todo: read format from /jevko directive
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

//?todo: rename /output to /to file
const prep = jevko => {
  const {subjevkos, ...rest} = jevko

  let output, format
  const subs = []
  for (const sub of subjevkos) {
    const {prefix, jevko} = sub

    const trimmed = prefix.trim()

    // top-level directives
    //?todo: perhaps stop reading when trimmed.startsWith('/') === false (i.e., they must all appear at the very top to be valid; otoh should allow hashbang, so perhaps sth like breakPrefix should be utilized)
    if (trimmed.startsWith('/')) {
      const directive = trimmed.slice(1).trim()
      // todo: maybe support import & paste here as well
      // paste: how to be consistent accross formats?
      if (directive === 'jevko') {
        // enforce only one occurence of the directive
        if (format !== undefined) throw Error('oops')
        format = string(jevko)
        continue
      } else if (directive === 'output') {
        // enforce only one occurence of the directive
        if (output !== undefined) throw Error('oops')
        output = string(jevko)
        continue
      }
      // else throw Error(`unknown directive: ${tag}`)
    }

    subs.push(sub)
  }

  return {
    jevko: {subjevkos: subs, ...rest},
    output,
    format,
  }
}

const {jevko: preppedJevko, output, format: f} = prep(jevko)

if (format === undefined) {
  format = f
} else {
  if (f !== undefined && format !== f) throw Error(`extension and declared format inconsistent`)
}

let result
if (format === 'jevkoml') {
  // todo: impl jevkoml which takes in a jevko as first arg
  const document = await jevkoml(preppedJevko, dir)
  result = document
} else if (format === 'jevkocfg') {
  result = jevkocfg(preppedJevko)
} else if (format === 'jevkodata') {
  throw Error("TODO: implement jevkodata -- jevkoconfig1.js reduced")
} else throw Error(`Unrecognized format: ${format}`)

if (output === undefined) console.log(result)
else writeTextFileSync(join(dir, output), result)