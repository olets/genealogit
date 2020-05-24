const { execSync, spawnSync } = require('child_process')
const fs = require('fs')
const gedcomJs = new require('gedcom-js').default
const path = require('path')
const yaml = require('js-yaml')

const GENEALOGIT_BIN_PATH = path.join(__dirname, 'bin')
const GENEALOGIT_FALLBACK_NAME = '(name unknown)'
const GENEALOGIT_GEDCOM_REGEX = /\.ged$/

class Genealogit {
  constructor() {
    this.files.forEach(file => {
      this.prefix=`genealogit/${path.parse(file).name}/`

      const individuals = gedcomJs.parse(fs.readFileSync(file, "utf8")).individuals

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
    let files = []

    fs.readdirSync(__dirname).forEach(child => {
      const isGed = child.match(GENEALOGIT_GEDCOM_REGEX)

      if (isGed) {
        files = [...files, child]
      }
    })

    return files
  }

  individualName(individual) {
    return Object.values(individual.names[0]).concat().join(' ') || GENEALOGIT_FALLBACK_NAME
  }

  syncExec(command) {
    const stdout = execSync(command)
    const child = spawnSync(command)
  }

  // Delete all existing genealogit branches
  clean() {
    execSync(`bash ${GENEALOGIT_BIN_PATH}/clean ${this.prefix}`)
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

    console.log(`Adding ${name}`)
    this.syncExec(`bash ${GENEALOGIT_BIN_PATH}/create "${name}" ${individual.id} ${this.prefix} "${commitMessage}"`)
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
      } else {
        return GENEALOGIT_FALLBACK_NAME
      }
    }).join(', ')}`

    console.log(log)
    this.syncExec(`bash ${GENEALOGIT_BIN_PATH}/connect ${individualBranch} ${parentBranches}`)
  }
}

new Genealogit()
