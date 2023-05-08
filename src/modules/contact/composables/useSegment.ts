import { ref, computed } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';

const segments = ref<Array<Segment>>([]);
const segmentsNonDefault = ref<Array<Segment>>([]);
const segmentsCustom = ref<Array<Segment>>([]);
const segmentsSearched = ref<Array<Segment>>([]);
const countSegmentCustom = ref<number>(0);
const countSegmentCustomShow = ref<number>(0);
const totalContactFilterDone = ref<number>(0);
const nextPage = ref<string>('');
const showSkeleton = ref<boolean>(false);

export const useSegment = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | null>(null);
    const segmentTitleList = ['All', 'Active', 'New', 'Inactive'];

    const getSegments = async (): Promise<Segment[]> => {
        loading.value = true;

        // return Promise.resolve(dummySegments)
        const res: AxiosResponse = await services.getListSegMent();
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                loading.value = false;
                error.value = resData.error;
                if (resData.data.length > 0) {
                    resData.data.forEach((segment: any) => {
                        segment.conditions = JSON.parse(segment.conditions);
                        segment._id = segment.id;
                    });
                }
                segments.value = resData.data;
                return Promise.resolve(resData.data);
            } else {
                loading.value = false;
                error.value = resData.error;
                errorMessage.value = resData.message;
                segments.value = [];
                return Promise.resolve(resData.message);
            }
        } else {
            loading.value = false;
            return Promise.reject("Shouldn't be reachable");
        }
    };

    const routeSegmentList = computed(() => {
        const result: any[] = [];
        if (segments.value.length)
            segments.value.forEach((s: Segment) => {
                result.push({
                    label: s.name,
                    name: 'ContactListBySegment',
                    params: {
                        segmentId: s._id,
                    },
                    count: s.count_contact,
                });
            });
        return result.length > 0
            ? [...segmentTitleList.map(item => result.find(segment => segment.label === item)), ...result].filter(
                  (v, i, a) => a.indexOf(v) === i && v,
              )
            : result;
    });

    const updateSegmentTotal = (id: string, total: number) => {
        const segmentIndex = segments.value.findIndex((item: Segment) => {
            return item._id === id;
        });
        if (segmentIndex < 0) {
            const segmentCustomIndex = segmentsCustom.value.findIndex((item: any) => {
                return item._id === id;
            });
            if (segmentCustomIndex > -1) segmentsCustom.value[segmentCustomIndex].count_contact = total;
        } else {
            segments.value[segmentIndex].count_contact = total;
        }
    };

    const updateSegment = async (segmentData: any, id: any): Promise<any> => {
        if (segmentData.hide_for_users == null) segmentData.hide_for_users = [];
        if (segmentData.count_contact_at == null || segmentData.count_contact_at === 'null') {
            segmentData.count_contact_at = new Date().toISOString();
            if (Number.isInteger(totalContactFilterDone.value))
                segmentData.count_contact = totalContactFilterDone.value;
        }
        const res: AxiosResponse = await services.updateSegment(segmentData, id);
        if (res) {
            const { data: resData } = res;
            if (!resData.error) {
                if (resData.data.group === 1) {
                    const findIndex = segments.value.findIndex((segment: any) => segment._id === resData.data._id);
                    if (findIndex > -1) {
                        segments.value[findIndex].conditions = resData.data.conditions;
                        segments.value[findIndex].count_contact = resData.data.count_contact;
                    }
                } else {
                    const findIndex = segmentsCustom.value.findIndex(
                        (segment: any) => segment._id === resData.data._id,
                    );
                    if (findIndex > -1) {
                        segmentsCustom.value[findIndex].conditions = resData.data.conditions;
                        segmentsCustom.value[findIndex].count_contact = resData.data.count_contact;
                    }
                }
            }
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const updateMultiSegmentShowHide = async (data: any): Promise<any> => {
        const res: AxiosResponse = await services.updateMultiSegmentShowHide(data);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const createSegment = async (segmentData: any): Promise<any> => {
        if (segmentData.hide_for_users == null) segmentData.hide_for_users = [];
        segmentData.group = 3;
        const res: AxiosResponse = await services.createSegment([segmentData]);
        if (res) {
            const { data: resData } = res;
            if (!resData.error) {
                countSegmentCustom.value++;
                countSegmentCustomShow.value++;
            }
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const getListSegmentCustom = async (newVal: any): Promise<any> => {
        if (newVal) {
            nextPage.value = '';
            segmentsCustom.value = [];
        }
        if (nextPage.value == null) nextPage.value = '';
        const res: AxiosResponse = await services.getListSegmentCustom({
            group: 3,
            next_page: nextPage.value.toString(),
        });
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                if (resData.data.length > 0) {
                    resData.data.forEach((segment: any) => {
                        segment.conditions = JSON.parse(segment.conditions);
                        segment._id = segment.id;
                    });
                }
                nextPage.value = resData.next_page;
                segmentsCustom.value = [...segmentsCustom.value, ...resData.data];
                countSegmentCustomShow.value = resData.total;
                return Promise.resolve(resData);
            } else {
                return Promise.resolve(resData);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const updateNameSegmentListById = (segment: any) => {
        const indexSegment = segmentsNonDefault.value.findIndex((seg: any) => seg.id === segment._id);
        if (indexSegment !== -1) {
            segmentsNonDefault.value[indexSegment].name = segment.name;
        }
    };
    const getSegmentById = async (id: any): Promise<any> => {
        const res: AxiosResponse = await services.getSegmentById(id);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                return Promise.resolve(resData.data);
            } else {
                return Promise.resolve(resData);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    // const updateSegmentListById =

    const getListNonDefaultSegment = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getListNonDefaultSegment(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                loading.value = false;
                error.value = resData.error;
                segmentsNonDefault.value = resData.data;
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                error.value = resData.error;
                errorMessage.value = resData.message;
                segmentsNonDefault.value = [];
                return Promise.resolve(resData.message);
            }
        } else {
            loading.value = false;
            return Promise.reject("Shouldn't be reachable");
        }
    };
    const editNonDefaultSegment = async (data: any, id: string): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.editNonDefaultSegment(data, id);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                loading.value = false;
                error.value = resData.error;
                updateNameSegmentListById(resData.data);
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        } else {
            loading.value = false;
            return Promise.reject("Shouldn't be reachable");
        }
    };
    const deleteNonDefaultSegment = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.deleteNonDefaultSegment(data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                loading.value = false;
                error.value = resData.error;
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        } else {
            loading.value = false;
            return Promise.reject("Shouldn't be reachable");
        }
    };
    const getListSegmentBySearch = async (searchValue: any): Promise<any> => {
        const params = {
            q: searchValue,
            per_page: 200,
            group: 3,
        };
        const res: AxiosResponse = await services.getListSegmentBySearch(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                segmentsSearched.value = resData.data;
                return Promise.resolve(resData);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const getCountSegmentCustom = async (): Promise<any> => {
        const res: AxiosResponse = await services.getCountSegmentCustom();
        if (res) {
            const { data: resData } = res;
            if (!resData.error) {
                countSegmentCustom.value = resData.data.total;
                return Promise.resolve(resData);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const updateSegmentNameCustom = async (data: any): Promise<any> => {
        const segmentData = {
            name: data.name,
        };

        const res: AxiosResponse = await services.updateSegment(segmentData, data._id);

        if (res) {
            const { data: resData } = res;
            if (!resData.error) {
                const findIndexSegment = segmentsCustom.value.findIndex((s: any) => s._id === resData.data._id);
                if (findIndexSegment > -1) segmentsCustom.value[findIndexSegment].name = resData.data.name;
            }
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const routeSegmentCustomList = computed(() => {
        const result: any[] = [];
        if (segmentsCustom.value.length > 0)
            segmentsCustom.value.forEach((s: Segment) => {
                result.push({
                    label: s.name,
                    name: 'ContactListBySegment',
                    params: {
                        segmentId: s._id,
                    },
                    count: s.count_contact,
                });
            });
        return result;
    });

    const updateSegmentCustomList = async (data: any): Promise<any> => {
        segmentsCustom.value = [data, ...segmentsCustom.value];
    };

    return {
        segments,
        segmentsNonDefault,
        loading,
        error,
        errorMessage,
        getSegments,
        getSegmentById,
        routeSegmentList,
        updateSegmentTotal,
        getListNonDefaultSegment,
        editNonDefaultSegment,
        deleteNonDefaultSegment,
        updateSegment,
        createSegment,
        getListSegmentCustom,
        getListSegmentBySearch,
        getCountSegmentCustom,
        updateSegmentNameCustom,
        segmentsCustom,
        routeSegmentCustomList,
        updateSegmentCustomList,
        countSegmentCustom,
        segmentsSearched,
        nextPage,
        updateMultiSegmentShowHide,
        countSegmentCustomShow,
        showSkeleton,
        totalContactFilterDone,
    };
};
