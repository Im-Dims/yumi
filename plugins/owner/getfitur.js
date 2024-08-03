import cp from 'child_process'
import { promisify } from 'util'
let exec = promisify(cp.exec).bind(cp)

export default {
  name: 'getfitur',
  tags: 'owner',
  command: ['getfitur', 'gf', 'gp'],
  description: 'Get features from command directory',
  example: Func.example('%p', '%cmd', 'plugins/owner/add.js'),
  owner: true,
  run: async(m, { sock, command, text }) => {
    let ar = Object.keys(plugins)    
    let o
    try {
        o = await exec('cat ' + m.text)
    } catch (e) {
        o = e
    } finally {
      let { stdout, stderr } = o
      if (stdout.trim()) sock.sendMessage(m.chat, { image: { url: 'https://i.ibb.co/5Y0Hdq6/IMG-20240523-WA0861.jpg' }, caption: stdout }, { quoted : m })
      if (stderr.trim()) sock.sendMessage(m.chat, { image: { url: 'https://i.ibb.co/5Y0Hdq6/IMG-20240523-WA0861.jpg' }, caption: stderr }, { quoted : m })
    }
  }
}