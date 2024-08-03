export default {
  name: 'loli',
  tags: 'tools',
  command: ['loli', 'anakkecil'],
  description: 'Pedo banget sialan',
  example: '',
  limit: true,
  run: async(m, { sock }) => {
    let res = await Func.fetchJson('https://raw.githubusercontent.com/Im-Dims/database-doang-sih/main/loli.json')
    let img = res[Math.floor(Math.random() * res.length)]
    await sock.sendMessage(m.chat, { image: { url: img }, caption: 'Pedoo pedoo' }, { quoted: m })
  }
}