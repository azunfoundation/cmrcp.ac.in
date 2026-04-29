const fs = require('fs');
const https = require('https');
const path = require('path');

const baseDir = 'c:/cmrcp.ac.in';
const liveHtml = fs.readFileSync(path.join(baseDir, 'live_gallery.html'), 'utf8');
let localHtml = fs.readFileSync(path.join(baseDir, 'main-gallery.html'), 'utf8');

// Find all gallery blocks in the live HTML
const blockRegex = /<div class=\"wpb_text_column wpb_content_element[^>]*>[\s\S]*?<img[^>]*src=\"([^\"]+)\"[\s\S]*?<p>([^<]+)<\/p>/g;
let match;
const imageMapping = {};

while ((match = blockRegex.exec(liveHtml)) !== null) {
    let imgSrc = match[1];
    let caption = match[2].trim();
    // Sometimes there are nested tags in caption, so let's clean it up roughly
    caption = caption.replace(/<[^>]+>/g, '').trim();
    if(imgSrc && caption) {
        imageMapping[caption] = imgSrc;
    }
}

// Another pass for cases where caption is in an <a> tag
const aTagRegex = /<div class=\"wpb_text_column wpb_content_element[^>]*>[\s\S]*?<img[^>]*src=\"([^\"]+)\"[\s\S]*?<a[^>]*>([^<]+)<\/a><\/p>/g;
while ((match = aTagRegex.exec(liveHtml)) !== null) {
    let imgSrc = match[1];
    let caption = match[2].trim();
    if(imgSrc && caption) {
        imageMapping[caption] = imgSrc;
    }
}

console.log(`Found ${Object.keys(imageMapping).length} captions in live HTML.`);

// Now let's try to match these captions to the local HTML structure
// Our local HTML structure looks like:
// <div class="flex-col"><p><a href="..."><img src="assets/img/logo.jpg" /></a></p><p>Guest Lecture on ‘Empower Indian Pharmacist’</p></div>

const localBlockRegex = /<div class=\"flex-col\">[\s\S]*?<img[^>]*src=\"assets\/img\/logo\.jpg\"[^>]*>[\s\S]*?<p>(?:<a[^>]*>)?([^<]+)(?:<\/a>)?<\/p><\/div>/g;
let replacements = [];

while ((match = localBlockRegex.exec(localHtml)) !== null) {
    const fullMatch = match[0];
    let localCaption = match[1].trim();
    
    // Try to find the closest matching caption in the live data
    let foundSrc = null;
    for (const [liveCaption, src] of Object.entries(imageMapping)) {
        if (liveCaption.toLowerCase() === localCaption.toLowerCase() || 
            liveCaption.toLowerCase().includes(localCaption.toLowerCase()) || 
            localCaption.toLowerCase().includes(liveCaption.toLowerCase())) {
            foundSrc = src;
            break;
        }
    }
    
    if (foundSrc) {
        const fileName = path.basename(foundSrc);
        const localImgPath = `assets/images/cmrcp_migrated/${fileName}`;
        replacements.push({
            originalBlock: fullMatch,
            newBlock: fullMatch.replace('assets/img/logo.jpg', localImgPath),
            downloadUrl: foundSrc,
            fileName: fileName
        });
    }
}

console.log(`Found ${replacements.length} matches to replace in local HTML.`);

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        if(fs.existsSync(filepath)) {
            resolve();
            return;
        }
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                // Try http if https fails or just reject
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function processAll() {
    for (const item of replacements) {
        try {
            await downloadImage(item.downloadUrl, path.join(baseDir, 'assets/images/cmrcp_migrated', item.fileName));
            localHtml = localHtml.replace(item.originalBlock, item.newBlock);
            console.log(`Downloaded and replaced: ${item.fileName}`);
        } catch (e) {
            console.error(`Failed to download ${item.downloadUrl}:`, e.message);
        }
    }
    fs.writeFileSync(path.join(baseDir, 'main-gallery.html'), localHtml);
    console.log('Finished updating main-gallery.html');
}

processAll();
