import {
  Message,
  MessageBox,
} from 'element-ui'

import {
  findPage as fetchUserList,
  deleteUsers,
} from '@/api/user'
import { deepFreeze } from '@/utils'

const columns = [
  {
    type: 'index',
    label: '序号',
  },
  {
    label: '账号',
    prop: 'username',
    minWidth: '',
    width: '200px',
  },
  {
    label: '昵称',
    prop: 'nick',
    minWidth: '200px',
    // width: '',
  },
  {
    label: '操作',
    prop: '',
    slotName: 'col_operation',
    minWidth: '',
    width: '320px',
    align: 'center',
  },
]

const formOptions = {
  inline: true,

  forms: [
    {
      label: '',
      prop: 'username',
      placeholder: '请输入账号',
    },
    {
      label: '',
      prop: 'nick',
      placeholder: '请输入昵称',
    },
  ],
}

deepFreeze(columns)
deepFreeze(formOptions)

const fetchHandler = (params) => {
  return fetchUserList(params)
}

export const tablePropsValue = () => {
  return {
    columns: columns,
    fetch: fetchHandler,
    formOptions,
  }
}

export const confirmDeleteUser = async(row = {}) => {
  const {
    id,
    username = '',
  } = row

  if (!id) {
    Message.error('找不到 id ，无法删除')
    console.error('confirmDeleteUser cannot found user id', row)
    return
  }

  const descriptionTitle = username

  const confirmTask = (task) => {
    const type = 'warning'
    return MessageBox.confirm(
      `此操作将删除账号 ${descriptionTitle} ，是否继续？`,
      '删除账号',
      {
        type,
        beforeClose(action, instance, done) {
          if (action !== 'confirm') {
            return done()
          }

          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'

          task().finally(function() {
            instance.confirmButtonLoading = false
            done()
          })
        },
      })
      .catch(() => Promise.reject(null))
  }

  const deleteTask = async() => {
    await deleteUsers({ ids: id })
      .catch(() => Promise.reject(null))

    Message.success(`${descriptionTitle} 已删除`)
  }

  try {
    await confirmTask(function() {
      return deleteTask()
    })

    return { success: true }
  } catch (thrown) {
    switch (typeof thrown) {
      case 'string':
        Message.error(thrown)
        break

      case 'object':
      default:
        thrown && console.error(thrown)
    }
  }
}
