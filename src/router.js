import { readdir } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);

// import.meta.url; // file:///C:/Users/Konstantin/PhpstormProjects/tiny-router/src/router.js
const __dirname = path.dirname(__filename); // C:\Users\Konstantin\PhpstormProjects\tiny-router\src
// console.log('directory-name 👉️', __dirname, import.meta.url);


const router = new Map();
const baseDir = path.join(__dirname, '/routes');

async function loadRoutesDir(dirName, base) {
    const relativePath = path.join(base, dirName);
    const workDir = path.join(baseDir, relativePath);

    const dir = await readdir(workDir, {withFileTypes: true});
    for (const dirent of dir) {
        if (dirent.isDirectory()) {
            return loadRoutesDir(dirent.name, path.join(base, dirName))
        } else if (dirent.isFile() && path.extname(dirent.name) === '.js' && path.basename(dirent.name, '.js') === 'index') {
            let modulePath = pathToFileURL(path.join(workDir, dirent.name))
            let module = await import(modulePath);
            router.set(relativePath.replaceAll(path.sep, '/'), {...module})
        }
    }
}

await loadRoutesDir('', path.sep)

export default router;
