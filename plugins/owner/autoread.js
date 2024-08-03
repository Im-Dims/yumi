export default {
  name: 'onautoread/offautoread',
  tags: 'owner',
  command: ['onautoread', 'offautoread'],
  description: 'Enable autoread for this bot',
  example: '',
  owner: true,
  run: async(m, { sock, args, command }) => {
    if (command == 'onautoread') {
      m.reply('Auto read is active')
      global.db.settings.autoread = true
    } else if (command == 'offautoread') {
      m.reply('Auto read is disabled')
      global.db.settings.autoread = false
    } 
  }
}