import { onBeforeUnmount } from 'vue';

type KeyComboType = {
    key: string;
    fn: Function;
};

let useKeydown = (keyCombo: KeyComboType[]) => {
    let onKeydown = (event: KeyboardEvent) => {
        let kc = keyCombo.find(kc => kc.key == event.key);
        if (kc) {
            kc.fn();
        }
    };

    window.addEventListener('keydown', onKeydown);

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onKeydown);
    });
};

export default useKeydown;
