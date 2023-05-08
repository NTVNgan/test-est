import { countries, languages } from 'countries-list';
import { computed } from 'vue';
import ISO6391 from 'iso-639-1';
export const useCountriesList = () => {
    const getKeyValue = function<T extends object, U extends keyof T>(obj: T, key: U) {
        return obj[key];
    };
    const countryKeys = computed(() => Object.keys(countries));
    const languagesKeys = computed(() => Object.keys(languages));
    const countriesList = computed(() => {
        const list: any = [];
        countryKeys.value.forEach((key: any) => {
            const countryItem = Object.assign({}, getKeyValue(countries, key));
            countryItem.key = key;
            list.push(countryItem);
        });
        return list;
    });
    const languagesList = computed(() => {
        const list: any = [];
        languagesKeys.value.forEach((key: any) => {
            const languageItem = Object.assign({}, getKeyValue(languages, key));
            languageItem.key = key;
            list.push(languageItem);
        });
        return list;
    });

    const getCountryName = (key: any) => {
        if (countryKeys.value.includes(key)) {
            return getKeyValue(countries, key).name;
        }
        return key;
        // const value = ISO6391.getName(key.toLowerCase())
        // return value ? value : key
    };

    const getLanguagesName = (key: any) => {
        // if (languagesKeys.value.includes(key)) {
        //     return getKeyValue(languages, key).name;
        // }
        // return key;
        const value = ISO6391.getLanguages([key]);
        return value.length > 0 ? value[0].name : key;
    };

    return {
        getCountryName,
        getLanguagesName,
        countriesList,
        languagesList,
    };
};
