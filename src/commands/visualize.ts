import {Command} from '@oclif/command'
import {exec} from 'child_process'
import * as path from 'path'

export default class Visualize extends Command {
  static description = 'Show the Git log graph for the specified file'

  static args = [
    {name: 'file'},
  ]

  async run() {
    const {args} = this.parse(Visualize)

    if (!args.file) {
      this.log('A file name is required')
      return
    }

    exec(`${this.path('bin')}/visualize "genealogit/${args.file}"`, (err, stdout, stderr) => {
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
