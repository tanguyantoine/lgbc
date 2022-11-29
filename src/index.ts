import { BranchSummary, BranchSummaryBranch, simpleGit } from 'simple-git'
import * as inquirer from 'inquirer'
import * as path from 'path'
import yargs from 'yargs'

async function main() {
  const { cwd } = getArgs()
  try {
    const git = simpleGit()
    const refs = await git.branchLocal()
    const { branches } = await inquirer.prompt<{ branches: BranchSummaryBranch[] }>([
      {
        name: 'branches',
        type: 'checkbox',
        choices: refs.all
          .filter((name) => !name.startsWith('remotes'))
          .map((ref) => ({
            value: refs.branches[ref],
            disabled: refs.branches[ref].current,
            name: ref,
          })),
      },
    ])
    await git.deleteLocalBranches(branches.map(b => b.name), true)
    main()
  } catch (e: any) {
    console.error(e.toString())
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
