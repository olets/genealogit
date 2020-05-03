const { execSync } = require('child_process');
const { spawnSync} = require('child_process');
const fs = require('fs')
const path = require('path')

const prefix = 'genealogit/'

const binPath = path.join(__dirname, 'bin')
const gedcomJs = new require('gedcom-js').default
const input = fs.readFileSync("demo.ged", "utf8")
const parsedInput = gedcomJs.parse(input)

const individuals = parsedInput.individuals.map(individual => {
  const name = Object.values(individual.names[0]).concat().join(' ')
  const parentIds = individual.parents.map(parent => parent.id).filter(id => id)
  return {
    name: name,
    id: individual.id,
    parentIds: [...parentIds]
  }
})

// Delete all existing genealogit branches
execSync(`bash ${binPath}/clean ${prefix}`)

syncExec = command => {
  const stdout = execSync(command)
  const child = spawnSync(command,)
  // console.error({'error': child.error})
  // console.log({'stdout ': child.stdout})
  // console.error({'stderr ': child.stderr})
}

// Create an orphan branch for each individual
individuals.forEach(individual => {
  syncExec(`bash ${binPath}/create "${individual.name}" ${individual.id}`)
})

// Connect children to their parents
individuals.filter(individual => individual.parentIds.length)
  .forEach(individual => {
    individualBranch = `${prefix}${individual.id}`
    parentBranches = individual.parentIds.map(id => `${prefix}${id}`).join(' ')
    syncExec(`bash ${binPath}/connect ${individualBranch} ${parentBranches}`)
})
