import { services } from '@/modules/workspace/services';

export const useWorkspace = () => {
    const searchWorkspace = async (data: any) => {
        const response = {
            error: false,
            installationStatus: 0,
        };
        try {
            await services.search(data).then((res: any) => {
                const { data } = res;
                const { error } = data;
                response.error = error;
                response.installationStatus = data.data.installation_status;
            });
            return response;
        } catch (e) {
            return response;
        }
    };

    const closeAlertWorkspace = async (workspaceId: string) => {
        const data = { installation_status: 2 };
        const response = {
            error: false,
        };
        try {
            await services.update(workspaceId, data).then((res: any) => {
                const { data } = res;
                const { error } = data;
                response.error = error;
            });
            return response;
        } catch (e) {
            return response;
        }
    };

    return {
        searchWorkspace,
        closeAlertWorkspace,
    };
};
