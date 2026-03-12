const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/安泰/OneDrive/Obsidian/Navi Helios/400知識/410原子化知識庫';
const outPath = 'C:/Users/安泰/.gemini/antigravity/brain/fd61db05-288a-4d7c-bd49-a858df7c555c/merge_preview.md';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
const nameMap = {};

// Find duplicates based on base name
files.forEach(f => {
    let base = f.replace(/(\s*\(.*?\))?\.md$/, '');
    if (!nameMap[base]) nameMap[base] = [];
    nameMap[base].push(f);
});

const duplicatesFound = Object.values(nameMap).filter(arr => arr.length > 1);

let md = '# 📋 知識庫備查：合併與校準預覽 (Merge & Repair Preview)\n\n';
md += '> 根據您的指令，這是一份針對重複檔案的**合併預覽報告**，以及全面補足 Frontmatter 屬性的操作邏輯。\n\n';

md += '## 第一部分：重複檔案合併預覽\n\n';
md += '合併原則：\n';
md += '1. 主檔名一律採用 `中文標題 (英文翻譯).md`。\n';
md += '2. YAML 將強制統一對齊 7 行核心屬性（缺失則推斷補足，狀態自動化映射）。\n';
md += '3. 內文將保留舊版的「實踐指南/案例」，並結合新版的「核心洞見/摘要 Callout」。\n\n';

duplicatesFound.forEach((group, i) => {
    let newFile = group.find(f => f.match(/\([^)]+\)\.md$/)) || group[0];
    let oldFile = group.find(f => f !== newFile) || group[1];
    if (!oldFile) oldFile = group[1];

    const newContent = fs.readFileSync(path.join(dir, newFile), 'utf-8');
    const oldContent = fs.readFileSync(path.join(dir, oldFile), 'utf-8');

    let yamlMatch = oldContent.match(/^---\r?\n([\s\S]*?)\n---/);
    let t_c = new Date().toISOString().split('T')[0];
    let t_m = new Date().toISOString().split('T')[0];
    let subject = '""';
    let parent = '""';
    let related = '""';

    if (yamlMatch) {
        const yaml = yamlMatch[1];
        if (yaml.includes('time_create:')) {
            const m = yaml.match(/time_create:\s*(?:-\s*)?([0-9-]{10})/);
            if (m) t_c = m[1];
        }
        if (yaml.includes('related:')) {
            const m = yaml.match(/related:\s*(?:-\s*)?("?\[\[.*?\]\]"?)/);
            if (m) related = m[1].replace(/"/g, '');
        }
        if (yaml.includes('subject:')) {
            const m = yaml.match(/subject:\s*(?:-\s*)?("?\[\[.*?\]\]"?)/);
            if (m) subject = m[1].replace(/"/g, '');
        }
        if (yaml.includes('parent:')) {
            const m = yaml.match(/parent:\s*(?:-\s*)?("?\[\[.*?\]\]"?)/);
            if (m) parent = m[1].replace(/"/g, '');
        }
    }

    subject = subject.startsWith('"') ? subject : '"' + subject + '"';
    parent = parent.startsWith('"') ? parent : '"' + parent + '"';
    related = related.startsWith('"') ? related : '"' + related + '"';

    let cleanOld = oldContent.replace(/^---\r?\n[\s\S]*?\n---\r?\n/, '');
    let cleanNew = newContent.replace(/^---\r?\n[\s\S]*?\n---\r?\n/, '');

    let merged = '---\n';
    merged += 'tags: [系統/知識]\n';
    merged += 'status: evergreen\n';
    merged += `time_create: ${t_c}\n`;
    merged += `time_modifie: ${t_m}\n`;
    merged += `subject: ${subject === '""' ? '"[[待確認]]"' : subject}\n`;
    merged += `parent: ${parent === '""' ? '"[[待確認]]"' : parent}\n`;
    merged += `related: ${related === '""' ? '"[[待確認]]"' : related}\n`;
    merged += '---\n';
    merged += cleanNew.trim() + '\n\n';
    merged += '### 實踐指南與保留筆記 (From Legacy File)\n\n';
    merged += cleanOld.trim() + '\n';

    md += `### ${i + 1}. 合併 \`${oldFile}\` -> \`${newFile}\`\n`;
    md += `<details><summary>點擊查看合併後的內容預覽</summary>\n\n`;
    md += "```markdown\n" + merged + "\n```\n";
    md += `</details>\n\n`;
});

md += '---\n## 第二部分：全面補齊 YAML 的規則說明\n\n';
md += "針對全庫中缺失 YAML 的檔案，以及屬性不完整的檔案，將**全面賦予以下標準 7 行結構**，並確保括號或引號的純淨度：\n";
md += "```yaml\n";
md += "tags: [系統/知識]\n";
md += "status: seed | in-progress | evergreen\n";
md += "time_create: YYYY-MM-DD\n";
md += "time_modifie: YYYY-MM-DD\n";
md += 'subject: "[[待確認]]"\n';
md += 'parent: "[[待確認]]"\n';
md += 'related: "[[待補齊]]"\n';
md += "```\n\n";

fs.writeFileSync(outPath, md);
console.log('Done!');
