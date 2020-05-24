const { execSync, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const binPath = path.join(__dirname, 'bin')
const gedcomJs = new require('gedcom-js').default
const gedRegex = /\.ged$/
const globalPrefix = 'genealogit/'

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
  const prefix=`${globalPrefix}${path.parse(file).name}/`

  clean(prefix)
  create(individuals, prefix)
  connect(individuals, prefix)
})

function getIndividuals(ged) {
  return ged.individuals.map(individual => {
    const name = Object.values(individual.names[0]).concat().join(' ')
    const parentIds = individual.parents.map(parent => parent.id).filter(id => id)
    return {
      name: name,
      id: individual.id,
      parentIds: [...parentIds]
    }
  })
}

function syncExec(command) {
  const stdout = execSync(command)
  const child = spawnSync(command)
}

// Delete all existing genealogit branches
function clean(prefix) {
  execSync(`bash ${binPath}/clean ${prefix}`)
}

// Create an orphan branch for each individual
function create(individuals, prefix) {
  individuals.forEach(individual => {
    syncExec(`bash ${binPath}/create "${individual.name}" ${individual.id} ${prefix}`)
  })
}

// Connect children to their parents
function connect(individuals, prefix) {
  const individualsWithParents = individuals.filter(individual => individual.parentIds.length)

  individualsWithParents.forEach(individual => {
    individualBranch = `${prefix}${individual.id}`
    parentBranches = individual.parentIds.map(id => `${prefix}${id}`).join(' ')
    syncExec(`bash ${binPath}/connect ${individualBranch} ${parentBranches}`)
  })
}
