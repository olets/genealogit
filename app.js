const fs = require('fs')

const gedcomJs = new require('gedcom-js').default
const gedcom = fs.readFileSync("demo.ged", "utf8")
const result = gedcomJs.parse(gedcom)

result.individuals.forEach(individual => {
  const name = Object.values(individual.names[0]).concat().join(' ')
  const parentIds = individual.parents.map(parent => parent.id).filter(id => id)
  console.log({
    name: name,
    id: individual.id,
    parentIds: [...parentIds]
  })
})
