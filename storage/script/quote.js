import axios from "axios";

async function quote(text, avatar, name) {
  const json = {
    type: "quote",
    format: "png",
    backgroundColor: "#FFFFFF",
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: name,
          photo: {
            url: avatar,
          },
        },
        text: text,
        replyMessage: {},
      },
    ],
  };
  const res = await axios.post("https://quotly.netorare.codes/generate", json, {
    headers: { "Content-Type": "application/json" },
  });
  const buffer =  Buffer.from(res.data.result.image, "base64")
  return buffer;
}

    
    
export { quote };
