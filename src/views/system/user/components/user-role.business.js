import {
  alreadyRoles as fetchAssignedRoles,
  waitRoles as fetchUnAssignedRoles,
  setRoles,
} from '@/api/user'

import { complementFields } from '@/utils/form-field'

const Fields = [
  {
    id: 'role',
    label: '角色',
    type: 'checkbox-group',
    rules: null,
    options: [],
  },
]

export function formContentValue() {
  const list = complementFields(Fields)
  Object.freeze(list)
  return list
}

/**
 * 获取用户可用的角色列表
 *  包含了 已分配 和 未分配
 *  聚合 grantedRoleList, waitGrantedRoleList 两个接口数据
 * @param userId
 * @return {Promise<{unAssigned: *, assigned: *}>}
 */
export async function fetchRoleInfo(userId) {
  const reqParams = { userId }

  const fetchList = [
    fetchAssignedRoles(reqParams).then(res => res.data),
    fetchUnAssignedRoles(reqParams).then(res => res.data),
  ]

  let assignedRoles
  let unAssignedRoles
  try {
    [assignedRoles, unAssignedRoles] = await Promise.all(fetchList)
  } catch (e) {
    console.error(e)
    throw e
  }

  return {
    assigned: assignedRoles || [],
    unAssigned: unAssignedRoles || [],
  }

  // return [
  //   assignedRoles.map(role => ({ assigned: true, info: role })),
  //   unAssignedRoles.map(role => ({ assigned: false, info: role })),
  // ].map(role => {
  //   const { id, name, desc } = role.info
  //   return {
  //     id,
  //     name,
  //     desc,
  //     assigned: role.assigned,
  //     info: role.info,
  //   }
  // })
}

export function updateUserRoles(userId, roles) {
  if (!userId) {
    throw new Error('userId is required')
  }
  let roleIds = ''
  if (Array.isArray(roles)) {
    roleIds = roles.join(',')
  } else {
    roleIds = roles
  }

  const params = {
    userId: userId,
    roleIds: roleIds,
  }
  return setRoles(params)
}
