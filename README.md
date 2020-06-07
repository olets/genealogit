genealogit
==========

![GitHub release (latest by date)](https://img.shields.io/github/v/release/olets/genealogit)
[![NPM version](https://img.shields.io/npm/v/genealogit.svg)](https://npmjs.org/package/genealogit)

<!-- toc -->
* [What's this?](#whats-this)
* [Quickstart](#quickstart)
* [Usage](#usage)
* [Commands](#commands)
* [Acknowledgments](#acknowledgments)
* [Contributing](#contributing)
* [License](#license)
<!-- tocstop -->
# What's this?
genealogit uses Git as a family tree modelling and visualization tool.

`genealogit build <file>` reads data from a file and for each person creates a single-commit branch.

`genealogit visualize <file>` shows the `git log --graph` for the branches (must run `genealogit build <file>` first).

`genealogit relationship <file> <individual 1's id> <individual 2's id>` reports the blood relationship between two individuals (must run `genealogit build <file>` first).

`genealogit clean <file>` deletes the branches created by `genealogit build <file>`.

The **data file** can be ~~a `.ged` GEDCOM (.ged) file,~~ (stayed tuned for GEDCOM support) or JSON or YAML. If making your own `.json` or `.yaml`, you can follow GEDCOM or take advantage of genealogit's support for the non-standard properties `name` and `parentIds`. For example, a simple YAML could look like

```yaml
- individuals
  - id: 1
    name: child
    parentIds:
      - 2
      - 3
  - id: 2
    name: parent_1
  - id: 3
    name: parent_2
```

**Branch names** are

```
genealogit/<file>/<individual id>
```

**Commit messages** are

```
<individual's full name> (<individual's id>)

<individual's full record>
```

The **commit author** for all commits created by genealogit is `genealogit <genealogit@olets.dev>`.

# Quickstart

Install, with one these:

```shell
yarn global add genealogit
npm install -g genealogit
```
~~brew install genealogit~~ (stay tuned for Homebrew support)

Add autocompletion support

```shell
genealogit autocomplete
```

At a minimum, genealogit **requires** that you are in a Git repo with at least one commit. You Git repo can have a lot of other things going on too. The minimum setup is:

```shell
mkdir my-family-tree
cd my-family-tree
git init
git commit --allow-empty -m "empty"
```

Add a family tree file to the directory. If you don't have one, download and play with one or all of the files in `demo/` directory. (Or download others for example at <https://webtreeprint.com/tp_famous_gedcoms.php>). The following supposes a GEDCOM file. If the file is YAML, include `--format=yaml` in the `build`. If the file is YAML, include `--format=yaml` in the `build` command.

```shell
[(npx|yarn)] genealogit build a-family-tree.ged
[(npx|yarn)] genealogit visualize a-family-tree.ged
[(npx|yarn)] genealogit relationship a-family-tree.ged <an id> <another id>
```


&nbsp;

# Usage
<!-- usage -->
```sh-session
$ npm install -g genealogit
$ genealogit COMMAND
running command...
$ genealogit (-v|--version|version)
genealogit/1.2.0 darwin-x64 node-v12.16.3
$ genealogit --help [COMMAND]
USAGE
  $ genealogit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`genealogit autocomplete [SHELL]`](#genealogit-autocomplete-shell)
* [`genealogit build [FILE]`](#genealogit-build-file)
* [`genealogit clean [FILE]`](#genealogit-clean-file)
* [`genealogit help [COMMAND]`](#genealogit-help-command)
* [`genealogit relationship [FILE] [IND1] [IND2]`](#genealogit-relationship-file-ind1-ind2)
* [`genealogit visualize [FILE]`](#genealogit-visualize-file)

## `genealogit autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ genealogit autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ genealogit autocomplete
  $ genealogit autocomplete bash
  $ genealogit autocomplete zsh
  $ genealogit autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.2.0/src/commands/autocomplete/index.ts)_

## `genealogit build [FILE]`

Build a family tree in Git from a GEDCOM file

```
USAGE
  $ genealogit build [FILE]

OPTIONS
  -v, --verbose
  --format=format  [default: gedcom]
```

_See code: [src/commands/build.ts](https://github.com/olets/genealogit/blob/v1.2.0/src/commands/build.ts)_

## `genealogit clean [FILE]`

Delete a tree created by `build`

```
USAGE
  $ genealogit clean [FILE]

OPTIONS
  --format=format  [default: gedcom]
```

_See code: [src/commands/clean.ts](https://github.com/olets/genealogit/blob/v1.2.0/src/commands/clean.ts)_

## `genealogit help [COMMAND]`

display help for genealogit

```
USAGE
  $ genealogit help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src/commands/help.ts)_

## `genealogit relationship [FILE] [IND1] [IND2]`

Show the relationship between two individuals

```
USAGE
  $ genealogit relationship [FILE] [IND1] [IND2]
```

_See code: [src/commands/relationship.ts](https://github.com/olets/genealogit/blob/v1.2.0/src/commands/relationship.ts)_

## `genealogit visualize [FILE]`

Show the Git log graph for the specified file

```
USAGE
  $ genealogit visualize [FILE]
```

_See code: [src/commands/visualize.ts](https://github.com/olets/genealogit/blob/v1.2.0/src/commands/visualize.ts)_
<!-- commandsstop -->

# Acknowledgments

genealogit relies on [gedcom-js](https://github.com/stivaugoin/gedcom-js) to parse GEDCOM. That project is also the source of the `potter.ged` demo file.

You may be interested in the related exploration [GenealogyTreeInGit](https://github.com/KvanTTT/GenealogyTreeInGit), which is written up at <https://habr.com/en/post/465959/>.

# Contributing

Thanks for your interest. Contributions are welcome!

> Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

Check the [Issues](https://github.com/olets/zsh-abbr/issues) to see if your topic has been discussed before or if it is being worked on. Discussing in an Issue before opening a Pull Request means future contributors only have to search in one place.

This project loosely follows the [Angular commit message conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).

# License

This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).
For the full text of the license, see the [LICENSE](LICENSE) file.
