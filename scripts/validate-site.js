const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const requiredFiles = [
  'index.html',
  'styles.css',
  'script.js',
  'coding.jpg',
  'meeting.jpg',
  'workspace.jpg'
];

function ensureFileExists(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Falta el archivo requerido: ${relativePath}`);
  }
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function ensureIncludes(content, snippet, message) {
  if (!content.includes(snippet)) {
    throw new Error(message);
  }
}

function validateHtml() {
  const html = readFile('index.html');

  ensureIncludes(html, '<!DOCTYPE html>', 'index.html debe declarar DOCTYPE.');
  ensureIncludes(html, '<link rel="stylesheet" href="styles.css">', 'index.html debe cargar styles.css.');
  ensureIncludes(html, '<script src="script.js" defer></script>', 'index.html debe cargar script.js con defer.');
  ensureIncludes(html, '<form', 'index.html debe incluir un formulario.');
}

function validateCss() {
  const css = readFile('styles.css');

  ensureIncludes(css, ':root', 'styles.css debe definir variables CSS en :root.');
  ensureIncludes(css, '@media (max-width: 768px)', 'styles.css debe incluir estilos responsive.');
}

function validateJavaScript() {
  const script = readFile('script.js');

  ensureIncludes(script, 'async function enviarFormulario', 'script.js debe incluir la funcion asincrona enviarFormulario.');
  ensureIncludes(script, 'localStorage.setItem', 'script.js debe persistir datos en localStorage.');
  ensureIncludes(script, 'fetch(', 'script.js debe realizar al menos una llamada fetch.');
}

function main() {
  requiredFiles.forEach(ensureFileExists);
  validateHtml();
  validateCss();
  validateJavaScript();

  console.log('Validacion completada correctamente.');
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}