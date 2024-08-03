export default {
  name: 'savefitur',
  tags: 'owner',
  command: ['savefitur', 'sf', 'sp'],
  description: 'Save features from command directory',
  example: Func.example('%p', '%cmd', 'plugins/owner/add.js'),
  owner: true,
  quoted: true,
  run: async(m, { text }) => {
    text = text.endsWith(".js") ? text.split(".js")[0] : text
    func.fs.writeFileSync(text + ".js", m.quoted.body)
    m.reply("Plugin files " + text + " has been saved")
  }
}