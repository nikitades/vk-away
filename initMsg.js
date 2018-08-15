window.modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function () {

    },
    onClose: function () {

    },
    beforeClose: function () {
        return true; // close the modal
        // return false; // nothing happens
    }
});



async function captchaMsg(captchaUrl) {
    const prevTitle = document.head.getElementsByTagName('title')[0].innerText;
    return new Promise((res, rej) => {
        // set content
        window.modal.setContent(`<div>
    <h1>Надо ввести капчу</h1>
    <div class="row">
        <div class="col-12">
            <img class="img-fluid" src="${captchaUrl}" alt="">
        </div>
        <div class="col-12 mt-3">
            <form id="cvform">
                <input type="text" id="cv" placeholder="captcha...">
            </form>
        </div>
    </div>
</div>`);

        const windowTitleBlink = setInterval(() => {
            document.head.getElementsByTagName('title')[0].innerText = window.captchaMsgRename ?  'Captcha' : 'Input';
            window.captchaMsgRename = !window.captchaMsgRename;
        }, 500);

        modal.onclose = rej;

        const resolve = function () {
            res(document.getElementById('cv').value);
            clearInterval(windowTitleBlink);
            modal.close();
        };

        document.getElementById('cv').focus();

        document.getElementById('cvform').onsubmit = () => {
            resolve();
            return false;
        };

        modal.modalBoxFooter.innerHTML = '';

        // add a button
        window.modal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary', resolve);

        // open modal
        window.modal.open();
    });
}