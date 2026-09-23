// Lee el JSON del hook (stdin) y imprime el campo pedido. Uso: node _input.mjs <campo>
// campos: file | text | command
let raw = '';
for await (const chunk of process.stdin) raw += chunk;
const { tool_input: t = {} } = JSON.parse(raw || '{}');
const field = process.argv[2];
const out = {
  file: t.file_path ?? t.notebook_path ?? '',
  text: [t.content, t.new_string, ...(t.edits ?? []).map(e => e.new_string)].filter(Boolean).join('\n'),
  command: t.command ?? '',
}[field];
process.stdout.write(out ?? '');
