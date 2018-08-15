async function removeVideos(indicator) {
    const localVideoInform = videoInform.bind(null, indicator);
    const myData = await req('users.get');
    const myId = myData[0].id;
    let offset = 0;
    let videosRemoved = 0;
    for (; ;) {
        const videos = await req('video.get', {
            owner_id: myId,
            count: 100,
            offset
        });
        if (videos.items.length === 0) break;
        for (let n in videos.items) {
            const video = videos.items[n];
            await req('video.delete', {
                owner_id: video.owner_id,
                video_id: video.id,
                target_id: myId
            });
            videosRemoved++;
            localVideoInform('Удалено видео: ' + videosRemoved);
        }
        offset += videos.items.length;
    }
    localVideoInform('Все видео удалены!');
    await helpers.wait(1000);
}

function videoInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}