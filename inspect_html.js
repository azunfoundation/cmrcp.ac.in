const fs = require('fs');

const html = fs.readFileSync('c:/cmrcp.ac.in/live_gallery.html', 'utf8');

// Find all image tags
const imgRegex = /<img[^>]+>/gi;
let match;
while ((match = imgRegex.exec(html)) !== null) {
    if(match[0].includes('uploads') || match[0].includes('data-src')) {
        console.log(match[0].substring(0, 200));
    }
}
