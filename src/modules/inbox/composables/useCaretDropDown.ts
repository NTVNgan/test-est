export const useCaretDropDown = () => {
    function checkMentionNode(selection: any) {
        if (
            selection.anchorNode.parentNode.className &&
            selection.anchorNode.parentNode.className.includes('mention')
        ) {
            return true;
        }
        return false;
    }

    function getCaretCoordinates(keyword: any = '@') {
        let x = 0,
            y = 0;
        const isSupported = typeof window.getSelection !== 'undefined';
        if (isSupported) {
            const selection: any = window.getSelection();
            const isMentionNode = checkMentionNode(selection);
            // Check if there is a selection (i.e. cursor in place)
            if (selection.rangeCount !== 0 && !isMentionNode) {
                //Get position of the last keyword
                const text = selection.anchorNode.textContent;
                const lastIndexKeyword = text.lastIndexOf(keyword);
                // Clone the range
                const range = selection.getRangeAt(0).cloneRange();

                // Set Range at the keyword positiony
                if (lastIndexKeyword !== -1) range.setStart(selection.anchorNode, lastIndexKeyword);
                // Collapse the range to the start, so there are not multiple chars selected
                range.collapse(true);
                // getCientRects returns all the positioning information we need
                const rect = range.getClientRects()[0];

                if (rect) {
                    x = rect.left; // since the caret is only 1px wide, left == right
                    y = rect.top; // top edge of the caret
                }
            }
        }
        return { x, y };
    }

    function getTextValueWithKeyword(selection: any, keyword: string) {
        // ParentEl
        const isIncludeMentionEl = !!selection.anchorNode?.parentElement?.dataset.mentionName;
        //Get the offset
        const anchorOffset = selection.anchorOffset;
        // Clone the text default
        const text = selection.anchorNode.textContent.slice(0,anchorOffset);
        //Get last index of keyword
        const lastIndexKeyword = text.lastIndexOf(keyword);
        const wordsBeforeKeyword = lastIndexKeyword > 0 ? text[lastIndexKeyword - 1] : false;
        // console.clear();
        // console.log({ text, keyword });
        // console.log({ wordsBeforeKeyword, lastIndexKeyword, anchorOffset, isIncludeMentionEl });
        // console.log(
        //     wordsBeforeKeyword.toString() === " ",
        //     wordsBeforeKeyword.toString().indexOf(' ') == 0,
        //     /\s/.test(wordsBeforeKeyword.toString())
        // )
        // console.log(
        //     lastIndexKeyword === 0,
        //     text[lastIndexKeyword - 1] === " ",
        //     lastIndexKeyword >= 1,
        //     wordsBeforeKeyword === ' ' && lastIndexKeyword >= 1,
        //     anchorOffset > lastIndexKeyword,
        //     !isIncludeMentionEl,
        // );
        // console.log({ wordsBeforeKeyword });
        if (
            (lastIndexKeyword === 0 || (/\s/.test(wordsBeforeKeyword.toString()) && lastIndexKeyword >= 1)) &&
            anchorOffset > lastIndexKeyword &&
            !isIncludeMentionEl
        ) {
            // console.log('if nè')
            // console.log({ lastIndexKeyword, anchorOffset });
            // console.log('text ',text.slice(lastIndexKeyword, anchorOffset));
            return text.slice(lastIndexKeyword, anchorOffset).trim();
        }
        return '';
    }

    function getCaretIndex(element: any, keywords: Array<string> | null = null) {
        let position = 0;
        const value = {};
        const isSupported = typeof window.getSelection !== 'undefined';
        if (isSupported) {
            const selection: any = window.getSelection();
            // Check if there is a selection (i.e. cursor in place)
            if (selection.rangeCount !== 0) {
                // Store the original range
                const range: any = window.getSelection()?.getRangeAt(0);
                // console.log({ range })
                // Clone the range
                const preCaretRange = range.cloneRange();
                // Select all textual contents from the contenteditable element
                preCaretRange.selectNodeContents(element);
                // And set the range end to the original clicked position
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                // Return the text length from contenteditable start to the range end
                position = preCaretRange.toString().length;

                if (keywords) {
                    keywords.forEach(item => {
                        Object.assign(value, { [item]: getTextValueWithKeyword(selection, item) });
                    });
                }
            }
        }
        return { position, value };
    }

    function toggleTooltip(event: any, contenteditable: any, tooltip: any, keyword: string) {
        if (tooltip) {
            if (contenteditable.contains(event.target)) {
                const { x, y } = getCaretCoordinates(keyword);

                tooltip.setAttribute('aria-hidden', 'false');
                tooltip.setAttribute('style', `left: ${x}px; top: auto; bottom: ${window.innerHeight - y}px`);
            } else {
                tooltip.setAttribute('aria-hidden', 'true');
                // tooltip.setAttribute("style", "display: none;");
            }
        }
    }

    function updateKeyWordText(event: any, element: any, keywords: Array<string> | null = null) {
        if (element.contains(event.target)) {
            return getCaretIndex(element, keywords);
        } else {
            return false;
        }
    }

    return {
        toggleTooltip,
        updateKeyWordText,
    };
};
