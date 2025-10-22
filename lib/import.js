



import Helper from './helper.js'

const WORKER_DIR = Helper.__dirname(import.meta.url, false)











/**
 * @template T
 * @param {string} module
 * @returns {Promise<T>}
 */
export default async function importLoader(module) {








    module = Helper.__filename(module)
    const module_ = await import(`${module}?id=${Date.now()}`)
    const result = module_ && 'default' in module_ ? module_.default : module_
    return result
}