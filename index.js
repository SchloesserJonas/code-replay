import chalk from "chalk"
import path from 'path'
import { fileURLToPath } from 'url';
import boxen from "boxen"
import { modeSelector, deletePresentationSelector } from './selectors.js'
import { player } from './player.js'
import { recorder } from './recorder.js'
import { readDir, readMetaFile, deleteDir } from './fsu.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await main()
async function main() {
    console.clear()
    console.log(
    boxen(chalk.yellow("coding presentation player"), {
        padding: { top: 1, left: 10, right: 10, bottom: 1 },
        borderColor: "green",
    })
    )

    let mode = await modeSelector()
    if(mode == "player") {
        player()
    } else if(mode == "recorder") {
        recorder()
    } else if(mode == "manage") {
        let projectMetadata = readDir(path.join(__dirname, 'presentation'))

        let projectOptions = []
        projectMetadata.forEach((project) => {
            var metadata = readMetaFile(path.join(__dirname, 'presentation', project, 'meta.json'))
            projectOptions.push({name: metadata.name + ' (' + chalk.yellow(metadata.uuid.split('-')[0]) + ')', value: project})
        })

        let toBeDeleted = await deletePresentationSelector(projectOptions)
        for(let presentation of toBeDeleted) {
            deleteDir(path.join(__dirname, 'presentation', presentation))
        }
        console.log(chalk.redBright("Presentations deleted successfully!"))
    } else {
        process.exit(1)
    }
}