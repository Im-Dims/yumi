let handler = m => m
handler.all = async function (m, { isBotAdmin }) {
// auto clear ketika terdapat pesan yang tidak dapat dilihat di wa desktop
  if (m.messageStubType === 68) {
    let log = { 
      key: m.key, 
      content: m.msg, 
      sender: m.sender 
    }
    let crt = `Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿
Strava 错误就在这里，您可以逃脱

😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿

Strava 错误就在这里，您可以逃脱
😈Strava 错误就在这里，您可以逃脱👇
Strava 错误就在这里，您可以逃脱🍆
Strava 错误就在这里，您可以逃脱🙏🏿`
    await this.reply(m.chat, crt, m).catch(console.log)
  }
}

export default handler 