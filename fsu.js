import fs from 'fs'

export function readDir(path) {
    try {
        let content = fs.readdirSync(path)
        return content
    } catch (error) {
        return []
    }
}

export function createDir(path) {
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

export function readMetaFile(path) {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'))
    } catch (error) {
        throw new Error("Error reading meta file at " + path)
    }
}

export function writeFile(path, content) {
    try {
        fs.writeFileSync(path, content, 'utf-8')
    } catch (error) {
        throw new Error("Error writing file at " + path)
    }
}

export function copyFile(path, destination) {
    try {
        fs.copyFileSync(path, destination)
    } catch (error) {
        throw new Error("Error copying file at " + path)
    }

}

export function readFileInfoFile(path) {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'))
    } catch (error) {
        throw new Error("Error reading file info file at " + path)
    }
}

export function fileExists(path) {
    return fs.existsSync(path)
}

export function deleteDir(path) {
    if(fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true })
    }
}