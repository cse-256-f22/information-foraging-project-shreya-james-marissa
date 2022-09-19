import { DebugLevelEnum, log } from './../utils/console_wrapper';
import { D } from './document';
import { Elements } from './elements';
log('modal loaded.', DebugLevelEnum.BASIC);
export class Modal {
    public static elem = Elements.modal;

    public static display(src: string) {
        Modal.elem.setAttribute(
            'style',
            `left: ${Math.round(window.pageXOffset)}px; top: ${Math.round(
                window.pageYOffset
            )}px;`
        );
        Modal.elem.classList.replace('hide-modal', 'show-modal');
        D.each(Modal.elem, (node) => {
            (node as HTMLIFrameElement).src = src;
        });
        document.body.classList.add('noscroll');
    }

    public static hide() {
        Modal.elem.classList.replace('show-modal', 'hide-modal');
        D.each(Modal.elem, (node) => {
            (node as HTMLIFrameElement).src = '';
        });
        document.body.classList.remove('noscroll');
    }
}

D.addEventListener(Modal.elem, 'click', (e) => {
    Modal.hide();
});
D.each(Modal.elem, (node) => {
    D.addEventListener(node, 'click', (e) => {
        e.preventDefault();
    });
});
