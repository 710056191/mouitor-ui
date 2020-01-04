import { VUE_APP_TITLE } from '@/utils/project-env'

export default {
  title: VUE_APP_TITLE || 'Vue Admin Template',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,
}
