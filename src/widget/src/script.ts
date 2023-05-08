export default (function (documentCurrentScript?: HTMLScriptElement) {
  const currScriptUrl = new URL((documentCurrentScript || document.currentScript as HTMLScriptElement).src);
  const urlParams = currScriptUrl.searchParams;
  return {
    // origin_domain: currScriptUrl.origin !== 'file://' ? currScriptUrl.origin : '.',
    origin_domain: currScriptUrl.origin,
    org_id: urlParams.get('org_id'),
    workspace_id: urlParams.get('workspace_id'),
    is_demo: urlParams.get('is_demo'),
  }
});
