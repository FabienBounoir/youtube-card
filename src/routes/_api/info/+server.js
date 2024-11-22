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

    /**
     * @type {import("googleapis").youtube_v3.Schema$VideoListResponse}
     */
    const videoResponse = await youtubeClient.videos.list({
        part: ["snippet", "contentDetails", "statistics", "liveStreamingDetails"],
        id: videoId
    });


    if (videoResponse?.data?.items == null || videoResponse?.data?.items?.length === 0) {
        return error(404, "Video not found");
    }

    const channelId = videoResponse.data.items[0].snippet.channelId;

    /**
     * @type {import("@googleapis").youtube_v3.Schema$ChannelListResponse}
     */
    const channelResponse = await youtubeClient.channels.list({
        part: ["snippet", "contentDetails", "statistics"],
        id: channelId
    });

    const videoInfo = videoResponse.data.items[0];
    const channelInfo = channelResponse.data.items[0];


    dayjs.locale("fr");
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    sendStatistics(channelInfo, videoInfo)

    return json({
        thumbnailUrl: videoInfo?.snippet?.thumbnails?.maxres?.url || videoInfo?.snippet?.thumbnails?.high?.url || videoInfo?.snippet?.thumbnails?.default?.url,
        thumbnail: await imageToBase64(videoInfo?.snippet?.thumbnails?.maxres?.url || videoInfo?.snippet?.thumbnails?.high?.url || videoInfo?.snippet?.thumbnails?.default?.url),
        channelLogoUrl: channelInfo?.snippet.thumbnails?.default?.url,
        channelLogo: await imageToBase64(channelInfo?.snippet.thumbnails?.default?.url),
        title: videoInfo?.snippet?.title || "Title not found",
        channel: channelInfo?.snippet?.title || "Channel not found",
        views: formatViews(videoInfo?.statistics.viewCount),
        time: dayjs(videoInfo?.snippet?.publishedAt).fromNow(),
        duration: dayjs.duration(videoInfo?.contentDetails?.duration).format("mm:ss"),
        isLive: videoInfo?.snippet?.liveBroadcastContent === "live",
        viewers: formatViews(videoInfo?.liveStreamingDetails?.concurrentViewers) || 0,
        isUpcoming: videoInfo?.snippet?.liveBroadcastContent === "upcoming",
        startDate: formatDate(videoInfo?.liveStreamingDetails?.scheduledStartTime)
    })
};

/**
 * 
 * @param {string} dateString 
 * @returns 
 */
function formatDate(dateString) {
    const date = dayjs(dateString);
    return date.format('DD/MM/YYYY HH:mm');
}

/**
 * 
 * @param {any} channel 
 * @param {any} video 
 */
function sendStatistics(channel, video) {
    if (!import.meta.env.VITE_STATISTICS) return console.warn("No statistics URL found");
    try {
        fetch(import.meta.env.VITE_STATISTICS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content": null,
                "embeds": [
                    {
                        "description": `## [${video?.snippet?.title || "Title not found"}](https://www.youtube.com/watch?v=${video?.id})`,
                        "color": 14307151,
                        "fields": [],
                        "image": {
                            "url": video?.snippet?.thumbnails?.maxres?.url || video?.snippet?.thumbnails?.high?.url || video?.snippet?.thumbnails?.default?.url
                        },
                        "footer": {
                            "text": `📅 ${formatDate(video?.liveStreamingDetails?.scheduledStartTime)} | ${formatViews(video?.statistics.viewCount)}`
                        },
                    }
                ],
                "username": channel?.snippet?.title || "Channel not found",
                "avatar_url": channel?.snippet?.thumbnails?.default?.url || null,
                "attachments": []
            })
        })
            .catch(error => {
                console.error('Error while sending statistics :', error);
            });
    } catch (error) {
        console.error('Error while sending statistics :', error);
    }
}

/**
 * 
 * @param {string} views 
 * @returns 
 */
const formatViews = (views) => {
    /**
     * @type {Record<string, number>}
     */
    const abbreviations = {
        'Md': 1000000000,
        'M': 1000000,
        'k': 1000
    };

    for (const symbol in abbreviations) {
        if (views >= abbreviations[symbol]) {
            const abbreviatedViews = views / abbreviations[symbol];

            const roundedViews = Math.round(abbreviatedViews * 10) / 10;
            return `${roundedViews} ${symbol}`;
        }
    }

    return views || "0";
}

/**
 * 
 * @param {string} url 
 * @returns 
 */
const imageToBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const imageData = await response.arrayBuffer();

        const base64Image = Buffer.from(imageData).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        console.error('Error while converting image to base64 :', error);
        throw error;
    }
}
