<template>
    <div class="widget-composer__img" v-show="closeSlide">
        <div class="widget-composer__img-slide" ref="scrollWrapper">
            <div class="img" v-for="img in arrComposeImgSuccess" :key="img">
                <img class="preview" :src="envUserURL + '/' + img.url" />
                <span class="widget-composer__img-close" @click="remove(arrComposeImgSuccess.indexOf(img))">
                    <Close />
                </span>
            </div>
            <template v-if="loading && arrComposeImg.length > 0">
                <div class="img" v-for="img in arrComposeImg" :key="img">
                    <div class="widget-composer__img-loader">
                        <div class="loader" />
                    </div>
                </div>
            </template>

            <div class="img add-more">
                <input
                    type="file"
                    class="widget-composer__img-input"
                    ref="file"
                    id="widgetImg"
                    name="files[]"
                    @change="onChangeMore"
                    multiple
                />
                <label for="widgetImg">
                    <img src="../assets/images/addImg.svg" />
                </label>
            </div>
        </div>
        <modal-component v-model="modalError" width="444px" customClass="widget-composer__img-modal">
            <template v-slot:body>
                <img class="img-logo" src="../assets/images/logo.svg" />
                <div class="text-center text-14 px-32p content-modal">
                    {{ errorImage }}
                </div>
                <button class="btn-got-it" @click="modalError = false">Got it</button>
            </template>
        </modal-component>
    </div>
</template>

<script>
import { ref, inject, nextTick,watch } from 'vue';
import Close from './icons/TimeCircle.vue';
import ModalComponent from './WidgetModal.vue';
// import { useInboxComposer } from '../composables/useInboxComposer';
// import { services } from '../services';
import { useInbox } from '../composables/useInbox';

export default {
    name: 'WidgetComposerImageSlide',
    components: {
        Close,
        ModalComponent,
    },
    setup(props, {emit}) {
        // const arrComposeImg = inject('arrComposeImg');
        const arrComposeImg = ref([]);
        const arrComposeImgSuccess = ref([]);
        const emitter = inject('emitter');
        const errorImage = ref('');
        const validImageType = ref(['image/jpeg', 'image/png', 'image/jpg']);
        const validImageSize = ref(10 * 1024 * 1024);
        const errorList = ref([]);
        const isShowMaximumImage = ref(false);
        const modalError = ref(false);
        const scrollWrapper = ref(null);
        const conversationId = ref('');
        const { uploadImage, loading } = useInbox();
        // eslint-disable-next-line no-undef
        const envUserURL = `${__process.env.VUE_APP_FILE_URL}`;
        const closeSlide = ref(false);
        const limitImg = ref(20);

        const checkValidImage = file => {
            if (!validImageType.value.includes(file.type) && file.size > validImageSize.value) {
                return 3;
            }
            if (file.size > validImageSize.value) {
                return 1;
            }
            if (!validImageType.value.includes(file.type)) {
                return 2;
            }
            return '';
        };

        const showError = () => {
            if (errorList.value.includes(3) && isShowMaximumImage.value)
                errorImage.value =
                    'We only support JPG, JPEG, PNG file, \nmaximum size is 10MB and maximum 20 images per message';
            else if (errorList.value.includes(1) && errorList.value.includes(2) && isShowMaximumImage.value)
                errorImage.value = 'We only support JPG, JPEG, PNG file, \nmaximum size is 10MB and maximum 20 images per message';
            else if (errorList.value.includes(1) && isShowMaximumImage.value)
                errorImage.value = 'The maximum file size is 10MB and \nmaximum 20 images per message';
            else if (errorList.value.includes(2) && isShowMaximumImage.value)
                errorImage.value = 'We only support JPG, JPEG, PNG file \nand maximum 20 images per message.';
            else if (errorList.value.includes(1) && errorList.value.includes(2))
                errorImage.value = 'Please try again with another JPG, JPEG, PNG file and \nthe maximum size is 10MB';
            else if (errorList.value.includes(3))
                errorImage.value = 'Please try again with another JPG, JPEG, PNG file and \nthe maximum size is 10MB';
            else if (errorList.value.includes(1))
                errorImage.value = 'The file you are trying to attach is too large. \nThe maximum file size is 10MB.';
            else if (errorList.value.includes(2))
                errorImage.value =
                    'The file you are choosing is not supported. \nPlease try again with another JPG, JPEG, PNG file.';
            else if (isShowMaximumImage.value)
                errorImage.value = 'You’ve reached the maximum number of images. \nMaximum 20 images per message.';
            else errorImage.value = '';
        };

        emitter.on('conversationId', async data => {
            if (data) {
                conversationId.value = data;
            }
        });

        emitter.on('closeSlideWidget', async data => {
            if (data) {
                closeSlide.value = false;
                arrComposeImg.value = [];
                arrComposeImgSuccess.value = [];
            }
        });

        const resetInputUpload = () => {
            const input = document.getElementById('widgetImg');
            input.value = '';
        };

        const addImgSlide = async (value) => {
            const formData = new FormData();
            // formData.append('file_type', '2');
            // formData.append('feature_type', 'conversation');
            // formData.append('feature_id', conversationId.value);

            errorList.value = [];
            arrComposeImg.value = [];
            const arrImg = [];
            const arrValue = Array.from(value);

            if (arrValue.length > limitImg.value){
                isShowMaximumImage.value = true;
            } else {
                if (arrComposeImgSuccess.value.length + arrValue.length > limitImg.value){
                    isShowMaximumImage.value = true;
                }
            }
            
            arrValue.forEach(img => {
                const file = img;
                const list = checkValidImage(file);
                if (list == '') {
                    arrImg.push(file);
                }
                errorList.value.push(list);
            });

            showError();
            if (errorImage.value) modalError.value = true;

            if (arrImg.length > limitImg.value) {
                const position = limitImg.value - arrComposeImgSuccess.value.length
                const arrValueLimit = arrImg.splice(0, position);
                arrValueLimit.forEach(img => {
                    const file = img;
                    arrComposeImg.value.push(file);
                    formData.append('file', file);
                });
                console.log('111',arrComposeImg.value);
            } else {
                if (arrImg.length + arrComposeImgSuccess.value.length > limitImg.value) {
                    if (arrComposeImgSuccess.value.length < limitImg.value) {
                        const position = limitImg.value - arrComposeImgSuccess.value.length
                        const arrValueLimit = arrImg.splice(0, position);
                        console.log('arrValueLimit',arrValueLimit);
                        arrValueLimit.forEach(img => {
                            const file = img;
                            arrComposeImg.value.push(file);
                            formData.append('file', file);
                        });
                    }
                } else {
                    arrImg.forEach(img => {
                        const file = img;
                        formData.append('file', file);
                        arrComposeImg.value.push(file);
                    });
                }
            }
            if (arrComposeImg.value.length > 0) {
                emitter.emit('dnoneIcon', true);
                closeSlide.value = true;
                const headers = {
                    'File-Type': 2,
                    'Feature-Type': 'conversation',
                    'Feature-Id': conversationId.value,
                }
                const res = await uploadImage(formData, headers);
                if (!res.error) {
                    arrComposeImgSuccess.value = [...arrComposeImgSuccess.value, ...res.data];
                    emitter.emit('valueFile', arrComposeImgSuccess.value);
                }
                await nextTick();
                setTimeout(function() {
                    if (arrComposeImgSuccess.value.length > 0) {
                        scrollWrapper.value.scrollLeft = scrollWrapper.value.scrollWidth;
                    }
                }, 500);
            }
            resetInputUpload();
        }

        emitter.on('arrComposeImg', value => {
            addImgSlide(value);
        });

        const onChangeMore = (e) => {
            if (e.target !== undefined){
                const images = e.target.files;
                emitter.emit('arrComposeImg', images);
            } else {
                emitter.emit('arrComposeImg', e);
            }
        }

        const remove = i => {
            arrComposeImgSuccess.value.splice(i, 1);
            if (arrComposeImgSuccess.value.length === 0) {
                closeSlide.value = false;
                emitter.emit('dnoneIcon', false);
            };
            emitter.emit('valueFile', arrComposeImgSuccess.value);
        };

        // watch(arrComposeImgSuccess, () => {
        //     if (arrComposeImgSuccess.value.length>0) {
        //         emit('change')
        //     }
        // })

        return {
            arrComposeImg,
            remove,
            errorImage,
            validImageType,
            validImageSize,
            errorList,
            showError,
            isShowMaximumImage,
            modalError,
            scrollWrapper,
            conversationId,
            envUserURL,
            closeSlide,
            arrComposeImgSuccess,
            onChangeMore,
            addImgSlide,
            loading,
            resetInputUpload,
        };
    },
};
</script>

<style lang="scss">
.widget-composer {
    &__img-slide {
        display: flex;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-track {
            background: #ffffff;
            width: 12px;
        }
        &::-webkit-scrollbar-thumb {
            background: #b4b4be;
            border-radius: 8px;
            border: 4px solid #ffffff;
        }
        .img {
            margin: 0 6px;
            position: relative;
            margin-top: 8px;
            &:first-child {
                margin-left: 0;
            }
            &:last-child {
                margin-right: 0;
            }
            .preview {
                width: 56px;
                height: 56px;
                object-fit: cover;
                border-radius: 8px;
                max-width: initial;
            }
            &.add-more {
                width: 56px;
                height: 56px;
                background: #e2ecff;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                img {
                    width: 32px;
                    height: 32px;
                    padding: 0 12px;
                    box-sizing: unset;
                    max-width: initial;
                }
            }
        }
    }
    &__img {
        padding: 0 16px;
        border-top: 1px solid #e9e9ec;
        margin-bottom: 8px;
        &-close {
            width: 20px;
            height: 20px;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 0;
            background: #fff;
            border-radius: 50%;
            filter: drop-shadow(0px 1px 4px rgba(45, 87, 184, 0.4));
            top: -4px;
            right: -8px;
            cursor: pointer;
            &:hover{
                background: #E9E9EC;
            }
            &:focus{
                background: #E9E9EC;
            }
        }
        &-modal {
            text-align: center;
            padding: 24px;
            .content-modal {
                padding: 16px 0;
                font-size: 14px;
                line-height: 20px;
                white-space: pre-line;
                font-family: 'Roboto', 'sans-serif';
            }
            .btn-got-it {
                background: #3e6dda;
                border-radius: 4px;
                width: 66px;
                height: 36px;
                padding: 8px 16px;
                border: none;
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                color: #ffffff;
                font-family: 'Roboto', 'sans-serif';
                cursor: pointer;
                outline: none;
                transition: all .5s;
                &:hover{
                    background-color: #1b3d8d;
                }
                &:focus{
                    box-shadow: inset 0 0 0 2px #bfcef3;
                    outline-offset: 2px;
                    background-color: #3e6dda;
                }
            }
            .img-logo{
                margin: 0 auto;
            }
        }
        &-input{
            width: 1px;
            height: 1px;
            overflow: hidden;
            opacity: 0;
            display: none!important;
        }
        &-loader{
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F6F6F8;
            border-radius: 8px;
            .loader{
                border: 2px solid transparent;
                border-radius: 50%;
                border-top: 2px solid #3E6DDA;
                width: 16px;
                height: 16px;
                -webkit-animation: spin 2s linear infinite;
                animation: spin 2s linear infinite;
            }
        }
    }
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
