export default {
    clone: (value: object) => {
        return JSON.parse(JSON.stringify(value));
    },
    copyToClipboard: (TextToCopy: string) => {
        const TempText = document.createElement('input');
        TempText.value = TextToCopy;
        document.body.appendChild(TempText);
        TempText.select();

        document.execCommand('copy');
        document.body.removeChild(TempText);
        console.log('copyToClipboard', TextToCopy);
    },
};
