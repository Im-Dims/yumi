import { createHash } from 'crypto'

export default {
  name: 'unregister',
  tags: 'main',
  command: ['unregister', 'unreg', 'bataldaftar'],
  description: 'Deleting your account on the bot database',
  example: Func.example('%p', '%cmd', 'serial number kamu'),
  register: true,
  run: async(m, { args }) => {
    let user = db.users[m.sender]
    let sn = createHash('md5').update(m.sender).digest('hex')
    if (args[0] !== sn) return m.reply('Incorrect serial number, please check your serial number by typing *.ceksn*')
      m.reply('Unregister was successful, now your data has been deleted')
      user.age = 0
      user.name = ''
      user.regTime = -1
      user.registered = false
  }
}