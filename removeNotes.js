async function removeNotes(indicator) {
    const localNotesInform = notesInform.bind(null, indicator);
    const myData = await req('users.get');
    const myId = myData[0].id;
    let offset = 0;
    let notesRemoved = 0;
    for (; ;) {
        const notes = await req('notes.get', {
            user_id: myId,
            count: 100,
            offset
        });
        if (notes.items.length === 0) break;
        for (let n in notes.items) {
            const note = notes.items[n];
            await req('notes.delete', {
                note_id: note.id
            });
            notesRemoved++;
            localNotesInform('Удалено заметок: ' + notesRemoved);
        }
        offset += notes.items.length;
    }
    localNotesInform('Все заметки удалены!');
    await helpers.wait(1000);
}

function notesInform(indicator, text, id) {
    indicator.innerText = text;
    if (!!id) {

    }
}