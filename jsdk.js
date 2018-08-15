window.callbacks = {};
window.cbScripts = {};

function getCallbackName() {
    return 'cb_' + Math.random().toString().slice(2, 10);
}

const helpers = {
    getGroupId(id) {
        if (id.toString()[0] === '-') return id.toString().slice(1);
        return id;
    },
    isGroup(id) {
        return id.toString()[0] === '-';
    },
    getSleepTime(length = null) {
        let base = 300;
        switch (length) {
            case 'big':
                base = 700;
                break;
            case 'small':
                base = 150;
                break;
        }
        return (Math.random() * 400) + base;
    },
    wait(time) {
        return new Promise(res => {
            setTimeout(res, time);
        });
    },
    getBigBangTime() {
        return 107291520;
    }
};

const remove = {
    myCommentsFromPost: async (owner_id, post_id, my_id) => {
        return new Promise(async (res, rej) => {
            let offset = 0;
            for (; ;) {
                console.log({offset});
                let allPostComments = await req('wall.getComments', {
                    owner_id,
                    post_id,
                    count: 100,
                    offset
                });
                if (allPostComments.items.length === 0) break;
                for (let i in allPostComments.items) {
                    let postCommentItem = allPostComments.items[i];
                    if (postCommentItem.from_id === my_id) {
                        await req('wall.deleteComment', {
                            owner_id: owner_id,
                            comment_id: postCommentItem.id
                        }).catch(rej);
                    }
                }
                offset += 100;
            }
            res();
        })
    },
    myCommentsFromBoard: (owner_id, post_id, my_id) => {
        return new Promise(async (res, rej) => {
            let offset = 0;
            for (; ;) {
                console.log({offset});
                let allThreadComments = await req('board.getComments', {
                    'group_id': helpers.getGroupId(owner_id),
                    'topic_id': post_id,
                    'count': 100,
                    offset
                });
                if (allThreadComments.items.length === 0) break;
                for (let i in allThreadComments.items) {
                    let threadComment = allThreadComments.items[i];
                    if (threadComment.from_id === my_id) {
                        await req('board.deleteComment', {
                            group_id: helpers.getGroupId(owner_id),
                            topic_id: post_id,
                            comment_id: threadComment.id
                        }).catch(rej);
                    }
                }
                offset += 100;
            }
            res();
        });
    },
    myCommentsFromPhoto: (owner_id, post_id, my_id) => {
        return new Promise(async (res, rej) => {
            let offset = 0;
            for (; ;) {
                console.log({offset});
                let allPhotoComments = await req('photos.getComments', {
                    owner_id,
                    photo_id: post_id,
                    count: 100,
                    offset
                });
                if (allPhotoComments.items.length === 0) break;
                for (let i in allPhotoComments.items) {
                    let photoComment = allPhotoComments.items[i];
                    if (photoComment.from_id === my_id) {
                        await req('photos.deleteComment', {
                            owner_id,
                            comment_id: photoComment.id
                        }).catch(rej);
                    }
                }
                offset += 100;
            }
            res();
        });
    },
    myCommentsFromVideo: (owner_id, post_id, my_id) => {
        return new Promise(async (res, rej) => {
            let offset = 0;
            for (; ;) {
                console.log({offset});
                let allVideoComments = await req('video.getComments', {
                    owner_id,
                    video_id: post_id,
                    count: 100,
                    offset
                });
                if (allVideoComments.items.length === 0) break;
                for (let i in allVideoComments.items) {
                    let videoComment = allVideoComments.items[i];
                    if (videoComment.from_id === my_id) {
                        await req('video.deleteComment', {
                            owner_id,
                            comment_id: videoComment.id
                        }).catch(rej);
                    }
                }
                offset += 100;
            }
            res();
        });
    },
    myCommentsFromNote: (owner_id, post_id, my_id) => {
        return new Promise(async (res, rej) => {
            let offset = 0;
            for (; ;) {
                console.log({offset});
                let allNoteComments = await req('notes.getComments', {
                    owner_id,
                    note_id: item.post_id,
                    count: 100,
                    offset
                });
                if (allNoteComments.items.length === 0) break;
                for (let i in allNoteComments.items) {
                    let noteComment = allNoteComments.items[i];
                    if (noteComment.from_id === my_id) {
                        await req('notes.deleteComment', {
                            owner_id,
                            comment_id: noteComment.id
                        }).catch(rej);
                    }
                }
                offset += 100;
            }
            res();
        });
    }
};

let lastReqTime = 0;

function req(method, params = {}, token = window.token, v = window.v, timeout = null) {
    return new Promise(async (res, rej) => {
        const curTime = (new Date()).getTime();
        if ((curTime - lastReqTime) > 50) await helpers.wait(helpers.getSleepTime(timeout));
        const callbackName = getCallbackName();
        cbScripts[callbackName] = document.createElement('script');
        params.access_token = token;
        params.v = v;
        params.callback = 'callbacks.' + callbackName;
        callbacks[callbackName] = async info => {
            if (info.error && info.error.error_code === 14) {
                const captchaText = await captchaMsg(info.error.captcha_img);
                try {
                    res(await req(method, {
                        ...params,
                        captcha_sid: info.error.captcha_sid,
                        captcha_key: captchaText
                    }, token, v));
                } catch (e) {
                    rej(e);
                }
            }
            else if (!('response' in info)) {
                console.error(info.error.error_msg);
                rej(info);
            }
            else res(info.response);
            setTimeout(document.head.removeChild.bind(document.head, cbScripts[callbackName]), 100000);
        };
        try {
            let paramsStr = [];
            let keys = Object.keys(params);
            for (let i in keys) paramsStr.push(keys[i] + '=' + params[keys[i]]);
            const address = encodeURI(`https://api.vk.com/method/${method}?${paramsStr.join('&')}`);
            document.head.appendChild(cbScripts[callbackName]);
            cbScripts[callbackName].src = address;
        } catch (e) {
            console.log(e.message || e);
            rej(e);
        }
    });
}