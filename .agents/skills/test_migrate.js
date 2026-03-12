const fs = require('fs');
const path = require('path');

const kbDir = 'c:/Users/安泰/OneDrive/Obsidian/Navi Helios/400知識/410原子化知識庫';

function migrateFile(filePath) {
    const filename = path.basename(filePath);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Extract YAML
    let yamlObj = {
        tags: '[系統/知識]',
        status: 'seed',
        time_create: '',
        time_modifie: new Date().toISOString().split('T')[0],
        parent: '"[[待確認]]"'
    };

    const yamlMatch = content.match(/^---\r?\n([\s\S]*?)\n---/);
    let rawBody = content;
    if (yamlMatch) {
        const yaml = yamlMatch[1];
        rawBody = content.replace(/^---\r?\n[\s\S]*?\n---\r?\n/, '').trim();

        const cMatch = yaml.match(/time_create:\s*(?:-\s*)?(['"]?[0-9-]{10}['"]?)/i);
        if (cMatch) yamlObj.time_create = cMatch[1].replace(/['"]/g, '');

        const sMatch = yaml.match(/status:\s*(.*)/i);
        if (sMatch) {
            let s = sMatch[1].trim().toLowerCase();
            if (s.includes('evergreen') || s.includes('done')) yamlObj.status = 'evergreen';
            else if (s.includes('seed')) yamlObj.status = 'seed';
            else yamlObj.status = 'in-progress';
        }

        const pMatch = yaml.match(/parent:\s*([^\n]*)/i);
        if (pMatch) {
            let val = pMatch[1].trim();
            // Fix previous bug
            if (val && !val.includes('aliases:') && !val.includes('related:')) {
                if (!val.startsWith('"') && val.startsWith('[[')) val = `"${val}"`;
                yamlObj.parent = val;
            }
        }
    }

    if (!yamlObj.time_create) {
        try { yamlObj.time_create = fs.statSync(filePath).birthtime.toISOString().split('T')[0]; } catch (e) { yamlObj.time_create = yamlObj.time_modifie; }
    }

    // 2. Identify Meta structure
    let body = rawBody;
    let titleLine = body.match(/^# (.*)/);
    let title = titleLine ? titleLine[1] : filename.replace('.md', '');
    if (titleLine) body = body.replace(titleLine[0], '').trim();

    let insight = '';
    // Look for any abstract/quote callout at the top
    const insightMatch = body.match(/^> \[!(abstract|quote|info)\] (?:核心洞見|Insight)? ?\(?Insight\)?\r?\n> (.*)/im);
    if (insightMatch) {
        insight = insightMatch[2];
        body = body.replace(insightMatch[0], '').trim();
    } else {
        // Fallback: take first paragraph if short and not a header
        const paragraphs = body.split(/\n\n+/);
        if (paragraphs[0] && paragraphs[0].length < 250 && !paragraphs[0].startsWith('#') && !paragraphs[0].startsWith('>')) {
            insight = paragraphs[0].trim();
            body = body.replace(paragraphs[0], '').trim();
        }
    }

    // 3. Section Mapping
    let definitions = [];
    let practices = [];
    let connections = [];
    let legacy = '';

    // Handle Legacy section first
    const legacyIndicator = "### 實踐指南與保留筆記 (From Legacy File)";
    const legacyIdx = body.indexOf(legacyIndicator);
    if (legacyIdx !== -1) {
        legacy = body.substring(legacyIdx);
        body = body.substring(0, legacyIdx).trim();
    }

    // Split body into sections by headers (Level 2 or 3)
    const sections = body.split(/\n(?=##+ )/);
    sections.forEach(s => {
        const headerMatch = s.match(/^##+ (.*)/m);
        if (!headerMatch) {
            if (s.trim()) definitions.push(s);
            return;
        }

        const hTitle = headerMatch[1].toLowerCase();
        const hContent = s.replace(headerMatch[0], '').trim();

        if (hTitle.match(/定義|機制|原理|邏輯|what & how/)) {
            definitions.push(hContent);
        } else if (hTitle.match(/實踐|案例|行動|工作流|應用|action & proof|sop|指南/)) {
            practices.push(hContent);
        } else if (hTitle.match(/關聯|網絡|脈絡|connection|連結/)) {
            connections.push(hContent);
        } else {
            // Keep the header for unknown sections but put them in a logical place
            if (hTitle.match(/履歷|log|紀錄|專案/)) {
                legacy = (legacy ? legacy + '\n\n' : legacyIndicator + '\n\n') + s;
            } else {
                definitions.push(s); // Keep full string including header for unknown
            }
        }
    });

    // 4. Reconstruct
    let newContent = `---\n`;
    newContent += `tags: ${yamlObj.tags}\n`;
    newContent += `status: ${yamlObj.status}\n`;
    newContent += `time_create: ${yamlObj.time_create}\n`;
    newContent += `time_modifie: ${yamlObj.time_modifie}\n`;
    newContent += `parent: ${yamlObj.parent}\n`;
    newContent += `---\n`;
    newContent += `# ${title}\n`;
    newContent += `> [!abstract] 核心洞見 (Insight)\n`;
    newContent += `> ${insight || '{{這是一個什麼概念？用一句話說明它能解決什麼核心痛點或帶來什麼槓桿。}}'}\n\n`;

    newContent += `### 定義與機制 (What & How)\n`;
    let defText = definitions.join('\n\n').trim();
    newContent += (defText || '- **核心定義**：\n- **運作機制**：') + '\n\n';

    newContent += `### 實踐與案例 (Action & Proof)\n`;
    let pracText = practices.join('\n\n').trim();
    newContent += (pracText || '- **真實案例**：\n- **行動指南**：') + '\n\n';

    newContent += `### 知識網絡 (Connection)\n`;
    let connText = connections.join('\n\n').trim();
    newContent += (connText || '- **關聯脈絡**：') + '\n\n';

    if (legacy) {
        if (!legacy.startsWith('###')) {
            newContent += legacyIndicator + '\n\n' + legacy + '\n';
        } else {
            newContent += legacy + '\n';
        }
    }

    return newContent;
}

// Test on two files
const filesToTest = ['一人公司.md', '人生指南針 (Life Compass).md'];
filesToTest.forEach(f => {
    const filePath = path.join(kbDir, f);
    if (fs.existsSync(filePath)) {
        const result = migrateFile(filePath);
        fs.writeFileSync(`c:/Users/安泰/.gemini/antigravity/brain/fd61db05-288a-4d7c-bd49-a858df7c555c/test_${f}`, result);
    }
});
console.log('Test conversions saved for: ' + filesToTest.join(', '));
