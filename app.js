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

individuals.forEach(individual => {
  console.log(individual.name)

  const stdout = execSync(`bash ${binPath}/create "${individual.name}" ${individual.id}`);
  const child = spawnSync(`bash ${binPath}/create "${individual.name}" ${individual.id}`, );
  console.error({'error': child.error});
  // console.log({'stdout ': child.stdout});
  // console.error({'stderr ': child.stderr});
  // console.log('-----------------------------')
})

