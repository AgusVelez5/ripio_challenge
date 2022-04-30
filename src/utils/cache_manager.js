const { promisify } = require('util')
const redis = require('redis')

class CacheManager {
  constructor(cache_endpoint_url) {
    this.client = redis.createClient(`${ cache_endpoint_url }`)
    this.promisified_get = promisify(this.client.get).bind(this.client)
    this.promisified_set = promisify(this.client.set).bind(this.client)
    this.promisified_del = promisify(this.client.del).bind(this.client)
  }

  store(k, v, ...extra) {
    // console.log(`[Cache] Storing in ${ k }${ extra.length ? ` with ${ extra.join(', ') }` : ''}`)
    return this.promisified_set(k, JSON.stringify(v), ...extra)
  }

  async get(k) {
    // console.log(`[Cache] Fetching ${ k }`)
    let entry = await this.promisified_get(k)
    if (entry) {
      // console.log(`[Cache] Returning ${ k }`)
      try {
        return JSON.parse(entry)
      }
      catch {
        return null
      }
    }
  }

  delete(k) {
    //console.log(`[Cache] Deleting ${ k }`)
    return this.promisified_del(k)
  }

  async get_or_store(key, expire_time, refresh, on_miss) {
    const cache_entry = await this.get(key)
    if (cache_entry && !refresh)
      return cache_entry
    const data = await on_miss()
    if (data)
      this.store(key, data, 'EX', expire_time)
    return data
  }
}

module.exports = CacheManager