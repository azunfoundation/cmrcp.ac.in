const fs = require('fs');
const path = require('path');

const dir = 'c:\\cmrcp.ac.in';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let count = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the specific div containing the text
    const newContent = content.replace(/<div>Sponsored by MGR Educational Society<\/div>/g, '');
    
    // Also try to replace just the text if it's not inside a div (just in case)
    const newerContent = newContent.replace(/Sponsored by MGR Educational Society/g, '');
    
    if (content !== newerContent) {
        fs.writeFileSync(filePath, newerContent);
        count++;
    }
});

console.log(`Removed text from ${count} files.`);
