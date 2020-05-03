const fs = require('fs')
const gedcomJs = new require('gedcom-js').default

const gedcom = fs.readFileSync("demo.ged", "utf8")
const result = gedcomJs.parse(gedcom)

console.log(result)

