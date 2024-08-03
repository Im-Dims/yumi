export default {
  name: 'runtime',
  tags: 'info',
  command: ['runtime', 'rt'],
  description: 'Runtime or Uptime of the bot',
  example: '',
  run: async(m) => {
    m.reply(await func.runtime(process.uptime()))
  }
}