import chalk from "chalk"
import boxen from "boxen"
import path from 'path'
import { fileURLToPath } from 'url'
import { getPresentationName, getProjectPath } from './selectors.js'
import { createDir, writeFile, readMetaFile, copyFile, fileExists, readFileInfoFile, deleteDir } from './fsu.js'
import { v4 as uuidv4 } from 'uuid'
import readline from 'readline';
import { getFolderSnapshot, getSnapshotChanges } from "./snapshot.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
var INT_PROJECT_NAME
var PROJECT_NAME
var PROJECT_PATH

export async function recorder() {
    let presentationName = await getPresentationName()
    let projectPath = await getProjectPath()
    initPresentation(presentationName, projectPath)
    console.log(chalk.green('Presentation initialized'))

    recordHandler()
}

function initPresentation(name, projectPath) {
    let uuid = uuidv4()
    let regex = /[ \/\\.;:{})(\[\]]/g
    PROJECT_PATH = projectPath
    let projectName = name.replaceAll(regex, '_').toLowerCase().substring(0, 5) + uuid.split('-')[0]
    createDir(path.join(__dirname, 'presentation', projectName))
    writeFile(path.join(__dirname, 'presentation', projectName, 'meta.json'), JSON.stringify({name: name, uuid: uuid, path: projectPath}))
    INT_PROJECT_NAME = projectName
    PROJECT_NAME = name
}

var step = 0
var intervalId = 0
async function recordHandler() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (line) => {
        if (line === 'next') {
            step++;
            recordStep(step);
        } else if (line === 'stop') {
            clearInterval(intervalId);
            endRecording();
        } else if (line === 'exit') {
            clearInterval(intervalId);
            deleteDir(path.join(__dirname, 'presentation', INT_PROJECT_NAME));
            process.exit(1);
        }
    });

    recordStep(step)
}

var initialSnapshot = {}
var latestChanges = {}
function recordStep(step) {
    createDir(path.join(__dirname, 'presentation', INT_PROJECT_NAME, step.toString()))
    printHeader()
    latestChanges = {}
    initialSnapshot = getFolderSnapshot(path.join(PROJECT_PATH))
    intervalId = setInterval(capture, 5000)
}

function capture() {
    let changes = getSnapshotChanges(initialSnapshot, getFolderSnapshot(path.join(PROJECT_PATH)))
    if(JSON.stringify(changes) != JSON.stringify(latestChanges)) {
        printChanges(changes)
        latestChanges = changes
    }
    captureChanges(changes)
}

async function printHeader() {
    console.clear()
    console.log(
        boxen(chalk.yellow("Recording slide: ") + chalk.cyan(step + 1) + chalk.yellow("\nOf presentation: ") + chalk.cyan(PROJECT_NAME), {
            padding: { top: 1, left: 10, right: 10, bottom: 1 },
            borderColor: "green",
        })
    )

    console.log(chalk.yellow("Type 'next' to record the next step, 'stop' to stop recording, or 'exit' to exit the script:\n\n"))
}

function endRecording() {
    console.log(chalk.green('Recording ended'))
    let meta = readMetaFile(path.join(__dirname, 'presentation', INT_PROJECT_NAME, 'meta.json'))
    meta.created = new Date().toISOString()
    writeFile(path.join(__dirname, 'presentation', INT_PROJECT_NAME, 'meta.json'), JSON.stringify(meta))
    process.exit(1)
}

function captureChanges(changes) {
    var files = { added: [], removed: [], modified: [] }
    if(fileExists(path.join(__dirname, 'presentation', INT_PROJECT_NAME, step.toString(), 'files.json'))) {
        files = readFileInfoFile(path.join(__dirname, 'presentation', INT_PROJECT_NAME, step.toString(), 'files.json'))
    }

    save(changes.added, 'added')
    save(changes.removed, 'removed')
    save(changes.modified, 'modified')

    function save(changes, action) {
        for(let file of changes) {
            if(files[action].find(f => f.path == file)) {
                continue
            }

            let uuid = uuidv4()
            copyFile(file, path.join(__dirname, 'presentation', INT_PROJECT_NAME, step.toString(), uuid + '.' + file.split('.')[file.split('.').length - 1]))
            files[action].push({path: file, uuid: uuid})
        }
    }
    writeFile(path.join(__dirname, 'presentation', INT_PROJECT_NAME, step.toString(), 'files.json'), JSON.stringify(files))
}

function printChanges(changes) {
    console.log(chalk.white('Added files:'))
    for(let file of changes.added) {
        console.log(chalk.yellow(' > ') + chalk.green(file))
    }
    console.log(chalk.white('Removed files:'))
    for(let file of changes.removed) {
        console.log(chalk.yellow(' > ') + chalk.red(file))
    }
    console.log(chalk.white('Modified files:'))
    for(let file of changes.modified) {
        console.log(chalk.yellow(' > ') + chalk.blue(file))
    }
    console.log()
}
