import * as Git from 'nodegit'
import * as inquire from 'inquirer'
import * as path from 'path'
import yargs from 'yargs'

const { cwd = process.cwd() } = yargs(process.argv.slice(2))
  .options({
    cwd: {
      describe: 'current working directory',
    },
  })
  .help().argv

console.log(path.resolve(cwd as string))

console.log({ cwd })
