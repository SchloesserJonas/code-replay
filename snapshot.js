import fs from 'fs'
import path from 'path'

export function getFolderSnapshot(folderPath) {
  const snapshot = {};

  function readFolder(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if(filePath.includes('node_modules')) return; // Ignoriere node_modules
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        readFolder(filePath); // Rekursiv für Unterordner
      } else {
        snapshot[filePath] = stats.mtimeMs; // Speichere den Last Modified Time
      }
    })
  }

  readFolder(folderPath);
  return snapshot;
}

export function getSnapshotChanges(oldSnapshot, newSnapshot) {
  const changes = {
    added: [],
    removed: [],
    modified: []
  }

  // Prüfe auf hinzugefügte oder geänderte Dateien
  for (const filePath in newSnapshot) {
    if (!oldSnapshot[filePath]) {
      changes.added.push(filePath);
    } else if (newSnapshot[filePath] !== oldSnapshot[filePath]) {
      changes.modified.push(filePath);
    }
  }

  // Prüfe auf entfernte Dateien
  for (const filePath in oldSnapshot) {
    if (!newSnapshot[filePath]) {
      changes.removed.push(filePath);
    }
  }

  return changes;
}