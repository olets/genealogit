import {Command} from '@oclif/command'
import {exec} from 'child_process'
import * as path from 'path'

export default class Relationship extends Command {
  static description = 'Show the relationship between two individuals'

  static args = [
    {name: 'file'},
    {name: 'ind1'},
    {name: 'ind2'},
  ]

  async run() {
    const {argv} = this.parse(Relationship)

    if (argv.length < 3) {
      this.log('Requires three arguments')
      return
    }

    const command = `${this.path('bin')}/relationship "${argv.join('" "')}"`

    exec(command, (err, stdout, stderr) => {
      if (stdout) {
        this.log(stdout)
      } else if (stderr) {
        this.log(stderr)
      } else if (err) {
        this.log(JSON.stringify(err))
      }
    })
  }

  path(rootRelativePath = '') {
    return path.join(this.config.root, rootRelativePath)
  }
}
