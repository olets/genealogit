genealogit
==========

![GitHub release (latest by date)](https://img.shields.io/github/v/release/olets/genealogit)
[![NPM version](https://img.shields.io/npm/v/genealogit.svg)](https://npmjs.org/package/genealogit)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Contributing](#contributing)
* [License](#license)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g genealogit
$ genealogit COMMAND
running command...
$ genealogit (-v|--version|version)
genealogit/1.0.0 darwin-x64 node-v12.16.3
$ genealogit --help [COMMAND]
USAGE
  $ genealogit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`genealogit build [FILE]`](#genealogit-build-file)
* [`genealogit help [COMMAND]`](#genealogit-help-command)
* [`genealogit relationship [FILE] [IND1] [IND2]`](#genealogit-relationship-file-ind1-ind2)
* [`genealogit visualize [FILE] [ELDER] [YOUNGER]`](#genealogit-visualize-file-elder-younger)

## `genealogit build [FILE]`

Build a family tree in Git from a GEDCOM file

```
USAGE
  $ genealogit build [FILE]

OPTIONS
  --format=format  [default: gedcom]
```

_See code: [src/commands/build.ts](https://github.com/olets/genealogit/blob/v1.0.0/src/commands/build.ts)_

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

_See code: [src/commands/relationship.ts](https://github.com/olets/genealogit/blob/v1.0.0/src/commands/relationship.ts)_

## `genealogit visualize [FILE] [ELDER] [YOUNGER]`

Show the Git log graph for the specified file

```
USAGE
  $ genealogit visualize [FILE] [ELDER] [YOUNGER]
```

_See code: [src/commands/visualize.ts](https://github.com/olets/genealogit/blob/v1.0.0/src/commands/visualize.ts)_
<!-- commandsstop -->
# Contributing

Thanks for your interest. Contributions are welcome!

> Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

Check the [Issues](https://github.com/olets/zsh-abbr/issues) to see if your topic has been discussed before or if it is being worked on. You may also want to check the roadmap (see above). Discussing in an Issue before opening a Pull Request means future contributors only have to search in one place.

This project loosely follows the [Angular commit message conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).

# License

This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).
For the full text of the license, see the [LICENSE](LICENSE) file.
