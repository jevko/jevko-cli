import { dirname, join, extname, isAbsolute, relative, basename } from "https://deno.land/std@0.165.0/path/mod.ts";

const targetPath = '/home/daro/git/github/@jevko/jevko-vscode/src/node/'

// create dirs if not exist
Deno.mkdirSync(targetPath + 'portable', { recursive: true });
Deno.mkdirSync(targetPath + 'nonportable', { recursive: true });

const watcher = Deno.watchFs(["./node"]);

for await (const event of watcher) {
  console.log(">>>> event", event);
  // { kind: "create", paths: [ "/foo.txt" ] }
  if (event.kind === 'modify') for (const path of event.paths) {
    const rel = relative('./node', path)

    Deno.copyFileSync(path, targetPath + rel);
  } 
}