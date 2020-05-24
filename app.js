const { execSync, spawnSync } = require('child_process')
const fs = require('fs')
const gedcomJs = new require('gedcom-js').default
const path = require('path')
const yaml = require('js-yaml')

const BIN_PATH = path.join(__dirname, 'bin')
const GEDCOM_REGEX = /\.ged$/
const PREFIX = 'genealogit/'

class Genealogit {
  constructor() {
    this.files.forEach(file => {
      this.data = gedcomJs.parse(fs.readFileSync(file, "utf8"))
      this.prefix=`${PREFIX}${path.parse(file).name}/`

      const individuals = this.individuals
      let underline = ''
      for (let i = 0; i < file.length; i++) {
        underline += '-'
      }

      console.log(`Building ${file}`)
      console.log(`---------${underline}`)
      this.clean()
      individuals.forEach(individual => this.create(individual))
      individuals.forEach(individual => this.connectToParents(individual))
      console.log()
    })
  }

  get files() {
    let gedFiles = []

    fs.readdirSync(__dirname).forEach(child => {
      const isGed = child.match(GEDCOM_REGEX)

      if (isGed) {
        gedFiles = [...gedFiles, child]
      }
    })

    return gedFiles
  }

  get individuals() {
    return this.data.individuals
      .filter(individual => individual.id && individual.names)
      .map(individual => {
        const parents = individual.parents
          .filter(parent => parent.id)
          .map(parent => {
            return {
              id: parent.id,
              name: `${parent.fname} ${parent.lname}`
            }
          })

        return {
          ...individual,
          name: Object.values(individual.names[0]).concat().join(' '),
          parents: parents,
        }
      })
  }

  syncExec(command) {
    const stdout = execSync(command)
    const child = spawnSync(command)
  }

  // Delete all existing genealogit branches
  clean() {
    execSync(`bash ${BIN_PATH}/clean ${this.prefix}`)
  }

  // Create an orphan branch for each individual
  create(individual) {
    if (!individual.name || !individual.id) {
      return
    }

    const commitMessage = yaml.safeDump(individual, {
      sortKeys: true,
    })

    console.log(`Adding ${individual.name}`)
    this.syncExec(`bash ${BIN_PATH}/create "${individual.name}" ${individual.id} ${this.prefix} "${commitMessage}"`)
  }

  connectToParents(individual) {
    if (!individual.parents.length) {
      return
    }

    const individualBranch = `${this.prefix}${individual.id}`
    const parents = individual.parents
    const parentBranches = parents.map(p => `${this.prefix}${p.id}`).join(' ')

    let log = `Connecting ${individual.name} to parent`
    if (parents.length > 1) {
      log += 's'
    }
    log += ` ${parents.map(p => p.name).join(', ')}`

    console.log(log)
    this.syncExec(`bash ${BIN_PATH}/connect ${individualBranch} ${parentBranches}`)
  }
}

new Genealogit()
