// todo: either drop or extract to a jevko-lib and reuse in formats

export const readTextFileSync = (fileName) => {
  return Deno.readTextFileSync(fileName)
}

export const writeTextFileSync = (fileName, contents) => {
  return Deno.writeTextFileSync(fileName, contents)
}

export const readStdinText = async () => {
  let src = ''
  const decoder = new TextDecoder()
  for await (const chunk of Deno.stdin.readable) {
    src += decoder.decode(chunk)
  }
  return src
}

export const mkdirRecursiveSync = (path) => {
  Deno.mkdirSync(path, {recursive: true})
}