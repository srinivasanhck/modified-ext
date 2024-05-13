// @ts-nocheck
if(window.trustedTypes && window.trustedTypes.createPolicy){
  window.trustedTypes.createPolicy('default', {
    createHTML: string => string,
    createScriptURL: string => string,
    createScript: string => string,
  })
}