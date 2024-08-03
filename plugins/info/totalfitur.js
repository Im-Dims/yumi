export default {
  name: 'totalfitur',
  tags: 'info',
  command: ['totalfitur'],
  description: 'Displays a list of features available in the bot',
  example: '',
  run: async(m) => {
    let tags = Object.values(plugins).flatMap(v => v.tags).filter(v => v != undefined && v.trim() !== "")
    let counts = tags.reduce((v, p) => { v[p] = (v[p] || 0) + 1; return v }, {}), totalCmd = Object.values(counts).reduce((a, b) => a + b, 0)
    let tagList = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([tag, count]) => `• ${(tag.charAt(0).toUpperCase() + tag.slice(1))} : ${count.toString()}`).join("\n")
    m.reply(`*[ FEATURE LIST ]*\n\n${tagList}\n\n*Total features*: ${totalCmd} command`)
  }
}