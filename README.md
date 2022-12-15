# Jevko CLI

[Jevko](https://jevko.org) CLI (Command Line Interface).

One `jevko` command to rule all Jevko formats.

Experimental.

Currently supports [.jevkoml](https://github.com/jevko/jevkoml), [.jevkodata](https://github.com/jevko/jevkodata), [.jevkocfg](https://github.com/jevko/jevkoconfig1.js).

Can convert the Jevko formats into well-known and well-supported formats (e.g. JSON, HTML, XML and XML-based formats, such as SVG).

Can also convert from JSON to .jevkodata. More conversion options are planned.

Jevko formats are generally much more pleasant to read, write, edit, or generate -- by hand or otherwise.

Jevko CLI manages various different Jevko formats with one command.

It can be used to easily integrate Jevko formats into applications that deal with XML or JSON, providing facilities that can make authoring and maintaining HTML documents, XML or JSON configurations, SVG graphics, and countless XML-based formats much more enjoyable.

<!-- In the future, JevkoML could also be used directly by various tools, for increased efficiency. -->

## Installation

These instructions will guide you through installing Deno and then using it to install `jevko` as a command in your system, so that you can invoke it from anywhere.

### Install Deno

Jevko CLI has one dependency: [Deno](https://deno.land/).

Fortunately Deno is very nice and [easy to install](https://deno.land/manual@v1.28.1/getting_started/installation). Deno is distributed as a single binary executable with no external dependencies.

This command will run Deno's official installation script on Linux or macOS:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

This one will do the same on Windows, if PowerShell is available:

```
irm https://deno.land/install.ps1 | iex
```

For more installation options or if you run into any problems, see the official instructions on [deno.land](https://deno.land/manual@v1.28.1/getting_started/installation) and on [denoland GitHub](https://github.com/denoland/deno_install).

### Install Jevko CLI with Deno

If you have [Deno installed](#install-deno) and Deno's installation root's bin directory (something like `/home/USER/.deno/bin`) [added to `PATH`](#tip-get-a-list-of-directories-in-your-path) then you can use the following command to install `jevko` directly from GitHub master branch:

```
deno install --allow-read --allow-write --allow-run https://raw.githubusercontent.com/jevko/jevko-cli/master/jevko.js
```

Note: if you haven't added Deno's installation root to `PATH`, then `jevko` won't be recognized as a command.

To install a specific version of the Jevko CLI, specify it in the URL in place of master:

```
deno install --allow-read --allow-write --allow-run https://raw.githubusercontent.com/jevko/jevko-cli/v0.1.0/jevko.js
```

See the [Jevko CLI GitHub Releases](https://github.com/jevko/jevko-cli/releases) for a list of available versions.

### Alternative: install without editing PATH

If you can't or prefer not to change your `PATH`, you can alternatively install `jevko` to a [directory that is already in the `PATH`](#tip-get-a-list-of-directories-in-your-path), by adding the `--root` option to `deno install`. E.g. if your `PATH` contains `~/.local/bin`, then you can run:

```
deno install --root ~/.local/ --allow-read --allow-write --allow-run https://raw.githubusercontent.com/jevko/jevko-cli/master/jevko.js
```

to install `jevko` under `~/.local/bin`.

### Tip: get a list of directories in your PATH

You can get a list of directories in your `PATH` by running:

```
echo $PATH
```

This should print something like:

```
/home/USER/.local/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin
```

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

Or you can put an `output` option with the output file name at the top of the input file:

<!-- todo: describe options -->

```
[
  output [outputfile.html]
]
```

now if you run:

```
jevko filename.jevkoml
```

it will output to `outputfile.html` instead of standard output.

By default, Jevko CLI infers the Jevko format of the input file by extension. You can also specify the format by putting the `format` option at the top of the input file:

```
[
  format [jevkoml]
]
```

## Directives

### import files as jevkos or text

<!-- todo: describe -->

```
/import [filename]
```

```
/paste [filename]
/paste [path [filename] tag [heredoc tag]]
```