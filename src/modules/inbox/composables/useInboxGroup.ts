import { services } from '@/modules/inbox/services';
import { AxiosResponse } from 'axios';
import { computed, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

declare type Group = {
    count: number;
    group: string;
};

const inboxGroup = ref<Array<Group>>([]);

export const useInboxGroup = () => {
    const { t } = useI18n();
    const titleGroup = reactive<any>({
        assign_to_you: t('inbox.inbox_group_name_base'),
        unassign: t('inbox.inbox_group_name_unassigned'),
        all: t('inbox.inbox_group_name_all'),
    });

    const getGroups = async () => {
        const response = {
            error: false,
            data: [
                { group: 'assign_to_you', count: 0 },
                { group: 'unassign', count: 0 },
                { group: 'all', count: 0 },
            ],
        };
        try {
            await services.getInboxGroups().then((res: any) => {
                const { data } = res;
                const { error } = data;
                response.error = error;
                if (data.data && data.data.length > 0) {
                    inboxGroup.value = data.data.filter((g: any) => typeof g.group !== 'undefined');
                    response.data.forEach((res: any) => {
                        const checkData = inboxGroup.value.find((d: any) => d.group == res.group);
                        if (checkData == undefined) inboxGroup.value.push(res);
                    });
                    if (inboxGroup.value[0]['group'] == 'all') inboxGroup.value = inboxGroup.value.reverse();
                } else inboxGroup.value = response.data;
            });
        } catch (e) {
            console.log({ e });
            return e;
        }
    };

    const routeGroupList = computed(() => {
        const result: any[] = [];
        inboxGroup.value.forEach(s => {
            let label;
            if (s.group in titleGroup) label = titleGroup[s.group];
            else label = s.group;
            result.push({
                label: label,
                name: 'InboxGroups',
                params: s.group,
                count: s.count,
            });
        });
        return result;
    });

    const changeNumberGroupInSearch = (from: string, to: string) => {
        if (inboxGroup.value.length > 0) {
            inboxGroup.value.forEach(g => {
                if (g.group === from) g.count--;
                if (g.group === to) g.count++;
            });
        }
    };

    return {
        routeGroupList,
        getGroups,
        inboxGroup,
        titleGroup,
        changeNumberGroupInSearch,
    };
};
