class DevCacheManager {
  constructor() {
    this.cache = {}
  }

  store(k, v, ...extra) {
    console.log(`[DevCache] Storing in ${ k }${ extra.length ? ` with ${ extra.join(', ') }` : ''}`)
    this.cache[k] = v
  }

  get(k) {
    console.log(`[DevCache] Fetching ${ k }`)
    if (this.cache[k])
      console.log(`[DevCache] Returning ${ k }`)
    return this.cache[k]
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

module.exports = DevCacheManager