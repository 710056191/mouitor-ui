
import { loadMapConfig } from '@/api/map'

// 获取配置
// 加载 js css

async function getConfig() {
  const config = await loadMapConfig()
  return config
}

export async function create() {
  const config = await getConfig()
  // TODO
  console.log(config)
}
