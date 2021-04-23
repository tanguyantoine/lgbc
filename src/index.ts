import Git, { Reference } from 'nodegit'
import * as inquirer from 'inquirer'
import * as path from 'path'
import yargs from 'yargs'

async function main() {
  const { cwd } = getArgs()
  try {
    const repo = await Git.Repository.open(cwd)
    const refs = await repo.getReferences()
    const { branches } = await inquirer.prompt<{ branches: Reference[] }>([
      {
        name: 'branches',
        type: 'checkbox',
        choices: refs
          .filter((r) => !r.isRemote() && !r.isTag())
          .map((ref) => ({
            value: ref,
            name: ref.shorthand(),
          })),
      },
    ])
    branches.forEach((ref) => {
      if (ref.delete() === 0) {
        console.log('Deleted: ', ref.shorthand())
      } else {
        console.error('error while deleting: ', ref.shorthand())
      }
    })
    main()
  } catch (e) {
    switch (e.errorFunction) {
      case 'Repository.open': {
        console.error('Not a valid git repository')
        break
      }
      default: {
        console.error(e.toString())
      }
    }
  }
}

function getArgs() {
  const { cwd = process.cwd() } = yargs(process.argv.slice(2))
    .options({
      cwd: {
        describe: 'current working directory',
      },
    })
    .help().argv

  return {
    cwd: path.resolve(cwd as string),
  }
}

main()
