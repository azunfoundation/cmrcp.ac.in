const fs = require('fs');
const dir = 'c:/cmrcp.ac.in';
fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
    const filePath = dir + '/' + f;
    let content = fs.readFileSync(filePath, 'utf8');
    if(content.includes('1.jpg')) {
        // Replace assets/images/cmrcp_migrated/1.jpg with assets/img/logo.jpg
        const newContent = content.replace(/assets\/images\/cmrcp_migrated\/1\.jpg/g, 'assets/img/logo.jpg');
        if(content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log('Updated ' + f);
        }
    }
});
