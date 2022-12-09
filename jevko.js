import {map, prep as prepdata} from 'https://raw.githubusercontent.com/jevko/jevkodata/v0.2.1/mod.js'

import {parseJevkoWithHeredocs} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@v0.1.8/mod.js'

import {main as main_v0_2} from 'https://raw.githubusercontent.com/jevko/jevko-cli/v0.2.1/main.js'

import {main} from './portable/main.js'

const getArgmap = () => {
  if (Deno.args.length === 0) return Object.create(null)
  const argj = prepdata(parseJevkoWithHeredocs(Deno.args.join(' ')))
  const argmap = map(argj.subjevkos)

  const fileName = argj.suffix.trim()

  if (fileName !== '') {
    if ('input' in argmap) throw Error('oops')
    argmap.input = fileName
  }
  return argmap
}

const argmap = getArgmap()

//?todo: perhaps resolve versions according to semver and indeed use dynamic import with ${ver} -- take the --allow-net hit
// alternatively have a separate jevko-cli front which handles versions
const {version} = argmap
if (version !== undefined) {
  if (version.startsWith('0.2')) {
    // const main = await import('https://raw.githubusercontent.com/jevko/jevko-cli/v0.2.0/main.js')

    main_v0_2(argmap)
  } else throw Error(`Unknown version: ${version}`)
} else {
  main(argmap)
}
