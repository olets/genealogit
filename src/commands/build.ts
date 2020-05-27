import {Command, flags} from '@oclif/command'
import {execSync, spawnSync} from 'child_process'
import * as fs from 'fs'
import gedcom from 'gedcom-js'
import * as path from 'path'
import * as yaml from 'js-yaml'

const GENEALOGIT_FALLBACK_NAME = '(name unknown)'
const GENEALOGIT_GEDCOM_REGEX = /\.ged$/

export default class Build extends Command {
  static args = [{name: 'file'}]

  static flags = {
    format: flags.string({
      default: 'gedcom',
    }),
  }

  static description = 'Build a family tree in Git from a GEDCOM file'

  async run() {
    this.binDir = this.path('/bin')

    const {args, flags} = this.parse(Build)

    this.format = flags.format
    this.individuals
    this.prefix

    if (args.file) {
      this.build(this.path(args.file))
    } else {
      this.files.forEach(file => {
        let underline = ''
        for (let i = 0; i < file.length; i++) {
          underline += '-'
        }

        this.log(`Building ${file}`)
        this.log(`---------${underline}`)
        this.build(file)
        this.log()
      })
    }
  }

  get files() {
    let files = []

    fs.readdirSync(this.path()).forEach(child => {
      const isGed = child.match(GENEALOGIT_GEDCOM_REGEX)

      if (isGed) {
        files = [...files, child]
      }
    })

    return files
  }

  build(file) {
    let data

    if (this.format === 'gedcom') {
      data = gedcom.parse(fs.readFileSync(file, 'utf8'))
    } else if (this.format === 'json') {
      data = JSON.parse(fs.readFileSync(file, 'utf8'))
    } else if (this.format === 'yaml') {
      data = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
    }

    this.individuals = data.individuals
    this.prefix = `genealogit/${path.parse(file).name}/`

    this.clean()
    this.individuals.forEach(individual => this.create(individual))
    this.individuals.forEach(individual => this.connectToParents(individual))
  }

  path(rootRelativePath = '') {
    return path.join(this.config.root, rootRelativePath)
  }

  individualName(individual) {
    // console.log(individual)
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

    this.log(`Adding ${name}`)
    execSync(`${this.binDir}/create "${name}" ${id} ${this.prefix} "${commitMessage}"`)
    spawnSync(`${this.binDir}/create "${name}" ${id} ${this.prefix} "${commitMessage}"`)
  }

  connectToParents(individual) {
    const parents = individual.parents ? individual.parents.filter(p => p.id) : null

    if (!parents) {
      return
    }

    const individualBranch = `${this.prefix}${individual.id}`
    const name = this.individualName(individual)
    const parentBranches = parents.map(p => `${this.prefix}${p.id}`).join(' ')
    const parentNames = parents.map(p => {
      const parent = this.individuals.filter(i => i.id === p.id)[0]
      return this.individualName(parent)
    })

    let log = `Connecting ${name} to parent`
    if (parents.length > 1) {
      log += 's'
    }
    log += ` ${parentNames.join(', ')}`

    this.log(log)
    execSync(`${this.binDir}/connect ${individualBranch} ${parentBranches}`)
    spawnSync(`${this.binDir}/connect ${individualBranch} ${parentBranches}`)
  }
}
