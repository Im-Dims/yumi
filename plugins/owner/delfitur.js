export default {
  name: 'delfitur',
  tags: 'owner',
  command: ['delfitur', 'df', 'dp'],
  description: 'Remove features from command directory',
  example: Func.example('%p', '%cmd', 'plugins/owner/add.js'),
  owner: true,
  run: async(m, { text }) => {
    //let plugin = Object.keys(plugins).map(v => v.replace(/.js/g, "").split("command/")[1])
    if (!plugin.includes(text)) return m.reply("Folder not found")
    func.fs.unlinkSync(text)
    m.reply("Plugin files " + text + " was removed")
  }
}