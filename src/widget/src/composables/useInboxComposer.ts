import { ref } from 'vue'

export const useInboxComposer = () => {
    const decodeHtml: any = (html: any) => {
        const txt = document.createElement("textarea")
        txt.innerHTML = html
        return txt.value
    }

    const escapeHTML = (text: any) => {
        return text.replace(/[<>]/g, function (match: any, pos: any, originalText: any) {
            switch (match) {
                case '<': return '&lt;';
                case '>': return '&gt;';
            }
        });
    }

    const accurizeText = (text: any) => {
        const arrayTexts = text.split("<br>");
        // console.log({ arrayTexts });
        let result;
        if (arrayTexts.length === 1) result = escapeHTML(text);
        else
            result = arrayTexts.reduce((arr: any, cur: any, index: any) => {
                console.log({ arr, cur, index });
                return cur !== ""
                    ? arr + `${escapeHTML(cur)}${index !== arrayTexts.length - 1 && "<br>"}`
                    : arr;
            }, "");
        return result;
    }

    const decodeContent = (content: any, type = "aside") => {
        content = content.toString();
        let textContent = content
        const re = /\@\<user\/[\d]+\>\⌈\⌊(.*?)\⌉\⌋/gi;
        textContent = decodeHtml(content).trim()
        const mentions = textContent.match(re);
        if (mentions) {
            for (const mention of mentions) {
                const splits = mention.split("⌈⌊");
                if (splits.length === 2) {
                    let name = splits[1].replace("⌉⌋", "").replace("⌈⌊", "");
                    name[0] === '@' && (name = name.slice(1, name.length))
                    textContent = textContent.replace(
                        mention,
                        type === 'noti' ? '<a class="mention">' + name + "</a>" : '<span class="mention">' + name + "</span> "
                    );
                }
            }
        }
        let contentList = textContent.toString().split("<br>");
        contentList = contentList.map((item: any, index: number) => {
            item = item.toString().split("▄▄▄");
            item = item
                .map((text_item: any) => {
                    if (text_item.includes("U+")) {
                        const [code, posX, posY] = text_item.split(",");
                        const codepointArray: any = `0x${code.replace(
                            "U+",
                            ""
                        )}`
                        try {
                            const emojiText = String.fromCodePoint(codepointArray);
                            if (code !== undefined)
                                return `<span contenteditable="false" data-code="${code.replace(
                                    "U+",
                                    ""
                                )}" class="img-emoji" style="background:none">${emojiText}</span>`;
                            else return `${accurizeText(text_item)}`;
                        } catch (e) {
                            return `${accurizeText(text_item)}`;

                        }
                    } else if (String(text_item).includes("class=\"mention\"")) {
                        return text_item
                    } else return `${accurizeText(text_item)}`;
                })
                .filter((item: any) => item !== "");
            item = item.reduce((prev: any, cur: any) => prev + cur, "");
            return index !== contentList.length - 1 ? item + "<br>" : item;
        })
        return contentList.join("");
    };

    return {
        decodeContent,
    }
}