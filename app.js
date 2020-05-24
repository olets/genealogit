const { execSync, spawnSync } = require('child_process')
const fs = require('fs')
const gedcomJs = new require('gedcom-js').default
const path = require('path')
const yaml = require('js-yaml')

const binPath = path.join(__dirname, 'bin')
const gedRegex = /\.ged$/
const globalPrefix = 'genealogit/'
let prefix = ''

function files() {
  let gedFiles = []

  fs.readdirSync(__dirname).forEach(child => {
    const isGed = child.match(gedRegex)

    if (isGed) {
      gedFiles = [...gedFiles, child]
    }
  })

  return gedFiles
}

files().forEach(file => {
  const fileContents = fs.readFileSync(file, "utf8")
  const ged = gedcomJs.parse(fileContents)
  const individuals = getIndividuals(ged)
  prefix=`${globalPrefix}${path.parse(file).name}/`

  let underline = ''
  for (i = 0; i < file.length; i++) {
    underline += '-'
  }

  console.log(`Building ${file}`)
  console.log(`---------${underline}`)
  clean()
  individuals.forEach(individual => create(individual))
  individuals.forEach(individual => connectToParents(individual))
  console.log()
})

function getIndividuals(ged) {
  return ged.individuals
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

function syncExec(command) {
  const stdout = execSync(command)
  const child = spawnSync(command)
}

// Delete all existing genealogit branches
function clean() {
  execSync(`bash ${binPath}/clean ${prefix}`)
}

// Create an orphan branch for each individual
function create(individual) {
  if (!individual.name || !individual.id) {
    return
  }

  const commitMessage = yaml.safeDump(individual, {
    sortKeys: true,
  })

  console.log(`Adding ${individual.name}`)
  syncExec(`bash ${binPath}/create "${individual.name}" ${individual.id} ${prefix} "${commitMessage}"`)
}

function connectToParents(individual) {
  if (!individual.parents.length) {
    return
  }

  const individualBranch = `${prefix}${individual.id}`
  const parents = individual.parents
  const parentBranches = parents.map(p => `${prefix}${p.id}`).join(' ')

  let log = `Connecting ${individual.name} to parent`
  if (parents.length > 1) {
    log += 's'
  }
  log += ` ${parents.map(p => p.name).join(', ')}`

  console.log(log)
  syncExec(`bash ${binPath}/connect ${individualBranch} ${parentBranches}`)
}
