import chalk from 'chalk'
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'
import fs from 'fs'
import axios from 'axios'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import qs from 'qs'
import { isUrl, someincludes } from './func.js'
import got from 'got'
import ytdl from 'ytdl-core'
import { fileTypeFromBuffer } from 'file-type'
import FormData from "form-data"
import { Blob } from "formdata-node"
import Jimp from 'jimp'

/** internet **/
export async function cekKhodam(nama) {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://khodam.vercel.app/v2?nama=${nama}`).then(({ data }) => {
            const $ = cheerio.load(data);
            const khodam = $('.__className_cad559').text().split('Cek Khodam')[1];
            const result = {
                nama,
                khodam,
                share: `https://khodam.vercel.app/vy2?nama=${nama}&share`
            }
            resolve(result);
        }).catch(reject);
    })
}

export async function cuaca(term) {
  const response = await fetch(`https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(term)}&key=96f59ob69a32facbb34b2tdb5d2e7405`);
  const data = await response.json();
  return data;
};

/** download **/
export async function tiktokDl(url) {
  let response = await axios.post("https://www.tikwm.com/api", {}, {
      params: {
        url: url,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1,
      },
    },
  );
  return response.data;
}

export async function tiktokDlV2(urls) {
    const url = 'https://tiktokio.com/api/v1/tk-htmx';
    const data = new URLSearchParams({ 
      prefix: 'dtGslxrcdcG9raW8uY29t',
      vid: urls 
    });

    const config = {
        headers: {
            'HX-Request': 'true',
            'HX-Trigger': 'search-btn',
            'HX-Target': 'tiktok-parse-result',
            'HX-Current-URL': 'https://tiktokio.com/id/',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    try {
        let { data: res } = await axios.post(url, data, config);
        let $ = cheerio.load(res);
        const urls = [];
        let media;

        const links = {
            creator: '@Im-Dims',
            status: 200,
            isSlide: false,
            title: $('h2').text(),
            media: media
        };

        $('.download-item img').each((index, element) => {
            const url = $(element).attr('src');
            urls.push(url);
            links.isSlide = true;
        });

        if (urls.length === 0) {
            media = {};
            $('div.tk-down-link').each(function(index, element) {
                const linkType = $(this).find('a').text().trim();
                const url = $(this).find('a').attr('href');

                if (linkType === 'Download watermark') {
                    media['watermark'] = url;
                } else if (linkType === 'Download Mp3') {
                    media['mp3'] = url;
                } else if (linkType === 'Download without watermark') {
                    media['no_wm'] = url;
                } else if (linkType === 'Download without watermark (HD)') {
                    media['hd'] = url;
                }
            });
        } else {
            media = urls;
        }
            links.media = media;

        return links
    } catch (e) {
        return {
            status: 404,
            msg: e
        }
    }
}

export async function tiktokSearch(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': global.api.useragent
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      });
      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("Tidak ada video ditemukan.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee]; 

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export async function fbDl(url) {
  const data = {
    k_exp: '',
    k_token: '',
    q: url,
    lang: 'id',
    web: 'fdownloader.net',
    v: 'v2',
    w: ''
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*'
    }
  };

  let { data: res } = await axios.post('https://v3.fdownloader.net/api/ajaxSearch?lang=id', qs.stringify(data), config);

  let $ = cheerio.load(res.data);
  let result = [];
  let duration = $("div.clearfix > p").text().trim();

  $("div.tab__content").find("tbody > tr").each((index, element) => {
    const quality = $(element).find("td.video-quality").text();
    const videoUrl = $(element).find("td > a").attr("href");
    if (quality && videoUrl) {
      result.push({
        quality: quality,
        url: videoUrl
      });
    }
  });

  return {
    duration: duration,
    result: result
  };
}

export async function igDl(url) {
  return new Promise(async (resolve) => {
  try {
  if (!url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) && !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) return resolve({ developer: '@Alia Uhuy', status: false, msg: `Link Url not valid` })
  function decodeSnapApp(args) {
  let [h, u, n, t, e, r] = args
  // @ts-ignore
  function decode (d, e, f) {
  const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
  let h = g.slice(0, e)
  let i = g.slice(0, f)
  // @ts-ignore
  let j = d.split('').reverse().reduce(function (a, b, c) {
  if (h.indexOf(b) !== -1)
  return a += h.indexOf(b) * (Math.pow(e, c))
  }, 0)
  let k = ''
  while (j > 0) {
  k = i[j % f] + k
  j = (j - (j % f)) / f
  }
  return k || '0'
  }
  r = ''
  for (let i = 0, len = h.length; i < len; i++) {
  let s = ""
  // @ts-ignore
  while (h[i] !== n[e]) {
  s += h[i]; i++
  }
  for (let j = 0; j < n.length; j++)
  s = s.replace(new RegExp(n[j], "g"), j.toString())
  // @ts-ignore
  r += String.fromCharCode(decode(s, e, 10) - t)
  }
  return decodeURIComponent(encodeURIComponent(r))
  }
  function getEncodedSnapApp(data) {
  return data.split('decodeURIComponent(escape(r))}(')[1]
  .split('))')[0]
  .split(',')
  .map(v => v.replace(/"/g, '').trim())
  }
  function getDecodedSnapSave (data) {
  return data.split('getElementById("download-section").innerHTML = "')[1]
  .split('"; document.getElementById("inputData").remove(); ')[0]
  .replace(/\\(\\)?/g, '')
  }
  function decryptSnapSave(data) {
  return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)))
  }
  const html = await got.post('https://snapsave.app/action.php?lang=id', {
  headers: {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'content-type': 'application/x-www-form-urlencoded','origin': 'https://snapsave.app',
  'referer': 'https://snapsave.app/id',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
  },
  form: { url }
  }).text()
  const decode = decryptSnapSave(html)
  const $ = cheerio.load(decode)
  const results = []
  if ($('table.table').length || $('article.media > figure').length) {
  const thumbnail = $('article.media > figure').find('img').attr('src')
  $('tbody > tr').each((_, el) => {
  const $el = $(el)
  const $td = $el.find('td')
  const resolution = $td.eq(0).text()
  let _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick')
  const shouldRender = /get_progressApi/ig.test(_url || '')
  if (shouldRender) {
  _url = /get_progressApi\('(.*?)'\)/.exec(_url || '')?.[1] || _url
  }
  results.push({
  resolution,
  thumbnail,
  url: _url,
  shouldRender
  })
  })
  } else {
  $('div.download-items__thumb').each((_, tod) => {
  const thumbnail = $(tod).find('img').attr('src')
  $('div.download-items__btn').each((_, ol) => {
  let _url = $(ol).find('a').attr('href')
  if (!/https?:\/\//.test(_url || '')) _url = `https://snapsave.app${_url}`
  results.push({
  thumbnail,
  url: _url
  })
  })
  })
  }
  if (!results.length) return resolve({ developer: '@dims.js - Im-Dims', status: false, msg: `Error` })
  return resolve({ developer: '@dims.js - Im-Dims', status: true, data: results })
  } catch (e) {
  return resolve({ developer: '@dims.js - Im-Dims', status: false, msg: e.message })
  }
  })
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedDuration = [];

    if (hours > 0) {
        formattedDuration.push(`${hours} hour`);
    }
    if (minutes > 0) {
        formattedDuration.push(`${minutes} minute`);
    }
    if (remainingSeconds > 0) {
        formattedDuration.push(`${remainingSeconds} second`);
    }
    return formattedDuration.join(' ');
}

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 B';
    }
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

export async function ytv(query, quality = 134) {
    try {
        const videoInfo = await ytdl.getInfo(query, {
            lang: 'id'
        });
        const format = ytdl.chooseFormat(videoInfo.formats, {
            format: quality,
            filter: 'videoandaudio'
        })
        let response = await fetch(format.url, {
            method: 'HEAD'
        });
        let contentLength = response.headers.get('content-length');
        let fileSizeInBytes = parseInt(contentLength);
        return {
            title: videoInfo.videoDetails.title,
            thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
            date: videoInfo.videoDetails.publishDate,
            duration: formatDuration(videoInfo.videoDetails.lengthSeconds),
            channel: videoInfo.videoDetails.ownerChannelName,
            quality: format.qualityLabel,
            contentLength: formatBytes(fileSizeInBytes),
            description: videoInfo.videoDetails.description,
            videoUrl: format.url
        }
    } catch (error) {
        throw error
    }
}

export async function githubStalk(user) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.github.com/users/'+user).then(({ data }) => {
            let hasil = {
                username: data.login,
                nickname: data.name,
                bio: data.bio,
                id: data.id,
                nodeId: data.node_id,
                profile_pic: data.avatar_url,
                url: data.html_url,
                type: data.type,
                admin: data.site_admin,
                company: data.company,
                blog: data.blog,
                location: data.location,
                email: data.email,
                public_repo: data.public_repos,
                public_gists: data.public_gists,
                followers: data.followers,
                following: data.following,
                ceated_at: data.created_at,
                updated_at: data.updated_at
            }
            resolve(hasil)
        })
    })
}

export async function yta(videoUrl) {
    return new Promise(async (resolve, reject) => {
        try {
            const searchParams = new URLSearchParams();
            searchParams.append('query', videoUrl);
            searchParams.append('vt', 'mp3');
            const searchResponse = await axios.post('https://tomp3.cc/api/ajax/search', searchParams.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Accept': '*/*',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );
            if (searchResponse.data.status !== 'ok') {
                throw new Error('Failed to search for the video.');
            }            
            const videoId = searchResponse.data.vid;
            const videoTitle = searchResponse.data.title;
            const mp4Options = searchResponse.data.links.mp4;
            const mp3Options = searchResponse.data.links.mp3;
            const mediumQualityMp4Option = mp4Options[136]; 
            const mp3Option = mp3Options['mp3128']; 
            const mp4ConvertParams = new URLSearchParams();
            mp4ConvertParams.append('vid', videoId);
            mp4ConvertParams.append('k', mediumQualityMp4Option.k);
            const mp4ConvertResponse = await axios.post('https://tomp3.cc/api/ajax/convert', mp4ConvertParams.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Accept': '*/*',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );
            if (mp4ConvertResponse.data.status !== 'ok') {
                throw new Error('Failed to convert the video to MP4.');
            }
            const mp4DownloadLink = mp4ConvertResponse.data.dlink;
            const mp3ConvertParams = new URLSearchParams();
            mp3ConvertParams.append('vid', videoId);
            mp3ConvertParams.append('k', mp3Option.k);
            const mp3ConvertResponse = await axios.post('https://tomp3.cc/api/ajax/convert', mp3ConvertParams.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Accept': '*/*',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );
            if (mp3ConvertResponse.data.status !== 'ok') {
                throw new Error('Failed to convert the video to MP3.');
            }
            const mp3DownloadLink = mp3ConvertResponse.data.dlink;
            resolve({
                title: videoTitle,
                mp4DownloadLink,
                mp3DownloadLink
            });
        } catch (error) {
            reject('Error: ' + error.message);
        }
    });
}

/** anime **/
export async function animeLatest() {
  return new Promise(async (resolve, reject) => {
    try {
      const url = "https://samehadaku.email/anime-terbaru/";
      const html = await fetch(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        },
      });

      if (!html.ok) return reject("Website Down");
      const $ = cheerio.load(await html.text());
      const ul = $("div.post-show > ul").children("li");
      const data = {
        total: 0,
        anime: [],
      };

      for (let el of ul) {
        data.anime.push({
          title: $(el)
            .find("h2.entry-title")
            .text()
            .trim()
            .split(" Episode")[0],
          thumbnail: $(el).find("div.thumb > a > img").attr("src"),
          postedBy: $(el)
            .find('span[itemprop="author"] > author')
            .text()
            .trim(),
          episode: $(el).find("span").eq(0).find("author").text().trim(),
          release: $(el)
            .find('span[itemprop="author"]')
            .next()
            .contents()
            .eq(3)
            .text()
            .split(": ")[1]
            .trim(),
          link: $(el).find("a").attr("href"),
        });
      }

      data.total = data.anime.length;

      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

export async function samehadakuDl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!/samehadaku\.email/gi.test(url)) return reject("Invalid URL!");
      const html = await fetch(url, {
        method: "GET",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        },
      });

      if (!html.ok) return reject("Error Fetching");
      const $ = cheerio.load(await html.text());
      const data = {
        title: $('h1[itemprop="name"]').text().trim(),
        link : url,
        downloads: [],
      };

      data.downloads = await Promise.all(
        $("div#server > ul > li").map(async (i, el) => {
          const v = {
            name: $(el).find("span").text().trim(),
            post: $(el).find("div").attr("data-post"),
            nume: $(el).find("div").attr("data-nume"),
            type: $(el).find("div").attr("data-type"),
            link: "",
          };

          const A = new FormData();
          A.append("action", "player_ajax");
          A.append("post", v.post);
          A.append("nume", v.nume);
          A.append("type", v.type);

          v.link = await fetch("https://samehadaku.email/wp-admin/admin-ajax.php", {
              method: "POST",
              headers: {
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                origin: "https://samehadaku.email",
              },
              body: A,
            }
          )
            .then((v) => v.text())
            .then((v) => cheerio.load(v)("iframe").attr("src"));

          return v;
        })
      );

      return resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

/** ai **/
export async function remini(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		    Form.append("model_version", 1, { "Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit({
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res.on("data", function (chunk, resp) {
				  data.push(chunk);
				}).on("end", () => {
				  resolve(Buffer.concat(data));
				});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}

/**
 * @param {{
 * prompt : String,
 * negative : String,
 * style : "(none)"|"Cinematic"|"Photographic"|"Anime"|"Manga"|"Digital Art"|"Pixel art"|"Fantasy art"|"Neonpunk"|"3D Model",
 * sampler : "DDIM"|"Euler a"|"Euler"|"DPM++ 2M Karras"|"DPM++ 2M SDE Karras"|"DPM++ SDE Karras",
 * quality : "(none)"|"Light"|"Standard"|"Heavy",
 * width : Number,
 * height : Number,
 * ratio : "Custom"|"640 x 1536"|"832 x 1216"|"1024 x 1024"|"1152 x 896"|"1344 x 768"|"768 x 1344"|"896 x 1152"|"1216 x 832"|"1536 x 640"
 * }} [options={}]
**/
export async function animagine(options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        prompt = "Cute Cat",
        negative = "Not Real",
        style = "Anime",
        sampler = "Euler a",
        ratio = "896 x 1152",
        quality = "Standard",
        width = "1024",
        height = "1024",
      } = options;
      const BASE_URL = "https://linaqruf-animagine-xl.hf.space";
      const session_hash = Math.random().toString(36).substring(2);

      // ? Checker
      if (!/\(None\)|Cinematic|Photographic|Anime|Manga|Digital Art|Pixel art|Fantasy art|Neonpunk|3D Model/.test(style))
        style = "Anime";
      if (!/DDIM|Euler a|Euler|DPM\+\+ 2M Karras|DPM\+\+ 2M SDE Karras|DPM\+\+ SDE Karras/.test(sampler))
        sampler = "Euler a";
      if (!/\(none\)|Light|Standard|Heavy/.test(quality)) 
        quality = "Heavy";
      if (!/Custom|640 x 1536|832 x 1216|1024 x 1024|1152 x 896|1344 x 768|768 x 1344|896 x 1152|1216 x 832|1536 x 640/.test(ratio))
        ratio = "896 x 1152";
        
      if (quality === "Custom")
        async () => {
          if (!width || isNaN(width) || +width > 2048)
            return reject("Enter Valid Image Width Below 2048");
          if (!height || isNaN(height) || +height > 2048)
            return reject("Enter Valid Image Height Below 2048");
        };

      // ? Headers
      const headers = {
        origin: BASE_URL,
        referer: BASE_URL + "/?",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "content-type": "application/json",
      };

      // ? Token
      const { data: token } = await fetch(BASE_URL + "/run/predict", {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: [0, true],
          event_data: null,
          fn_index: 4,
          session_hash,
          trigger_id: 6,
        }),
      }).then((v) => v.json());

      // ? Join
      await fetch(BASE_URL + "/queue/join?", {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: [
            prompt,
            negative,
            token[0],
            width,
            height,
            7,
            28, // ? Step
            sampler, // ? Sampler
            ratio, // ? Aspect ratio
            style, // ? Style
            quality, // ? Quality
            false,
            0.55,
            1.5,
            true,
          ],
          event_data: null,
          fn_index: 5,
          session_hash,
          trigger_id: 7,
        }),
      }).then((v) => v.json());

      // ? Generate Images
      const stream = await fetch(
        BASE_URL + "/queue/data?" + new URLSearchParams({ session_hash })
      ).then((v) => v.body);

      // ? Handle Stream
      stream.on("data", (v) => {
        const data = JSON.parse(v.toString().split("data: ")[1]);
        if (data.msg !== "process_completed") return;
        if (!data.success) return reject("Image Generation Failed!");
        return resolve(data.output.data[0]);
      });
    } catch (e) {
      reject(e);
    }
  });
}
  
export async function stableDiff(prompt, negative = "") {
  return new Promise(async (resolve, reject) => {
    try {
      if (!prompt) return reject("Enter Prompt!");
      const res = await fetch("https://requesteracessibili.joaovitorkas13.workers.dev", {
          method: "POST",
          headers: {
            authority: "requesteracessibili.joaovitorkas13.workers.dev",
            "content-type": "application/json",
            origin: "https://just4demo24.blogspot.com",
            referer: "https://just4demo24.blogspot.com/",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          },
          body: JSON.stringify({
            prompt: prompt,
            negative_prompt: negative,
            sync_mode: 1,
          }),
        }
      ).then((v) => v.json());

      return resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

/** search **/
export async function npmSearch(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch("https://www.npmjs.com/search/suggestions?" + new URLSearchParams({ q: query })).then((v) => v.json());
      if (!res.length) return reject("Packages Not Found");
      return resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}
  
export async function npmSearch2(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch("https://www.npmjs.com/search?" + new URLSearchParams({ q: query }), {
          method: "GET",
          headers: {
            Referer: "https://www.npmjs.com/",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "X-Spiferack": 1,
          },
        }
      ).then((v) => v.json());
      if (!res.total) return reject("Packages Not Found");

      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}
  
export async function npm(packageName) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch("https://www.npmjs.com/package/" + packageName.replace(" "), {
          method: "GET",
          headers: {
            Referer: "https://www.npmjs.com/",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "X-Spiferack": 1,
          },
        }
      ).then((v) => v.json());

      if (!res.package) return reject("Package Not Found");
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

/** uploader **/
export async function uploadSSA(buffer) {
  try {
  const { ext } = await fileTypeFromBuffer(buffer);
  let form = new FormData();
  form.append("file", buffer, "tmp." + ext);
    const { data } = await axios.post("https://cdn.ssateam.my.id/upload", form, {
        headers: {
          accept: "application/json",
          ...form.getHeaders(), 
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function uploadPomf1(buffer) {
  try {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || {};
    let form = new FormData();
    const blob = new Blob([buffer.toArrayBuffer()], { type: mime });
    form.append('files[]', blob, 'tmp.' + ext);
      let res = await fetch('https://pomf2.lain.la/upload.php', {
        method: 'POST',
        body: form
      });
    let json = await res.json();
    if (!json.success) throw json;
    return json;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadPomf2(media) {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('files[]', media, { 
      filename: new Date() * 1 + '.jpg' 
    });
    await axios.post('https://pomf2.lain.la/upload.php', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      resolve(e?.response)
    });
  })
}

/** short **/
export async function shortlink(apikey, command, out, custom) {
	let anu, url
	try {
		if (/ulvis/.test(command)) {
			anu = await (await fetch(`https://ulvis.net/API/write/get?url=${out}&custom=${custom || ''}&type=json`)).json()
			if (!anu.success) return anu.error.msg
			anu = anu.data
			if (anu.status) return anu.status
			url = anu.url
		} else if (/shrtco/.test(command)) {
			anu = await (await fetch(`https://api.shrtco.de/v2/shorten?url=${out}`)).json()
			if (!anu.ok) return anu.error
			url = anu.result.full_short_link
		} else if (/owovc/.test(command)) {
			anu = await (await fetch('https://owo.vc/api/v2/link', {
				method: 'POST',
				headers: {
					'accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					link: out,
				    generator: 'owo',
					metadata: 'OWOIFY'
				}),
			})).json()
			if (anu.error) return anu.message
			url = anu.id
		} else if (/cuttly/.test(command)) {
			anu = await (await fetch(`https://cutt.ly/api/api.php?key=${apikey.cuttly}&short=${out}&name=${custom || ''}`)).json()
			anu = anu.url
			if (!anu.shortLink) return `error code ${anu.status == 3 ? ' 3 : alias already used' : anu.status}`
			url = anu.shortLink
		} else if (/tinyurl/.test(command)) {
			anu = await (await fetch('https://api.tinyurl.com/create', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${apikey.tinyurl}`,
					'accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					url: out,
					domain: 'tinyurl.com',
					alias: `${custom || ''}`
				})
			})).json()
			url = anu
			if (anu.errors.length > 0) return anu.errors[0]
			url = anu.data.tiny_url
		} else if (/tinycc/.test(command)) {
			anu = await (await fetch('https://tiny.cc/tiny/api/3/urls/', {
				method: 'POST',
				headers: {
					'Authorization': `Basic ${apikey.tinycc}`,
					'accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ urls: [{
					long_url: out,
					custom_hash: `${custom || ''}`
					}]
				})
			})).json()
			if (!anu.urls) return anu.error.message
			if (!anu.urls[0].short_url) return anu.urls[0].error.message
			url = anu.urls[0].short_url_with_protocol
		}
	} catch (e) {
		console.log(e)
	}
	return url ? url : 'Internal server error.'
}

/** realod file **/
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'scraper.js"))
  import(`${file}?update=${Date.now()}`)
})