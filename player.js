import chalk from "chalk"
import path from 'path'
import { fileURLToPath } from 'url';
import { presentationSelector } from './selectors.js'
import { readDir, createDir, readMetaFile } from './fsu.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function player() {
    createDir(path.join(__dirname, 'presentation'))
    let projectMetadata = readDir(path.join(__dirname, 'presentation'))

    let projectOptions = []
    projectMetadata.forEach((project) => {
        var metadata = readMetaFile(path.join(__dirname, 'presentation', project, 'meta.json'))
        projectOptions.push({name: metadata.name + ' (' + chalk.yellow(metadata.uuid.split('-')[0]) + ')', value: project})
    })
    if(projectOptions.length == 0) {
        console.log(chalk.red('No presentations found. Please create a presentation first.'))
        process.exit(1)
    }

    let project = await presentationSelector(projectOptions)
    
    startPlayer(project)
}

function startPlayer(project) {

}