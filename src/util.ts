import {resolve} from 'path'

export function projectPath(path: string = '') {
  // INIT_CWD is available if package is installed. PWD fallback for during development
  const root = process.env.INIT_CWD || process.env.PWD

  return resolve(root, path)
}
