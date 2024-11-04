import inquirer from "inquirer"

export async function modeSelector() {
    let answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'mode',
            message: 'Please select a mode:',
            choices: [
                {name: 'Player', value: 'player'},
                {name: 'Recorder', value: 'recorder'},
                {name: 'Manage Presentations', value: 'manage'},
                {name: 'Exit', value: 'exit'}
            ]
        }
    ])
    return answer.mode
}

export async function presentationSelector(options) {
    let answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'presentation',
            message: 'Please select a presentation:',
            choices: options
        }
    ])
    return answer.presentation
}

export async function getPresentationName() {
    let answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Please enter a name for the presentation:'
        }
    ])
    return answer.name
}

export async function getProjectPath() {
    let answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'path',
            message: 'Please enter the absolute path to the project folder:'
        }
    ])
    return answer.path
}

export async function deletePresentationSelector(options) {
    let answer = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'presentation',
            message: 'Please select the presentations you want to delete:',
            choices: options
        }
    ])
    return answer.presentation
}