import { ref } from 'vue';
import { services } from '@/modules/inbox/services';

export const useInboxAttachCannedResponse = (lastEditRange: any, contenteditable: any) => {
    const cannedUsed = ref<any>([]);
    const showModalAlertFullImage = ref<boolean>(false);

    const setCaret = (el: any, pos: any) => {
        const range = document.createRange();
        const sel: any = window.getSelection();
        range.setStart(el, pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };
    const htmlStringToElements = (htmlString: string) => {
        const span = document.createElement('span');
        span.innerHTML = htmlString;
        return span;
    };
    const resetImageIdDom = (imgClone: any, cannedDom: any) => {
        const parentImgEl: any = cannedDom.querySelectorAll('.composer-contenteditable__image');
        for (let index = 0; index < parentImgEl.length; index++) {
            const itemImageDom = parentImgEl[index];
            const imgDom = itemImageDom.querySelector('img');
            const currentId = imgDom.getAttribute('data-img-id');
            const findImgClone = imgClone.find((i: any) => i.cloned_id === currentId);
            if (findImgClone) {
                imgDom.setAttribute('data-img-id', findImgClone.id);
            }
        }
    };
    const countCannedUsed = (canned_id: string) => {
        const findCannedIndex = cannedUsed.value.findIndex((c: any) => c._id === canned_id);
        if (findCannedIndex !== -1) {
            cannedUsed.value[findCannedIndex].quantity++;
        } else {
            cannedUsed.value.push({
                _id: canned_id,
                quantity: 1,
            });
        }
    };
    const onCloneImageUpload = async (attachments: any, cannedDom: any) => {
        if (!attachments.length) return false;
        const imageEl: any = contenteditable.value.getElementsByClassName('composer-contenteditable__image');
        if (imageEl.length + attachments.length > 20) {
            showModalAlertFullImage.value = true;
            return false;
        }
        const mediaClone = attachments.map((item: any) => {
            return {
                id: item._id,
                feature_type: 'conversation',
            };
        });
        const formData = new FormData();
        formData.append('cloned_files', JSON.stringify(mediaClone));
        const res = await services.cloneFile(formData);
        if (!res.data.error) {
            resetImageIdDom(res.data.data, cannedDom);
            return true;
        } else {
            return false;
        }
    };

    const onAttachCannedResponse = async (canned: any) => {
        const cannedDom = htmlStringToElements(canned.content);
        countCannedUsed(canned.id);
        const isHaveImage = canned.content.includes('composer-contenteditable__image');
        const resClone = await onCloneImageUpload(canned.attachments, cannedDom);
        if (resClone || !isHaveImage) {
            if (lastEditRange.value !== null) {
                const { startContainer, startOffset } = lastEditRange.value;
                if (
                    startContainer.className?.includes('composer-contenteditable__contentedit-div') ||
                    startContainer.nodeName === 'DIV'
                ) {
                    if (startContainer.childNodes.length && startContainer.childNodes[startOffset].nodeName === 'BR') {
                        contenteditable.value.replaceChild(cannedDom, startContainer.childNodes[startOffset]);
                        setCaret(
                            contenteditable.value,
                            Array.from(contenteditable.value.childNodes).indexOf(cannedDom) + 1,
                        );
                    } else if (
                        startContainer.childNodes.length === 0 ||
                        startContainer.childNodes.length == startOffset ||
                        startContainer.className === 'composer-contenteditable__image'
                    ) {
                        contenteditable.value.appendChild(cannedDom);
                        setCaret(
                            contenteditable.value,
                            Array.from(contenteditable.value.childNodes).indexOf(cannedDom) + 1,
                        );
                    } else {
                        startContainer.insertBefore(cannedDom, startContainer.childNodes[startOffset]);
                        setCaret(startContainer, startOffset + 1);
                    }
                }
                if (startContainer.nodeName === '#text') {
                    const parentNode = startContainer.parentElement;
                    let childNodeStart: any = document.createTextNode(startContainer.nodeValue.slice(0, startOffset));
                    const indexKeyword = childNodeStart.nodeValue.lastIndexOf('/');
                    if (indexKeyword !== -1) {
                        childNodeStart = document.createTextNode(startContainer.nodeValue.slice(0, indexKeyword));
                    }
                    const childNodeEnd = document.createTextNode(
                        startContainer.nodeValue.slice(startOffset, startContainer.nodeValue.length),
                    );
                    parentNode.insertBefore(childNodeStart, startContainer);
                    parentNode.insertBefore(cannedDom, startContainer);
                    parentNode.insertBefore(childNodeEnd, startContainer);
                    parentNode.removeChild(startContainer);
                    Array.from(parentNode.childNodes).indexOf(cannedDom);
                    setCaret(parentNode, Array.from(parentNode.childNodes).indexOf(cannedDom) + 1);
                }
                if (startContainer.nodeName === 'SPAN') {
                    startContainer.insertBefore(cannedDom, startContainer.childNodes[startOffset]);
                    setCaret(startContainer, startOffset + 1);
                }
            } else {
                contenteditable.value.appendChild(cannedDom);
                setCaret(contenteditable.value, Array.from(contenteditable.value.childNodes).indexOf(cannedDom) + 1);
            }
        }
    };

    return {
        cannedUsed,
        showModalAlertFullImage,
        onAttachCannedResponse,
    };
};
