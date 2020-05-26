import {Command} from '@oclif/command'
import {execSync, spawnSync} from 'child_process'
import * as fs from 'fs'
import gedcom from 'gedcom-js'
import * as path from 'path'
import * as yaml from 'js-yaml'

const GENEALOGIT_FALLBACK_NAME = '(name unknown)'
const GENEALOGIT_GEDCOM_REGEX = /\.ged$/

export default class Build extends Command {
  static args = [{name: 'file'}]

  static description = 'Build a family tree in Git from a GEDCOM file'

  async run() {
    this.binDir = this.path('/bin')

    const {args} = this.parse(Build)

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
    const individuals = gedcom.parse(fs.readFileSync(file, 'utf8')).individuals
    this.prefix = `genealogit/${path.parse(file).name}/`
    this.clean()
    individuals.forEach(individual => this.create(individual))
    individuals.forEach(individual => this.connectToParents(individual))
  }

  path(rootRelativePath = '') {
    return path.join(this.config.root, rootRelativePath)
  }

  individualName(individual) {
    return Object.values(individual.names[0]).concat().join(' ') || GENEALOGIT_FALLBACK_NAME
  }

  // Delete all existing genealogit branches
  clean() {
    execSync(`bash ${this.binDir}/clean ${this.prefix}`)
  }

  // Create an orphan branch for each individual
  create(individual) {
    if (!individual.id) {
      return
    }

    const commitMessage = yaml.safeDump(individual, {
      sortKeys: true,
    })

    const name = this.individualName(individual)

    this.log(`Adding ${name}`)
    execSync(`${this.binDir}/create "${name}" ${individual.id} ${this.prefix} "${commitMessage}"`)
    spawnSync(`${this.binDir}/create "${name}" ${individual.id} ${this.prefix} "${commitMessage}"`)
  }

  connectToParents(individual) {
    const individualBranch = `${this.prefix}${individual.id}`
    const parents = individual.parents.filter(p => p.id) || null
    const parentBranches = parents.map(p => `${this.prefix}${p.id}`).join(' ')

    if (!parentBranches) {
      return
    }

    let log = `Connecting ${this.individualName(individual)} to parent`
    if (parents.length > 1) {
      log += 's'
    }
    log += ` ${parents.map(p => {
      if (p.fname || p.lname) {
        return [p.fname || null, p.lname || null].join(' ')
      }

      return GENEALOGIT_FALLBACK_NAME
    }).join(', ')}`

    this.log(log)
    execSync(`${this.binDir}/connect ${individualBranch} ${parentBranches}`)
    spawnSync(`${this.binDir}/connect ${individualBranch} ${parentBranches}`)
  }
}
