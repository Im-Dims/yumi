let {
    downloadContentFromMessage
} = (await import('@whiskeysockets/baileys'));

export default {
    command: ["rvo"],
    description: "View messages/media 1x",
    example: "",
    name: "rvo",
    tags: "tools",

    run: async(m, { sock, args }) => {
		if (!m.quoted) throw 'where\'s message?'
    let msg = m.quoted.message
    let type = Object.keys(msg)[0]
    let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (/video/.test(type)) {
        return sock.sendMessage(m.chat, {
                    video: buffer,
                    caption: msg[type].caption || ''
                }, {
                    quoted: m
                })
    } else if (/image/.test(type)) {
        return sock.sendMessage(m.chat, {
                    image: buffer,
                    caption: msg[type].caption || ''
                }, {
                    quoted: m
                })
        }
    }
}
