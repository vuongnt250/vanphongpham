const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('giao_dien');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/color:\s*'#(0f172a|1e293b|334155)'/gi, "color: 'var(--color-text-main)'");
  content = content.replace(/color:\s*'#(64748b|94a3b8|475569)'/gi, "color: 'var(--color-text-muted)'");
  content = content.replace(/backgroundColor:\s*'#(ffffff)'/gi, "backgroundColor: 'var(--color-surface)'");
  content = content.replace(/background:\s*'#(ffffff)'/gi, "background: 'var(--color-surface)'");
  content = content.replace(/backgroundColor:\s*'#(f1f5f9|f8fafc)'/gi, "backgroundColor: 'var(--color-surface-muted)'");
  content = content.replace(/background:\s*'#(f1f5f9|f8fafc)'/gi, "background: 'var(--color-surface-muted)'");
  content = content.replace(/border:\s*'1px solid #(e2e8f0|cbd5e1)'/gi, "border: '1px solid var(--color-border)'");
  content = content.replace(/borderBottom:\s*'1px solid #(e2e8f0|cbd5e1|f1f5f9)'/gi, "borderBottom: '1px solid var(--color-border)'");
  content = content.replace(/borderTop:\s*'1px solid #(e2e8f0|cbd5e1|f1f5f9)'/gi, "borderTop: '1px solid var(--color-border)'");
  content = content.replace(/borderColor:\s*'#(e2e8f0|cbd5e1)'/gi, "borderColor: 'var(--color-border)'");
  
  // also fix some stragglers like fill for SVGs if they are hardcoded dark but should be text-main
  
  fs.writeFileSync(f, content);
});
console.log("Done");
