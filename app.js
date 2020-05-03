const { exec } = require('child_process')
const fs = require('fs')

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

console.log(individuals)
