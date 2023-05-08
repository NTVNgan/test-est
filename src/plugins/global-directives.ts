export interface Event {
    target: string;
}

export default function registerGlobalDirectives(app: any) {
    app.directive('click-outside', {
        beforeMount(el: any, binding: any) {
            // eslint-disable-next-line
            el.clickOutsideEvent = function (event: Event) {
                if (!(el === event.target || el.contains(event.target))) {
                    binding.value(event, el);
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent);
        },
        unmounted(el: any) {
            document.body.removeEventListener('click', el.clickOutsideEvent);
        },
    });
    app.directive('click-outside-teleport', {
        beforeMount(el: any, binding: any) {
            let flag = 0;
            // eslint-disable-next-line
            el.clickOutsideEvent = function (event: Event) {
                const selectEl = document.getElementById('select');
                if (!(el === event.target || el.contains(event.target))) {
                    if (selectEl?.hasChildNodes() && flag !== 0) {
                        binding.value(event, el);
                    }
                    !flag && flag++;
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent);
        },
        unmounted(el: any) {
            document.body.removeEventListener('click', el.clickOutsideEvent);
        },
    });
    app.directive('click-outside-caret-tooltip', {
        beforeMount(el: any, binding: any) {
            let flag = 0;
            // eslint-disable-next-line
            el.clickOutsideEvent = function (event: Event) {
                const selectEl = document.getElementById('select');
                if (!(el === event.target || el.contains(event.target))) {
                    console.log(selectEl?.children)
                    if (selectEl?.hasChildNodes()) {
                        binding.value(event, el);
                    }
                    !flag && flag++;
                }
            };
            document.body.addEventListener('click', el.clickOutsideEvent);
        },
        unmounted(el: any) {
            document.body.removeEventListener('click', el.clickOutsideEvent);
        },
    });
}
