import {Command, flags} from '@oclif/command'
import {execSync, spawnSync} from 'child_process'
import * as fs from 'fs'
import gedcom from 'gedcom-js'
import {join, parse, resolve} from 'path'
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

  binDir
  format
  individuals
  prefix

  async run() {
    const {args, flags} = this.parse(Build)
    this.binDir = join(this.config.root, '/bin')
    this.format = flags.format

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

    fs.readdirSync(this.projectPath()).forEach(child => {
      const isGed = child.match(GENEALOGIT_GEDCOM_REGEX)

      if (isGed) {
        files = [...files, child]
      }
    })

    return files
  }

  projectPath(path: string = '') {
    // INIT_CWD is available if package is installed. PWD fallback for during development
    const root = process.env.INIT_CWD || process.env.PWD

    return resolve(root, path)
  }

  build(file) {
    let data
    const filePath = this.projectPath(file)

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

    this.clean()
    this.individuals.forEach(i => this.create(i))
    this.individuals.forEach(i => this.connectToParents(i))
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
