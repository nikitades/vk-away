async function removeFromAnswersAll(indicator) {
    answersInform = answersInform.bind(null, indicator);
    try {
        const answers = await req('notifications.get', {
            count: 100,
            start_time: helpers.getBigBangTime()
        });
        const myData = await req('users.get');
        const myId = myData[0].id;
        for (let i in answers.items) {
            let answerItem = answers.items[i];
            switch (answerItem.type) {
                case 'reply_comment':
                    answersInform('Удаляем комментарии из ответа на коммент...');
                    await remove.myCommentsFromPost(answerItem.parent.post.to_id, answerItem.parent.post.id, myId);
                    break;
                case 'reply_comment_photo':
                    answersInform('Удаляем комментарии под фото...');
                    await remove.myCommentsFromPhoto(answerItem.parent.photo.owner_id, answerItem.parent.photo.id, myId);
                    break;
                case 'reply_comment_video':
                    answersInform('Удаляем комментарии под видео...');
                    await remove.myCommentsFromVideo(answerItem.parent.video.owner_id, answerItem.parent.video.id, myId);
                    break;
                case 'reply_topic':
                    answersInform('Удаляем комментарии в беседе...');
                    await remove.myCommentsFromBoard(answerItem.parent.topic.owner_id, answerItem.parent.topic.id, myId);
                    break;
                case 'like_comment':
                    answersInform('Удаляем комментарии из лайка под постом...');
                    await remove.myCommentsFromPost(answerItem.parent.post.to_id, answerItem.parent.post.id, myId);
                    break;
                case 'like_comment_photo':
                    answersInform('Удаляем комментарии из лайка под фото...');
                    await remove.myCommentsFromPhoto(answerItem.parent.photo.owner_id, answerItem.parent.photo.id, myId);
                    break;
                case 'like_comment_video':
                    answersInform('Удаляем комментарии из лайка под видео...');
                    await remove.myCommentsFromVideo(answerItem.parent.video.owner_id, answerItem.parent.video.id, myId);
                    break;
                case 'like_comment_topic':
                    answersInform('Удаляем комментарии из лайка в беседе...');
                    await remove.myCommentsFromBoard(answerItem.parent.topic.owner_id, answerItem.parent.topic.id, myId);
                    break;
            }
        }
        answersInform('Удаление всех комментариев из упоминаний завершено!');
        await helpers.wait(1000);
    } catch (e) {
        if (e.message) console.error(e.message);
        if (e.stack) console.error(e.stack);
    }
}

function answersInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}