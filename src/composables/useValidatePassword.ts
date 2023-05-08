import { ref, computed } from 'vue';
import { FormatPassword } from '@/types/format-password';

const passwordValue = ref<string>('');

export const useValidatePassword = () => {
    const checkFormatPassword = computed(() => {
        const formatPassword = ref<FormatPassword>({
            upper: false,
            lower: false,
            min: false,
            number: false,
            special: false,
        });
        if (passwordValue.value) {
            for (let i = 0; i < passwordValue.value.length; i++) {
                const ch = passwordValue.value.charAt(i);
                const regexUpper =
                    !new RegExp(/[a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểếễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/).test(ch) &&
                    new RegExp(
                        /[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸỬỮỰỲỴÝỶỸ]/,
                    ).test(ch);
                if (regexUpper) {
                    formatPassword.value.upper = true;
                }
                const regexLower =
                    new RegExp(/[a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểếễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/).test(ch) &&
                    !new RegExp(
                        /[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸỬỮỰỲỴÝỶỸ]/,
                    ).test(ch);
                if (regexLower) {
                    formatPassword.value.lower = true;
                }
                const regexMin = new RegExp(/\d/g);
                if (regexMin.test(ch)) {
                    formatPassword.value.number = true;
                }
                const regexSpecial = new RegExp(/[-!@#$%^&*()_+~=]/g);
                if (regexSpecial.test(ch)) {
                    formatPassword.value.special = true;
                }
            }
            if (passwordValue.value.length >= 8) formatPassword.value.min = true;
        }
        return formatPassword.value;
    });
    const showSuccessPass = computed(() => Object.values(checkFormatPassword.value).every(val => val));

    return { passwordValue, checkFormatPassword, showSuccessPass };
};
