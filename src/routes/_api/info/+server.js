import { error, json } from "@sveltejs/kit";
import { youtube } from "@googleapis/youtube";

import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

/**
 * @type {import("./$types").RequestHandler}
 */
export const POST = async ({ request }) => {
    const { videoId } = await request.json();

    const youtubeClient = youtube({
        auth: import.meta.env.VITE_GOOGLE_API_KEY,
        version: "v3",
    });

    const videoResponse = await youtubeClient.videos.list({
        part: 'snippet,contentDetails,statistics',
        id: videoId
    });

    if (videoResponse?.data?.items == null || videoResponse?.data?.items?.length === 0) {
        return error(404, "Video not found");
    }

    const channelId = videoResponse.data.items[0].snippet.channelId;

    const channelResponse = await youtubeClient.channels.list({
        part: 'snippet,contentDetails,statistics',
        id: channelId
    });

    const videoInfo = videoResponse.data.items[0];
    const channelInfo = channelResponse.data.items[0];


    dayjs.locale("fr");
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    return json({
        thumbnail: await imageToBase64(videoInfo.snippet.thumbnails?.maxres?.url || videoInfo.snippet.thumbnails.high.url || videoInfo.snippet.thumbnails.default.url),
        channelLogo: await imageToBase64(channelInfo.snippet.thumbnails.default.url),
        title: videoInfo.snippet.title,
        channel: channelInfo.snippet.title,
        views: formatViews(videoInfo.statistics.viewCount),
        time: dayjs(videoInfo.snippet.publishedAt).fromNow(),
        duration: dayjs.duration(videoInfo.contentDetails.duration).format("mm:ss"),
    })
};

const formatViews = (views) => {
    const abbreviations = {
        'k': 1000,
        'm': 1000000,
        'b': 1000000000
    };

    for (const symbol in abbreviations) {
        if (views >= abbreviations[symbol]) {
            const abbreviatedViews = views / abbreviations[symbol];

            const roundedViews = Math.round(abbreviatedViews * 10) / 10;
            return `${roundedViews} ${symbol}`;
        }
    }

    return views.toString();
}


const imageToBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const imageData = await response.arrayBuffer();

        const base64Image = Buffer.from(imageData).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        console.error('Une erreur s\'est produite lors du traitement de l\'image :', error);
        throw error;
    }
}
