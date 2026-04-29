const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = 'c:\\cmrcp.ac.in';
const filesDir = path.join(dir, 'Files');

if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
}

const pdfPath = path.join(filesDir, 'ServiceRules.pdf');

// Download the PDF
https.get('https://cmrcp.ac.in/Files/ServiceRules.pdf', (res) => {
    if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(pdfPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            console.log('Downloaded ServiceRules.pdf successfully.');
            updateHtmlFiles();
        });
    } else {
        console.error('Failed to download PDF. Status:', res.statusCode);
        // Even if download fails, we should fix the links
        updateHtmlFiles();
    }
}).on('error', (err) => {
    console.error('Error downloading:', err.message);
    updateHtmlFiles();
});

function updateHtmlFiles() {
    const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    let count = 0;

    htmlFiles.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let newContent = content.replace(/href="\/Files\/ServiceRules\.pdf"/g, 'href="Files/ServiceRules.pdf" target="_blank"');
        
        // Handle case where target="_blank" might already be there or if it was differently formatted
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            count++;
        }
    });

    console.log(`Updated links in ${count} files.`);
}
