
export const useEmoji = (lastEditRange: any, contenteditable: any, setCaret: any) => {
    const positionEmoji = (position: any) => {
        const width = 5200 / 2652;
        console.log({ width, position });
        return width * position + '%';
    };

    const prepareEmoji = (val: any) => {
        console.log({ val });
        const positionX = positionEmoji(val.sheet_x);
        const positionY = positionEmoji(val.sheet_y);
        // const r = decodeURIComponent(val.unified.replace('-',' ').replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
        const codepointArray = val.unified.split('-').map((item: any) => `0x${item}`);
        // console.log({codepointArray})
        // console.log(String.fromCodePoint(...codepointArray))
        const emojiText = String.fromCodePoint(...codepointArray);
        const blankTextNodeInside = document.createTextNode(emojiText);
        const spanNodeInside: any = document.createElement('span');
        spanNodeInside.contentEditable = false;
        const spanNode: any = document.createElement('span');
        // spanNode.style.backgroundPosition = `${positionX} ${positionY} `;
        spanNode.contentEditable = false;
        spanNode.dataset.text = emojiText;
        spanNode.dataset.code = val.unified;
        spanNode.style.paddingRight = '1px';
        spanNode.style.backgroundImage = 'none';
        // spanNode.style.transform="translateY(-4px)";
        spanNode.dataset.positionX = positionX;
        spanNode.dataset.positionY = positionY;
        spanNode.classList.add('img-emoji');
        // spanNode.classList.add('img-emoji-compose');
        spanNode.appendChild(blankTextNodeInside);
        spanNode.appendChild(spanNodeInside);
        spanNode.appendChild(blankTextNodeInside);
        return val.category === 'Skin Tones' ? spanNode : blankTextNodeInside;
    };

    const insertEmoji = (val: any) => {
        const emojiNode = prepareEmoji(val);
        // console.log('emoji', lastEditRange.value);
        if (lastEditRange.value !== null) {
            const { startContainer, startOffset } = lastEditRange.value;
            console.log('emoji', { startContainer });
            if (
                startContainer.className?.includes('composer-contenteditable__contentedit-div') ||
                startContainer.nodeName === 'DIV'
            ) {
                if (
                    startContainer.childNodes.length === 0 ||
                    startContainer.childNodes.length == startOffset ||
                    startContainer.className === 'composer-contenteditable__image'
                ) {
                    contenteditable.value.appendChild(emojiNode);
                    setCaret(
                        contenteditable.value,
                        Array.from(contenteditable.value.childNodes).indexOf(emojiNode) + 1,
                    );
                } else {
                    startContainer.insertBefore(emojiNode, startContainer.childNodes[startOffset]);
                    setCaret(startContainer, startOffset + 1);
                }
                if (startContainer.nodeName === 'DIV') startContainer.nodeName === '#text';
            } else {
                if (startContainer.nodeName === '#text') {
                    const parentNode = startContainer.parentElement;
                    if (parentNode.className === 'mention' && startOffset === 0) {
                        const parentMentionNode = parentNode.parentElement;
                        parentMentionNode.insertBefore(emojiNode, parentNode);
                        setCaret(parentMentionNode, Array.from(parentMentionNode.childNodes).indexOf(emojiNode) + 1);
                    } else {
                        parentNode.className === 'mention' && (parentNode.className = '');
                        // Split node to 2 child node
                        const childNodeStart = document.createTextNode(startContainer.nodeValue.slice(0, startOffset));
                        const childNodeEnd = document.createTextNode(
                            startContainer.nodeValue.slice(startOffset, startContainer.nodeValue.length),
                        );
                        parentNode.insertBefore(childNodeStart, startContainer);
                        parentNode.insertBefore(emojiNode, startContainer);
                        parentNode.insertBefore(childNodeEnd, startContainer);
                        parentNode.removeChild(startContainer);
                        Array.from(parentNode.childNodes).indexOf(emojiNode);
                        setCaret(parentNode, Array.from(parentNode.childNodes).indexOf(emojiNode) + 1);
                    }
                }
                if (startContainer.nodeName === 'SPAN') {
                    startContainer.insertBefore(emojiNode, startContainer.childNodes[startOffset]);
                    setCaret(startContainer, startOffset + 1);
                }
            }
        } else {
            contenteditable.value.appendChild(emojiNode);
            setCaret(contenteditable.value, Array.from(contenteditable.value.childNodes).indexOf(emojiNode) + 1);
        }
    };
    return { insertEmoji };
};
