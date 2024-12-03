/* 
- YTMP3 By Angel-OFC 
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
/* import { yt5s } from '@sl-code-lords/youtube-dl';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    // Verificar si el mensaje citado existe
    if (!m.quoted) {
        await m.react('✖️');
        return conn.reply(m.chat, '*`Etiqueta el mensaje que contenga el resultado del Play.🤍`*', m);
    }

    // Verificar si el mensaje citado contiene el formato esperado
    if (!m.quoted.text || !m.quoted.text.includes("*`【Y O U T U B E - P L A Y】`*")) {
        await m.react('✖️');
        return conn.reply(m.chat, '*`Etiqueta el mensaje que contenga el resultado del Play.🤍`*', m);
    }

    // Extraer URL(s) de YouTube
    let urls = m.quoted.text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9_-]+)/gi);
    if (!urls) {
        await m.react('✖️');
        return conn.reply(m.chat, '*`Resultado no Encontrado.🤍`*', m);
    }

    // Tomar la primera URL encontrada
    let videoUrl = urls[0];
    await m.react('🕓');

    try {
        // Obtener datos del video usando el scraper
        let vid = await yt5s(videoUrl);

        if (!vid || !vid.status || !vid.result) {
            throw new Error('Error al obtener los datos del video');
        }

        // Extraer información del resultado
        let { title, uploader, thumbnail, audio } = vid.result;

        // Validar la calidad de audio deseada
        if (!audio || !audio['128'] || typeof audio['128'].url !== 'function') {
            throw new Error('No se encontró audio en calidad 128kbps');
        }

        // Obtener URL del audio
        let audioUrl = await audio['128'].url();

        // Enviar el archivo de audio
        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mp4",
            fileName: `${title}.mp3`,
            quoted: m,
            contextInfo: {
                forwardingScore: 200,
                isForwarded: true,
                externalAdReply: {
                    showAdAttribution: false,
                    title: title,
                    body: uploader,
                    mediaType: 2,
                    sourceUrl: videoUrl,
                    thumbnail: await (await fetch(thumbnail)).buffer()
                }
            }
        }, { quoted: m });

        // Reaccionar con éxito
        await m.react('✅');
    } catch (e) {
        console.error('Error en el handler:', e);
        await m.react('✖️');
        return conn.reply(m.chat, '*`Hubo un error al procesar la descarga.🤍`*', m);
    }
};

handler.help = ['Audio'];
handler.tags = ['downloader'];
handler.customPrefix = /^(Audio|audio)/;
handler.command = new RegExp;

export default handler; */









import { ytmp3 } from 'ruhend-scraper';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, isPrems, isOwner, usedPrefix, command }) => {
    if (!m.quoted) {
        return conn.reply(m.chat, `*\`Etiqueta el mensaje que contenga el resultado del Play.🤍\`*`, m, fake)
            .then(_ => m.react('✖️'));
    }

    if (!m.quoted.text.includes("*\`【Y O U T U B E - P L A Y】\`*")) {
        return conn.reply(m.chat, `*\`Etiqueta el mensaje que contenga el resultado del Play.🤍\`*`, m, fake)
            .then(_ => m.react('✖️'));
    }

    let urls = m.quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'));

    if (!urls) {
        return conn.reply(m.chat, `*\`Resultado no Encontrado.🤍\`*`, m, fake).then(_ => m.react('✖️'));
    }

    if (urls.length < parseInt(text)) {
        return conn.reply(m.chat, `*\`Resultado no Encontrado.🤍\`*`, m, fake).then(_ => m.react('✖️'));
    }

    let user = global.db.data.users[m.sender];

    await m.react('🕓');
    try {
        let videoUrl = urls[0];
        let { title, audio, author, description, duration, views, upload, thumbnail } = await ytmp3(videoUrl);

       await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: "audio/mp4", fileName: title + '.mp3', quoted: m, contextInfo: {
'forwardingScore': 200,
'isForwarded': true,
externalAdReply:{
showAdAttribution: false,
title: `${title}`,
body: `${author}`,
mediaType: 2, 
sourceUrl: ' ',
thumbnail: await (await fetch(thumbnail)).buffer()}}}, { quoted: m })
        await m.react('✅');
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `*\`Hubo un error al procesar la descarga.🤍\`*`, m, fake).then(_ => m.react('✖️'));
    }
};

handler.help = ['Audio'];
handler.tags = ['downloader'];
handler.customPrefix = /^(Audio|audio)/;
handler.command = new RegExp;

export default handler;
