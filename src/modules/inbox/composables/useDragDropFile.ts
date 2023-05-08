import { ref, inject } from 'vue';

const isDragFile = ref<boolean>(false);
export const useDragDropFile = () => {
    const emitter: any = inject('emitter');
    let dragging = 0;
    const dragenter = (event: any) => {
        event.preventDefault();
        dragging++;
        isDragFile.value = true;
    };
    const dragover = (event: any) => {
        event.preventDefault();
        isDragFile.value = true;
    };
    const dragleave = (event: any) => {
        dragging--;
        if (dragging === 0) {
            isDragFile.value = false;
        }
    };

    const drop = (event: any) => {
        event.preventDefault();
        dragging = 0;
        isDragFile.value = false;
        emitter.emit('onDropFileInbox', event.dataTransfer.files);
    };
    return {
        isDragFile,
        dragenter,
        dragover,
        dragleave,
        drop,
    };
};