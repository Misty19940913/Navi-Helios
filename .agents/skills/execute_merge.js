const fs = require('fs');
const path = require('path');

const vaultDir = 'c:/Users/安泰/OneDrive/Obsidian/Navi Helios';
const kbDir = path.join(vaultDir, '400知識/410原子化知識庫');

// Get all files in kb
const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.md'));
const nameMap = {};

// Group by base name
files.forEach(f => {
    let base = f.replace(/(\s*\(.*?\))?\.md$/, '');
    if (!nameMap[base]) nameMap[base] = [];
    nameMap[base].push(f);
});

const duplicatesFound = Object.values(nameMap).filter(arr => arr.length > 1);
const renameMap = {}; // oldName (without .md) -> newName (without .md)

// 1. Merge duplicates
duplicatesFound.forEach((group) => {
    let newFile = group.find(f => f.match(/\([^)]+\)\.md$/)) || group[0];
    let oldFile = group.find(f => f !== newFile) || group[1];
    if (!oldFile) oldFile = group[1];

    const newContent = fs.readFileSync(path.join(kbDir, newFile), 'utf-8');
    const oldContent = fs.readFileSync(path.join(kbDir, oldFile), 'utf-8');

    let cleanOld = oldContent.replace(/^---\r?\n[\s\S]*?\n---\r?\n/, '');

    // Instead of completely reconstructing, we manipulate the new file Content.
    let mergedContent = newContent.trim() + '\n\n### 實踐指南與保留筆記 (From Legacy File)\n\n' + cleanOld.trim() + '\n';

    fs.writeFileSync(path.join(kbDir, newFile), mergedContent);

    // Record for wikilink repair
    const oldBaseName = oldFile.replace('.md', '');
    const newBaseName = newFile.replace('.md', '');
    renameMap[oldBaseName] = newBaseName;

    // Delete old file
    fs.unlinkSync(path.join(kbDir, oldFile));
});

// 2. Fix YAML for all files
const updatedFiles = fs.readdirSync(kbDir).filter(f => f.endsWith('.md'));
updatedFiles.forEach(f => {
    let content = fs.readFileSync(path.join(kbDir, f), 'utf-8');
    let hasYaml = content.match(/^---\r?\n([\s\S]*?)\n---/);

    let tags = '[系統/知識]';
    let status = 'in-progress';
    let stats = fs.statSync(path.join(kbDir, f));
    let t_c = stats.birthtime.toISOString().split('T')[0];
    let t_m = new Date().toISOString().split('T')[0];
    let subject = '"[[待確認]]"';
    let parent = '"[[待確認]]"';
    let related = '"[[待補齊]]"';

    if (content.toLowerCase().includes('實踐') || content.toLowerCase().includes('案例') || content.includes('DONE')) {
        status = 'evergreen';
    } else if (content.length < 200) {
        status = 'seed';
    }

    if (hasYaml) {
        const yaml = hasYaml[1];

        let tagsMatch = yaml.match(/^tags:\s*([\s\S]*?)(?=\n[a-z_]+:|\n---|$)/im);
        if (tagsMatch) {
            let rawTags = tagsMatch[1].replace(/-\s*/g, '').replace(/[\[\]"]/g, '').split(/\s*\n\s*/).filter(Boolean).map(x => x.replace(/,/g, '').trim());
            if (rawTags.length) tags = `[${rawTags.join(', ')}]`;
        }

        if (yaml.match(/status:\s*(.*)/i)) {
            let s = yaml.match(/status:\s*(.*)/i)[1].trim().toLowerCase();
            if (s.includes('done') || s.includes('evergreen')) status = 'evergreen';
            else if (s.includes('seed')) status = 'seed';
        }

        if (yaml.match(/time_create:\s*(?:-\s*)?(['"]?[0-9-]{10}['"]?)/i)) {
            t_c = yaml.match(/time_create:\s*(?:-\s*)?(['"]?[0-9-]{10}['"]?)/i)[1].replace(/['"]/g, '');
        }

        const extractLink = (field, def) => {
            const re = new RegExp(`^${field}:\\s*([\\s\\S]*?)(?=\\n[a-z_]+:|\\n---|$)`, 'im');
            const m = yaml.match(re);
            if (m) {
                let val = m[1].replace(/-\s*/g, '').replace(/["']/g, '');
                let links = val.split(/\n+/).map(x => x.trim()).filter(Boolean);
                if (links.length > 0) {
                    let l = links[0];
                    if (!l.startsWith('[[')) l = `[[${l}]]`;
                    if (!l.endsWith(']]')) l = `${l}]]`;
                    return `"${l}"`;
                }
            }
            return def;
        };

        subject = extractLink('subject', subject);
        parent = extractLink('parent', parent);
        related = extractLink('related', related);

        // Remove old frontmatter
        content = content.replace(/^---\r?\n[\s\S]*?\n---\r?\n/, '');
    }

    let merged = '---\n';
    merged += `tags: ${tags}\n`;
    merged += `status: ${status}\n`;
    merged += `time_create: ${t_c}\n`;
    merged += `time_modifie: ${t_m}\n`;
    merged += `subject: ${subject}\n`;
    merged += `parent: ${parent}\n`;
    merged += `related: ${related}\n`;
    merged += '---\n';
    merged += content.trim() + '\n';

    fs.writeFileSync(path.join(kbDir, f), merged);
});

// 3. Global Wikilink Replacement
function walk(dir) {
    let results = [];
    let list;
    try { list = fs.readdirSync(dir); } catch (e) { return results; }
    list.forEach(function (file) {
        file = path.join(dir, file);
        let stat;
        try { stat = fs.statSync(file); } catch (e) { return; }
        if (stat && stat.isDirectory() && !file.includes('.git') && !file.includes('.obsidian') && !file.includes('.agents')) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.md') || file.endsWith('.canvas')) {
            results.push(file);
        }
    });
    return results;
}

let modifiedLinksCount = 0;
if (Object.keys(renameMap).length > 0) {
    const allFiles = walk(vaultDir);
    allFiles.forEach(file => {
        let content;
        try { content = fs.readFileSync(file, 'utf-8'); } catch (e) { return; }
        let changed = false;

        for (const [oldName, newName] of Object.entries(renameMap)) {
            const regex1 = new RegExp(`\\[\\[${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\]`, 'g');
            if (regex1.test(content)) {
                content = content.replace(regex1, `[[${newName}]]`);
                changed = true;
            }

            const regex2 = new RegExp(`\\[\\[${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\|(.*?)\\]\\]`, 'g');
            if (regex2.test(content)) {
                content = content.replace(regex2, `[[${newName}|$1]]`);
                changed = true;
            }
        }

        if (changed) {
            fs.writeFileSync(file, content);
            modifiedLinksCount++;
        }
    });
}
console.log(`Script executed successfully. Replaced links in ${modifiedLinksCount} files.`);
