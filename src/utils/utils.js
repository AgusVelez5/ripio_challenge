
const sleep = ms => new Promise(r => setTimeout(r, ms))

const log = (...args) => console.log(`${new Date().toISOString()} -`, ...args)

const alphabetic_sort = (x, y) => x.file_name < y.file_name ? -1 : x.file_name > y.file_name ? 1 : 0

const retryablePromise = (promise_fn, max_retries = 3, tries = 0) => {
  return promise_fn()
  .catch(e => {
    tries++
    log(e)
    if (tries <= max_retries) {
      log('Retryable promise failed, retrying', tries)
      return retryablePromise(promise_fn, max_retries, tries)
    }
    else {
      log('Retryable promise failed, out of retries')
      throw(e)
    }
  })
}

const timeoutablePromise = (promise, ms_timeout = 60000) => {
  return new Promise((resolve, reject) => {
    const to = setTimeout(_ => reject('Promise timed out'), ms_timeout)
    promise.then(result => {
      clearTimeout(to)
      resolve(result)
    }).catch(e => {
      clearTimeout(to)
      reject(e)
    })
  })
}

module.exports = {
  sleep,
  retryablePromise,
  timeoutablePromise,
  log,
  alphabetic_sort
}


