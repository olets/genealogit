import {Command, flags} from '@oclif/command'
import {execSync, spawnSync} from 'child_process'
import * as fs from 'fs'
import gedcom from 'gedcom-js'
import {join, parse, resolve} from 'path'
import * as yaml from 'js-yaml'
import cli from 'cli-ux'
import {projectPath} from '../util'

const GENEALOGIT_FALLBACK_NAME = '(name unknown)'

export default class Build extends Command {
  static args = [{name: 'file'}]

  static flags = {
    format: flags.string({
      default: 'gedcom',
    }),
    verbose: flags.boolean({
      char: 'v',
    }),
  }

  static description = 'Build a family tree in Git from a GEDCOM file'

  connectProgress
  binDir
  format
  individuals
  prefix
  progress
  verbose

  async run() {
    const {args, flags} = this.parse(Build)
    this.binDir = join(this.config.root, '/bin')
    this.format = flags.format
    this.verbose = flags.verbose

    if (!['gedcom', 'json', 'yaml'].includes(this.format)) {
      this.log(`The format ${this.format} is not supported`)
      return
    }

    if (args.file) {
      this.build(args.file)
    } else {
      const files = await this.files()

      files.forEach(f => {
        let underline = ''
        for (let i = 0; i < f.length; i++) {
          underline += '-'
        }

        this.log(`Building ${f}`)
        this.log(`---------${underline}`)
        this.build(f)
        this.log()
      })
    }
  }

  async files() {
    let files = []
    let regex

    switch(this.format) {
      case 'gedcom':
        regex = /\.ged$/
        break
      case 'json':
        regex = /\.json$/
        break
      case 'yaml':
        regex = /\.yaml$/
        break
    }

    fs.readdirSync(projectPath()).forEach(child => {
      const isGed = child.match(regex)

      if (isGed) {
        files = [...files, child]
      }
    })

    return files
  }

  build(file) {
    let data
    const filePath = projectPath(file)

    switch(this.format) {
      case 'gedcom':
        data = gedcom.parse(fs.readFileSync(filePath, 'utf8'))
        break
      case 'json':
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        break
      case 'yaml':
        data = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
        break
    }

    this.individuals = data.individuals
    this.prefix = `genealogit/${file}/`

    // GEDCOM uses `parents`, genealogit custom simple format supports `parentIds`
    let individualsWithParents = this.individuals
      .reduce((acc, cur) => {
        if (cur.parents) {
          cur['parentIds'] = cur.parents.filter(p => p.id).map(p => p.id)
        }

        return [
          ...acc,
          cur,
        ]
      }, [])
      .filter(i => i.parentIds ? i.parentIds.length : null)

    cli.action.start('Cleaning')
    this.clean()
    cli.action.stop()

    if (this.verbose) {
      this.individuals.forEach(i => this.create(i))
      individualsWithParents.forEach(i => this.connectToParents(i))
    } else {
      this.progress = cli.progress({
        format: 'Creating individuals... {value}/{total}',
      })
      this.progress.start(this.individuals.length)
      this.individuals.forEach(i => this.create(i))
      this.progress.stop()

      this.progress = cli.progress({
        format: 'Connecting children to their parents... {value}/{total}',
      })
      this.progress.start(individualsWithParents.length)
      individualsWithParents.forEach(i => this.connectToParents(i))
      this.progress.stop()
    }
  }

  individualName(individual) {
    return individual.name || Object.values(individual.names[0]).concat().join(' ') || GENEALOGIT_FALLBACK_NAME
  }

  // Delete all existing genealogit branches
  clean() {
    execSync(`bash ${this.binDir}/clean ${this.prefix}`)
  }

  // Create an orphan branch for each individual
  create(individual) {
    const id = individual.id || null

    if (!id) {
      const name = this.individualName(individual)
      this.log(`Cannot add ${name} because they do not have an id`)
      return
    }

    const commitMessage = yaml.safeDump(individual, {
      sortKeys: true,
    })

    const name = this.individualName(individual)

    if (this.verbose) {
      this.log(`Adding ${name}`)
    }

    execSync(`${this.binDir}/create "${name}" ${id} ${this.prefix} "${commitMessage}"`)
    spawnSync(`${this.binDir}/create "${name}" ${id} ${this.prefix} "${commitMessage}"`)

    if (!this.verbose) {
      this.progress.increment()
    }
  }

  connectToParents(individual) {
    const individualBranch = `${this.prefix}${individual.id}`
    const name = this.individualName(individual)
    const parentBranches = individual.parentIds.map(id => `${this.prefix}${id}`).join(' ')
    const parentNames = individual.parentIds.map(id => {
      const parent = this.individuals.filter(i => i.id === id)[0]
      return this.individualName(parent)
    })

    let log = `Connecting ${name} to parent`
    if (individual.parentIds.length > 1) {
      log += 's'
    }
    log += ` ${parentNames.join(', ')}`

    if (this.verbose) {
      this.log(log)
    }

    execSync(`${this.binDir}/connect ${individualBranch} ${parentBranches}`)
    spawnSync(`${this.binDir}/connect ${individualBranch} ${parentBranches}`)

    if (!this.verbose) {
      this.progress.increment()
    }
  }
}
