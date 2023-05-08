declare const __process: NodeJS.Process; // set in rollup.config

export const useImageGallery = () => {
    const getImagesGalleryByConvo = async ({ convoId, activeId, nextPage = null, prevPage = null }:any) => {
        console.log('getImagesGalleryByConvo')
        const response = {
            error: false,
            data: [],
        };
        try {
            const fetchUrl = `${__process.env.VUE_APP_ROOT_API}/chat/api/v1/conversations/public/${convoId}/media?active_id=${activeId}&type=2${nextPage ? `&next_page=${nextPage}` : ''}${prevPage ? `&prev_page=${prevPage}` : ''}`;
            const res = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const dataFromAPI = await res.json();
            console.log({ dataFromAPI })
            if (!dataFromAPI.error) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                response.error = dataFromAPI.error;
                response.data = dataFromAPI.data;
            }
            return response;
        } catch (e) {
            console.error({ e })
            return response;
        }
    };

    return {
        getImagesGalleryByConvo
    }
}