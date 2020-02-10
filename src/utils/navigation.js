import { Loading } from 'element-ui'
import router from '@/router'
import store from '@/store'

export async function logoutAndReLogin() {
  const loading = Loading.service({
    lock: true,
    text: '正在注销',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  try {
    await store.dispatch('user/logout')

    const location = {
      name: 'Login',
      query: {
        redirect: router.currentRoute.fullPath,
      },
    }
    await router.push(location)
  } catch (e) {
    console.error(e)
  }

  loading.close()
}
