export default {
  name: 'animegine',
  tags: 'tools',
  command: ['animegine', 'animgine'],
  description: 'Create animegine from ai',
  example: '',
  premium: true,
  run: async(m, { sock, text, command }) => {
    let [style, prompt, ratio, sampler] = text.split`|`
    if (!text) return m.reply(`Input prompt!, Example: ${m.prefix + command} Anime|Girl, loli, 11 years old|1024 x 1024|DPM++ 2M SDE Karras`)
    m.reply(global.status.wait)
    let loli = await scrap.animagine({
      style: style,
      prompt: prompt,
      ratio: ratio,
      sampler: sampler,
    })
    await sock.sendMessage(m.chat, { image: { url: loli[0].image.url }, caption: 'Nih' }, { quoted: m })
  }
} 