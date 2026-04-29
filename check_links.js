const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('c:/cmrcp.ac.in/index.html', 'utf8');
const links = [];
const regex = /href=\"([^\"]+)\"/g;
let match;

while ((match = regex.exec(html)) !== null) {
    links.push(match[1]);
}

const localLinks = [...new Set(links.filter(l => 
    !l.startsWith('http') && 
    !l.startsWith('#') && 
    !l.startsWith('tel:') && 
    !l.startsWith('mailto:') && 
    l.endsWith('.html')
))];

const missing = localLinks.filter(l => !fs.existsSync(path.join('c:/cmrcp.ac.in', l)));

console.log('Total local HTML links:', localLinks.length);
console.log('Missing pages:', missing);
