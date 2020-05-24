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

  let underline = ''
  for (i = 0; i < file.length; i++) {
    underline += '-'
  }

  console.log(`Building ${file}`)
  console.log(`---------${underline}`)
  clean(prefix)
  create(individuals, prefix)
  connect(individuals, prefix)
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
        id: individual.id,
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
function clean(prefix) {
  execSync(`bash ${binPath}/clean ${prefix}`)
}

// Create an orphan branch for each individual
function create(individuals, prefix) {
  individuals.forEach(individual => {
    console.log(`Adding ${individual.name}`)
    syncExec(`bash ${binPath}/create "${individual.name}" ${individual.id} ${prefix}`)
  })
}

// Connect children to their parents
function connect(individuals, prefix) {
  const individualsWithParents = individuals.filter(individual => individual.parents.length)
  individualsWithParents.forEach(individual => {
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
  })
}
