import {jevkoml} from 'https://raw.githubusercontent.com/jevko/jevkoml/v0.3.4/jevkoml.js'
import {jevkocfg} from 'https://raw.githubusercontent.com/jevko/jevkoconfig1.js/v0.1.1/jevkocfg.js'
import {readTextFileSync, readStdinText, writeTextFileSync} from './io.js'
import {jevkodata, map, prep as prepdata, prettyFromJsonStr} from 'https://raw.githubusercontent.com/jevko/jevkodata/v0.2.1/mod.js'

import {parseJevkoWithHeredocs} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@v0.1.8/mod.js'

import { dirname, join, extname } from "https://deno.land/std@0.165.0/path/mod.ts";

export const main = async (argmap) => {
  let {format, input} = argmap
  let dir
  // todo: exactly 1?
  let source
  
  if (input !== undefined) {
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
  
  if (format === 'json') {
    const result = prettyFromJsonStr(source)
    const {output} = argmap
    if (output === undefined) console.log(result)
    else writeTextFileSync(join(dir, output), result)
    return
  }
  
  // todo: don't parse as jevko if format is json/xml, etc. (non-jevko)
  const jevko = parseJevkoWithHeredocs(source)
  
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
    result = jevkodata(preppedJevko, props)
  } else throw Error(`Unrecognized format: ${format}`)
  
  
  const {output} = props
  if (output === undefined) console.log(result)
  else writeTextFileSync(join(dir, output), result)  
}

const withoutShebang = source => {
  if (source.startsWith('#!')) {
    const index = source.indexOf('\n')
    if (index === -1) return ""
    return source.slice(index)
  }
  return source
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