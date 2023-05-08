import { ref, watch, computed } from 'vue';
import { services } from '@/modules/inbox/services';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

export const useInboxAttachFile = (lastEditRange: any, contenteditable: any) => {
    const envUserURL = process.env.VUE_APP_FILE_URL;
    const loading = ref<boolean>(false);
    //data image
    const validImageType = ref<string[]>(['image/jpeg', 'image/png', 'image/jpg']);
    const validFileType = ref<string[]>([
        'pdf',
        'gif',
        'txt',
        'mp4',
        'mov',
        'csv',
        'docx',
        'doc',
        'zip',
        'xls',
        'xlsx',
    ]);
    const validFileSize = ref<number>(10 * 1024 * 1024);
    const imagesUpload = ref<number>(0);
    const imagesUploadSuccess = ref<any>([]);
    const filesUploadError = ref<any>([]);
    const isShowModalMaximumImage = ref<boolean>(false);
    const isShowUploadError = ref<boolean>(false);
    const route = useRoute();
    const convo_id = computed(() => route.params.conversation);
    //data file
    const filesUpload = ref<any>([]);
    const filesUploadSuccess = ref<any>([]);
    const isShowModalMaximumFile = ref<boolean>(false);

    const { t } = useI18n();

    const isFile = (file: any) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log('it is a file!');
                resolve(true);
            };
            reader.onerror = (e) => {
                console.log('it is a folder!');
                resolve(false);
            };
            reader.readAsText(file);
        });
    };
    // attach image
    const setCaret = (el: any, pos: any) => {
        const range = document.createRange();
        const sel: any = window.getSelection();
        range.setStart(el, pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };
    const createSVGNode = () => {
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        iconSvg.setAttribute('width', '8');
        iconSvg.setAttribute('height', '8');
        iconSvg.setAttribute('fill', 'none');
        iconSvg.setAttribute('viewBox', '0 0 8 8');

        iconPath.setAttribute(
            'd',
            'M7.84733 1.17048C8.05089 0.966921 8.05089 0.681934 7.84733 0.478371L7.52163 0.152672C7.31807 -0.0508906 7.03308 -0.0508906 6.82952 0.152672L5.42494 1.55725L4.02036 2.96183L1.17048 0.152672C1.00763 -0.0508906 0.681934 -0.0508906 0.478371 0.152672L0.152672 0.478371C-0.0508906 0.681934 -0.0508906 0.966921 0.152672 1.17048L2.96183 3.97964L0.152672 6.82952C-0.0508906 6.99237 -0.0508906 7.31807 0.152672 7.52163L0.478371 7.84733C0.681934 8.05089 1.00763 8.05089 1.17048 7.84733L4.02036 5.03817L6.82952 7.84733C7.03308 8.05089 7.31807 8.05089 7.52163 7.84733L7.84733 7.52163C8.05089 7.31807 8.05089 6.99237 7.84733 6.82952L5.03817 3.97964L7.84733 1.17048Z',
        );
        iconPath.setAttribute('fill', '#2452BC');

        iconSvg.appendChild(iconPath);

        return iconSvg;
    };
    const resetImageMargin = () => {
        const childNodes: any = contenteditable.value.childNodes;
        for (let index = 0; index < childNodes.length; index++) {
            const item = childNodes[index];
            if (item.className && item.className.includes('composer-contenteditable__image-wrapper')) {
                if (item.previousSibling !== null) {
                    item.classList.add('mt-8p');
                }
                if (item.nextSibling !== null) {
                    item.classList.add('mb-8p');
                }
                if (item.previousSibling === null) {
                    item.classList.remove('mt-8p');
                }
                if (item.nextSibling === null) {
                    item.classList.remove('mb-8p');
                }
            }
        }
    };
    const resetImageDataIndex = () => {
        const parentImgEl: any = contenteditable.value.getElementsByClassName('composer-contenteditable__image');
        for (let index = 0; index < parentImgEl.length; index++) {
            const itemImageDom = parentImgEl[index];
            itemImageDom.setAttribute('data-img-index', index);
        }
    };
    const getSizeImagesInComposer = () => {
        const parentImgEl: any = contenteditable.value.getElementsByClassName('composer-contenteditable__image');
        let size = 0;
        for (let index = 0; index < parentImgEl.length; index++) {
            const itemImageDom = parentImgEl[index];
            if (itemImageDom.getElementsByTagName('img').length > 0) {
                size = size + parseInt(itemImageDom.getElementsByTagName('img')[0].getAttribute('data-img-size'));
            }
        }
        return size;
    };
    const prepareLoadingImage = () => {
        const divNode = document.createElement('div');
        divNode.className = 'composer-contenteditable__image-wrapper mt-8p mb-8p';
        // divNode.setAttribute('contenteditable', 'true');
        const parentNode = document.createElement('div');
        parentNode.className = 'composer-contenteditable__image composer-contenteditable__image--loading';

        // parentNode.setAttribute('data-img-index', index.toString());
        parentNode.setAttribute('contenteditable', 'false');
        parentNode.style.width = '320px';
        parentNode.style.height = '180px';

        const spinnerNode = document.createElement('div');
        spinnerNode.className = 'spinner spinner--small';
        spinnerNode.setAttribute('style', '--spinerColor: #3e6dda');
        spinnerNode.setAttribute('contenteditable', 'false');
        const divCloneNode = document.createElement('div');
        spinnerNode.appendChild(divCloneNode);
        spinnerNode.appendChild(divCloneNode);
        spinnerNode.appendChild(divCloneNode);
        spinnerNode.appendChild(divCloneNode);

        // parentNode.appendChild(imgNode);
        parentNode.appendChild(spinnerNode);
        divNode.appendChild(parentNode);
        // divNode.innerHTML += '&NoBreak;';
        return divNode;
    };
    const insertImageLoading = async (last: boolean) => {
        const imgNode = await prepareLoadingImage();
        if (lastEditRange.value !== null) {
            const { startContainer, startOffset } = lastEditRange.value;
            if (
                startContainer.className?.includes('composer-contenteditable__contentedit-div') ||
                startContainer.nodeName === 'DIV'
            ) {
                if (
                    startContainer.childNodes.length &&
                    startContainer.childNodes[startOffset] &&
                    startContainer.childNodes[startOffset].nodeName === 'BR'
                ) {
                    contenteditable.value.replaceChild(imgNode, startContainer.childNodes[startOffset]);
                    setCaret(contenteditable.value, Array.from(contenteditable.value.childNodes).indexOf(imgNode) + 1);
                } else if (
                    startContainer.childNodes.length === 0 ||
                    startContainer.childNodes.length == startOffset ||
                    startContainer.className === 'composer-contenteditable__image'
                ) {
                    contenteditable.value.appendChild(imgNode);
                    setCaret(contenteditable.value, Array.from(contenteditable.value.childNodes).indexOf(imgNode) + 1);
                } else {
                    startContainer.insertBefore(imgNode, startContainer.childNodes[startOffset]);
                    setCaret(startContainer, startOffset + 1);
                }
                if (last) {
                    const brNode = document.createElement('br');
                    contenteditable.value.appendChild(brNode);
                    setCaret(brNode, 0);
                }
            }
            if (startContainer.nodeName === 'BR') {
                contenteditable.value.replaceChild(imgNode, startContainer);
                setCaret(contenteditable.value, Array.from(contenteditable.value.childNodes).indexOf(imgNode) + 1);
                if (last) {
                    const brNode = document.createElement('br');
                    contenteditable.value.appendChild(brNode);
                    setCaret(brNode, 0);
                }
            }
            if (startContainer.nodeName === '#text') {
                const parentNode = startContainer.parentElement;
                const childNodeStart = document.createTextNode(startContainer.nodeValue.slice(0, startOffset));
                const childNodeEnd = document.createTextNode(
                    startContainer.nodeValue.slice(startOffset, startContainer.nodeValue.length),
                );
                parentNode.insertBefore(childNodeStart, startContainer);
                parentNode.insertBefore(imgNode, startContainer);
                parentNode.insertBefore(childNodeEnd, startContainer);
                parentNode.removeChild(startContainer);
                Array.from(parentNode.childNodes).indexOf(imgNode);
                setCaret(parentNode, Array.from(parentNode.childNodes).indexOf(imgNode) + 1);
                if (!childNodeEnd.nodeValue) {
                    const brNode = document.createElement('br');
                    contenteditable.value.appendChild(brNode);
                    setCaret(brNode, 0);
                }
            }
            if (startContainer.nodeName === 'SPAN') {
                startContainer.insertBefore(imgNode, startContainer.childNodes[startOffset]);
                setCaret(startContainer, startOffset + 1);
            }
        } else {
            contenteditable.value.appendChild(imgNode);
            setCaret(contenteditable.value, Array.from(contenteditable.value.childNodes).indexOf(imgNode) + 1);
            if (last) {
                const brNode = document.createElement('br');
                contenteditable.value.appendChild(brNode);
                setCaret(brNode, 0);
            }
        }
        resetImageMargin();
    };
    const setButtonDeleteFunction = () => {
        const parentImgEl: any = contenteditable.value.getElementsByClassName('composer-contenteditable__image');
        for (let index = 0; index < parentImgEl.length; index++) {
            const itemImageDom = parentImgEl[index];
            const btnDelNode = itemImageDom.querySelector('.composer-contenteditable__btn-delete');
            if (btnDelNode) {
                btnDelNode.onclick = () => {
                    itemImageDom.parentNode.remove();
                    imagesUpload.value--;
                };
            }
        }
    };
    const removeLoadingImage = () => {
        const parentImgEl: any = contenteditable.value.getElementsByClassName(
            'composer-contenteditable__image--loading',
        );
        parentImgEl[0].parentNode.remove();
    };
    const insertImage = () => {
        let indexAdd = 0;
        const parentImgEl: any = contenteditable.value.getElementsByClassName('composer-contenteditable__image');
        for (let index = 0; index < parentImgEl.length; index++) {
            const itemImageDom = parentImgEl[index];
            itemImageDom.setAttribute('contenteditable', 'false');

            const haveImg = itemImageDom.querySelector('img');
            if (!haveImg) {
                const imgEl = document.createElement('img');
                imgEl.src = `${envUserURL}/${imagesUploadSuccess.value[indexAdd].url}`;
                imgEl.alt = imagesUploadSuccess.value[indexAdd].name;
                imgEl.setAttribute('data-img-id', imagesUploadSuccess.value[indexAdd].id);
                imgEl.setAttribute('data-img-size', imagesUploadSuccess.value[indexAdd].size);
                itemImageDom.classList.remove('composer-contenteditable__image--loading');
                itemImageDom.style.height = null;
                itemImageDom.style.width = null;

                const spinnerEl = itemImageDom.querySelector('.spinner');
                if (spinnerEl) {
                    spinnerEl.remove();
                }

                const overlayNode = document.createElement('div');
                overlayNode.className = 'composer-contenteditable__overlay';
                overlayNode.setAttribute('contenteditable', 'false');

                const btnDelNode = document.createElement('div');
                btnDelNode.className = 'composer-contenteditable__btn-delete';
                btnDelNode.setAttribute('contenteditable', 'false');
                const iconDelNode = createSVGNode();
                // btnDelNode.onclick = () => {
                //     imagesUpload.value--;
                //     itemImageDom.parentNode.remove();
                // };
                btnDelNode.appendChild(iconDelNode);
                itemImageDom.appendChild(imgEl);
                itemImageDom.appendChild(overlayNode);
                itemImageDom.appendChild(btnDelNode);
                indexAdd++;
            }
            if (index === parentImgEl.length - 1) {
                imagesUploadSuccess.value = [];
                setButtonDeleteFunction();
            }
        }
    };
    const resetInputUpload = (id: string) => {
        const input: any = document.getElementById(id);
        input.value = '';
    };
    const checkValidImage = (file: any) => {
        if (file.size === 0) {
            return t('inbox.inbox_upload_file_error_empty');
        }
        if (!validImageType.value.includes(file.type) && file.size > validFileSize.value) {
            return t('inbox.inbox_upload_file_error_format_and_size');
        }
        if (!validImageType.value.includes(file.type)) {
            return t('inbox.inbox_upload_file_error_format');
        }
        if (file.size > validFileSize.value) {
            return t('inbox.inbox_upload_file_error_size');
        }
        return '';
    };
    const onAttachImage = async (files: any, type: string) => {
        if (imagesUpload.value >= 20) {
            isShowModalMaximumImage.value = true;
            resetInputUpload('upload-image-composer');
            return;
        }
        const formData = new FormData();
        const headerParams = {
            'file-type': 2,
            'feature-type': type,
        };
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (imagesUpload.value < 20) {
                if (checkValidImage(file) !== '') {
                    filesUploadError.value.unshift({
                        error: `${file.name} ${checkValidImage(file)}`,
                    });
                } else {
                    imagesUpload.value++;
                    formData.append('file', file);
                    insertImageLoading(index === files.length - 1 || imagesUpload.value === 20);
                }
            } else {
                filesUploadError.value.unshift({
                    error: `${file.name} ${t('inbox.inbox_upload_image_error_full')}`,
                });
            }
        }
        if (filesUploadError.value.length) {
            isShowUploadError.value = true;
        }
        if (imagesUpload.value > 0 && imagesUpload.value <= 20) {
            loading.value = true;
            const res = await services.uploadFile(formData, headerParams);
            if (!res.data.error) {
                imagesUploadSuccess.value = res.data.data;
                insertImage();
            } else {
                if (res.data.message === 'invalid file type') {
                    for (let index = 0; index < files.length; index++) {
                        const file = files[index];
                        filesUploadError.value.unshift({
                            error: `${file.name} ${t('inbox.inbox_upload_file_error_failed')}`,
                        });
                        isShowUploadError.value = true;
                        removeLoadingImage();
                    }
                }
            }
            loading.value = false;
        }
        resetInputUpload('upload-image-composer');
    };
    // attach file
    const checkValidFile = (file: any) => {
        const fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (file.size === 0) {
            return t('inbox.inbox_upload_file_error_empty');
        }
        if (!validFileType.value.includes(fileExtension) && file.size > validFileSize.value) {
            return t('inbox.inbox_upload_file_error_format_and_size');
        }
        if (!validFileType.value.includes(fileExtension)) {
            return t('inbox.inbox_upload_file_error_format');
        }
        if (file.size > validFileSize.value) {
            return t('inbox.inbox_upload_file_error_size');
        }
        return '';
    };
    const setDataUploadFile = (fileUploadSuccess: any) => {
        for (let index = 0; index < fileUploadSuccess.length; index++) {
            const file = fileUploadSuccess[index];
            const findIndex = filesUpload.value.findIndex(
                (i: any) => i.status === 'uploading' && i.name.toLowerCase() === file.original_name.toLowerCase(),
            );
            filesUpload.value[findIndex].status = 'uploaded';
            filesUpload.value[findIndex].id = file.id;
            filesUpload.value[findIndex].uploadName = file.name;
            filesUpload.value[findIndex].url = file.url;
        }
    };
    const onAttachFile = async (files: any, type: string) => {
        if (filesUpload.value.length >= 20) {
            isShowModalMaximumFile.value = true;
            resetInputUpload('upload-file-composer');
            return;
        }
        const formData = new FormData();
        const headerParams = {
            'File-Type': 1,
            'Feature-Type': type,
        };
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (filesUpload.value.length < 20) {
                if (checkValidFile(file) !== '') {
                    filesUploadError.value.unshift({
                        error: `${file.name} ${checkValidFile(file)}`,
                    });
                } else {
                    filesUpload.value.push({
                        name: file.name,
                        size: file.size,
                        status: 'uploading',
                    });
                    formData.append('file', file);
                }
            } else {
                filesUploadError.value.unshift({
                    error: `${file.name} ${t('inbox.inbox_upload_file_error_full')}`,
                });
            }
        }
        if (filesUploadError.value.length) {
            isShowUploadError.value = true;
        }
        if (filesUpload.value.length) {
            loading.value = true;
            const res = await services.uploadFile(formData, headerParams);
            if (!res.data.error) {
                setDataUploadFile(res.data.data);
            }
            loading.value = false;
        }
        resetInputUpload('upload-file-composer');
    };
    const onDropFile = async (files: any, type: string) => {
        const fileUploaded: any = [];
        const imageUploaded: any = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const isFileUpload = await isFile(file);
            console.log('isFileUpload', isFileUpload);
            if (isFileUpload) {
                if (validImageType.value.includes(file.type)) {
                    imageUploaded.push(file);
                } else {
                    fileUploaded.push(file);
                }
            } else {
                filesUploadError.value.unshift({
                    error: `${file.name} ${t('inbox.inbox_upload_file_error_failed')}`,
                });
            }
        }
        if (filesUploadError.value.length) {
            isShowUploadError.value = true;
        }
        if (fileUploaded.length) {
            onAttachFile(fileUploaded, type);
        }
        if (imageUploaded.length) {
            onAttachImage(imageUploaded, type);
        }
    };
    return {
        imagesUpload,
        imagesUploadSuccess,
        isShowModalMaximumImage,
        filesUploadError,
        isShowUploadError,
        onAttachImage,
        insertImage,
        resetImageMargin,
        resetImageDataIndex,
        getSizeImagesInComposer,
        setButtonDeleteFunction,
        filesUpload,
        isShowModalMaximumFile,
        onAttachFile,
        onDropFile,
    };
};
