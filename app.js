const { exec } = require('child_process')

const { execSync } = require('child_process');
const { spawnSync} = require('child_process');
const fs = require('fs')
var path = require('path')

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

execSync(`bash ${binPath}/clean`)

syncExec = command => {
  const stdout = execSync(command)
  const child = spawnSync(command,)
  // console.error({'error': child.error})
  // console.log({'stdout ': child.stdout})
  // console.error({'stderr ': child.stderr})
}

individuals.forEach(individual => {
  syncExec(`bash ${binPath}/create "${individual.name}" ${individual.id}`)
})

