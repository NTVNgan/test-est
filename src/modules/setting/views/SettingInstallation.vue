<template>
    <div class="p-24p pl-40p pr-40p">
        <h1 class="title">{{ $t('setting.installation_title') }}</h1>
        <div class="mt-48p box-content max-w-728p">
            <Alert
                v-if="showSuccess === 1"
                @closeAlert="clickClose"
                :type="'success'"
                :primary="'Label'"
                :secondary="'Label'"
                class="mb-32p"
            >
                <template v-slot:title>
                    <h3>{{ $t('setting.installation_title_success') }}</h3>
                </template>
                <template v-slot:message>
                    <p>{{ $t('setting.installation_alert_success') }}</p>
                </template>
            </Alert>
            <div>
                <span class="text-14 mr-16p step-number">1</span>
                <span class="text-14">{{ $t('setting.installation_title_step1_1') }}</span>
                <span class="text-12 tag-content">&lt;/body&gt;</span>
                <span class="text-14">{{ $t('setting.installation_title_step1_2') }}</span>
                <div class="box-code ml-50p">
                    <div class="code-content">
                        <tooltip-component position="top" :content="'Copied'" showByClick class="tooltip-btn">
                            <Button :icon="'clone'" @click="clickCopy" class="btn-copy">
                                {{ $t('setting.installation_btn_copy_code') }}
                            </Button>
                        </tooltip-component>
                        <pre>
                            <code id="code">{{ code }}</code>
                        </pre>
                    </div>
                </div>
            </div>
            <div class="box-step">
                <span class="text-14 mr-16p step-number last-step">2</span>
                <span class="text-14 mt-7p">{{ $t('setting.installation_title_step2') }}</span>
            </div>
            <div class="line mt-40p ml-50p"></div>
            <span class="text-14 des-note ml-50p">{{ $t('setting.installation_des_bottom') }}</span>
            <a href="#" class="des-link text-14 ml-4p">{{ $t('setting.installation_btn_contact') }}</a>
        </div>
    </div>
</template>

<script lang="ts">
import Button from '@/components/ui/ButtonComponent.vue';
import Alert from '@/components/ui/AlertComponent.vue';
import { router } from '@/router';
import { onMounted, ref } from 'vue';
import storage from '@/utils/storage';
import jwt from 'jsonwebtoken';
import { useWorkspace } from '@/modules/workspace/composables/useWorkspace';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { store } from '@/store';

export default {
    name: 'SettingInstallation',
    components: {
        Button,
        Alert,
        TooltipComponent,
    },
    setup() {
        const { searchWorkspace, closeAlertWorkspace } = useWorkspace();
        const showSuccess = ref<number>(0);
        const workspaceId = ref<string>('');
        const copied = ref<boolean>(false);
        const { org_id, workspace_id } = store.state.auth.user;
        const code = ref<string>(
            '<sc' +
                "ript type='text/javascript'>" +
                '\n' +
                'window.$linebase=[];' +
                '\n' +
                "window.LINEBASE_ORG_ID='" +
                org_id +
                "';" +
                '\n' +
                "window.LINEBASE_WORKSPACE_ID='" +
                workspace_id +
                "';" +
                '\n' +
                "(function(){d=document;s=d.createElement('script');" +
                '\n' +
                "s.src='" +
                process.env.VUE_APP_WIDGET_URL +
                '/main.js' +
                "';" +
                '\n' +
                's.async=1;' +
                '\n' +
                "d.getElementsByTagName('head')[0].appendChild(s);})();" +
                '\n' +
                '</scr' +
                'ipt>',
        );

        onMounted(async () => {
            // get installation status from api
            const user: { token: string } | null = storage.get('user');
            if (user && user.token) {
                const decode: any = jwt.decode(user.token);
                if (decode.data.workspace_id) {
                    workspaceId.value = decode.data.workspace_id;
                    const response = await searchWorkspace(decode.data.workspace_id);
                    if (!response.error) showSuccess.value = response.installationStatus;
                }
            }

            // append number in tag code
            const pre = document.getElementsByTagName('pre'),
                pl = pre.length;
            for (let i = 0; i < pl; i++) {
                pre[i].innerHTML = '<span class="line-number"></span>' + pre[i].innerHTML + '<span class="cl"></span>';
                const num = pre[i].innerHTML.split(/\n/).length;
                for (let j = 0; j < num; j++) {
                    const line_num = pre[i].getElementsByTagName('span')[0];
                    line_num.innerHTML += '<span>' + (j + 1) + '</span>';
                }
            }
        });

        const clickBack = () => {
            router.push({ name: 'Setting' });
        };
        const clickClose = async () => {
            showSuccess.value = 0;
            await closeAlertWorkspace(workspaceId.value);
        };
        const clickCopy = () => {
            const copyText = document.getElementById('code');
            const textArea = document.createElement('textarea');
            textArea.value = copyText?.textContent == null ? '' : copyText?.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            // copied.value = true;
        };
        // const mouseOver = () => {
        //     copied.value = false;
        // };

        return {
            clickClose,
            clickBack,
            clickCopy,
            // mouseOver,
            code,
            copied,
            showSuccess,
        };
    },
};
</script>
<style lang="scss" scoped>
.max-w-728p {
    max-width: 728px;
}
.btn-back {
    padding: 0;
}
.title {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    text-transform: capitalize;
    color: #141417;
    margin-top: 7px;
    font-family: 'Gibson';
}
.box-content {
    margin-left: auto;
    margin-right: auto;
}
.step-number {
    border: 1px solid #e9e9ec;
    background: #e9e9ec;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    overflow: hidden;
    text-align: center;
    padding: 0;
    display: inline-block;
    flex: none;
    vertical-align: middle;
    align-content: center;
    line-height: 30px;
}
.tag-content {
    background: #e9e9ec;
    padding: 3px 8px;
    border-radius: 3px;
    margin: 0 4px;
}
.box-step {
    display: flex;
    span {
        display: inline-table;
    }
    .mt-7p {
        margin-top: 7px;
    }
    .last-step {
        height: 32px;
    }
}
.line {
    display: block;
    background: #b4b4be;
    height: 1px;
}
.ml-50p {
    margin-left: 50px;
}
.des-note {
    color: #6b6b7b;
    margin-top: 16px;
    display: inline-block;
}
.des-link {
    color: #3e6dda;
}
.box-code {
    margin-top: 15px;
    margin-bottom: 15px;
    .code-content {
        background: #f6f6f8;
        padding: 16px 16px 32px 24px;
        border: 1px solid #e9e9ec;
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;
        &::v-deep(.tooltip-btn) {
            float: right;
            position: absolute;
            width: 120px;
            right: 16px;
        }
    }
    code {
        font-size: 12px;
        color: #6b6b7b;
    }
}
pre {
    overflow: auto;
    display: flex;
    margin-top: 8px;
    max-height: 200px;
}

pre .line-number {
    float: left;
    text-align: right;
}
</style>
<style>
pre .line-number {
    padding-right: 10px;
    border-right: 2px solid #b4b4be;
    margin-right: 25px;
}
pre .line-number span {
    display: block;
    font-size: 12px;
    color: #b4b4be;
}
</style>
