declare const __process: NodeJS.Process; // set in rollup.config

const constants = {
  custom_css_path: `${process.env.VUE_APP_ROOT_API ? process.env.VUE_APP_ROOT_API : __process.env.VUE_APP_ROOT_API}/chat/api/v1/settings/widget/css`
}

export default constants