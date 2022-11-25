# Jevko CLI

[Jevko](https://jevko.org) CLI (Command Line Interface).

One `jevko` command to rule all Jevko formats.

Experimental.

Currently supports [.jevkoml](https://github.com/jevko/jevkoml), [.jevkocfg](https://github.com/jevko/jevkoconfig1.js), [.jevkodata](https://github.com/jevko/jevkodata).

Can convert the Jevko formats into well-known and well-supported formats (e.g. JSON, HTML, XML and XML-based formats, such as SVG).

Conversion in the other direction is coming soon.

Jevko formats are generally much more pleasant to read, write, edit, or generate -- by hand or otherwise.

Jevko CLI manages various different Jevko formats with one command.

It can be used to easily integrate Jevko formats into applications that deal with XML or JSON, providing facilities that can make authoring and maintaining HTML documents, XML or JSON configurations, SVG graphics, and countless XML-based formats much more enjoyable.

<!-- In the future, JevkoML could also be used directly by various tools, for increased efficiency. -->

## Usage

If Jevko CLI is [installed](#installation-with-deno) you can invoke it as:

```
jevko
```

Without arguments, `jevko` will accept input from standard input until you press CTRL+D.

<!-- todo?: mvp console highlighting? -->

You can also provide a path to a file as an argument:

<!-- get syntax highlighting for vscode -->

```
jevko filename.jevkoml
```

This will convert a file named `filename.jevkoml` into HTML/XML and output the result to standard output.

To output to a file instead of the standard output, you can either use the redirect facility of your shell:

```
jevko filename.jevkoml > outputfile.html
```

Or you can put an `/output` directive with the output file name at the top of the input file:

```
/output [outputfile.html]
```

now if you run:

```
jevko filename.jevkoml
```

it will output to `outputfile.html` instead of standard output.

By default, Jevko CLI infers the Jevko format of the input file by extension. You can also specify the format by putting the `/jevko` directive at the top of the input file:

```
/jevko [jevkoml]
```

## Dependencies

Jevko CLI has one dependency: [Deno](https://deno.land/).

Fortunately Deno is very nice and [easy to install](https://deno.land/manual@v1.28.1/getting_started/installation).

<!-- I recommend installing it, as it makes installing and managing `jevko` easy and efficient. -->

## Installation with Deno

These instructions will guide you through using Deno to install `jevko` as a command in your system, so that you can invoke it from anywhere.

If you have [Deno installed](#dependencies) and Deno's installation root's bin directory (something like `/home/USER/.deno/bin`) [added to `PATH`](#tip-get-a-list-of-directories-in-your-path) then you can use the following command to install `jevko` directly from GitHub master branch:

```
deno install --allow-read --allow-write --allow-run https://raw.githubusercontent.com/jevko/jevko-cli/master/jevko.js
```

Note: if you haven't added Deno's installation root to `PATH`, then `jevko` won't be recognized as a command.

To install a specific version of jevko-cli, specify it in the URL in place of master:

```
deno install --allow-read --allow-write --allow-run https://raw.githubusercontent.com/jevko/jevko-cli/v0.1.0/jevko.js
```

### Alternative: install without editing PATH

If you can't or prefer not to change your `PATH`, you can alternatively install `jevko` to a [directory that is already in the `PATH`](#tip-get-a-list-of-directories-in-your-path), by adding the `--root` option to `deno install`. E.g. if your `PATH` contains `~/.local/bin`, then you can run:

```
deno install --root ~/.local/ --allow-read --allow-write --allow-run https://raw.githubusercontent.com/jevko/jevko-cli/master/jevko.js
```

to install `jevko` under `~/.local/bin`.

## Tip: get a list of directories in your PATH

You can get a list of directories in your `PATH` by running:

```
echo $PATH
```

This should print something like:

```
/home/USER/.local/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin
```

# Features coming soon

* import files as jevkos or text (currently implemented in jevkoml)