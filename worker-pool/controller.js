import WorkerPool from 'workerpool'


let poolProxy = null

const workerControl = {
  async init(options) {
    const pool = WorkerPool.pool('./worker-pool/thread-functions.js', options)
    poolProxy = await pool.proxy()
    console.log(`Worker Threads Enabled - Min Workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`)
  },
  get() {
    return poolProxy
  }
}

export default workerControl