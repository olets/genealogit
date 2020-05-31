import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'
import {join} from 'path'
import {projectPath} from '../util'
import {execSync, spawnSync} from 'child_process'

export default class Clean extends Command {
  static description = 'Delete a tree created by `build`'

  static args = [{name: 'file'}]

  static flags = {
    format: flags.string({
      default: 'gedcom',
    }),
  }

  binDir
  format
  prefix

  async run() {
    const {args, flags} = this.parse(Clean)
    this.binDir = join(this.config.root, '/bin')
    this.format = flags.format

    cli.action.start('Cleaning')

    if (args.file) {
      this.clean(args.file)
    } else {
      const files = await this.files()

      files.forEach(f => {
        let underline = ''
        for (let i = 0; i < f.length; i++) {
          underline += '-'
        }

        this.clean(f)
      })
    }

    cli.action.stop()
  }

  clean(file) {
    execSync(`bash ${this.binDir}/clean "genealogit/${file}/"`)
  }

  async files() {
    let files = []
    let regex

    switch(this.format) {
      case 'gedcom':
        regex = /\.ged$/
        break
      case 'json':
        regex = /\.json$/
        break
      case 'yaml':
        regex = /\.yaml$/
        break
    }

    fs.readdirSync(projectPath()).forEach(child => {
      const matches = child.match(regex)

      if (matches) {
        files = [...files, child]
      }
    })

    return files
  }
}
