const cluster = require('cluster')
const cpus = require('os').cpus()

let workers = []

const masterProcess = () => {
  console.log(`一共有 ${cpus.length} 个核`)
  console.log(`Master 主进程 ${process.pid} 启动`)

  for (let i = 0; i < cpus.length; i++) {
    console.log(`正在 Fork 子进程 ${i}`)
    const worker = cluster.fork()

    workers.push(worker)

    worker.on('message', message => {
      console.log(`主进程 ${process.pid} 收到 '${JSON.stringify(message)}' 来自 ${worker.process.pid}`)
    })
  }

  workers.forEach(worker => {
    console.log(`主进程 ${process.pid} 发消息给子进程 ${worker.process.pid}`)
    worker.send({msg: `来自主进程的消息 ${process.pid}`})
  }, this)
}

const childProcess = () => {
  console.log(`Worker 子进程 ${process.pid} 启动`)

  process.on('message', message => {
    console.log(`Worker 子进程 ${process.pid} 收到消息 '${JSON.stringify(message)}'`)
  })
  console.log(`Worker 子进程 ${process.pid} 发消息给主进程`)
  process.send({msg: `来自子进程的消息 ${process.pid}`})
}

if (cluster.isMaster) {
  masterProcess()
} else {
  childProcess()
}


// 一共有 8 个核
// Master 主进程 86042 启动

// 正在 Fork 子进程 0
// 正在 Fork 子进程 1
// 正在 Fork 子进程 2
// 正在 Fork 子进程 3
// 正在 Fork 子进程 4
// 正在 Fork 子进程 5
// 正在 Fork 子进程 6
// 正在 Fork 子进程 7

// 主进程 86042 发消息给子进程 86046
// 主进程 86042 发消息给子进程 86047
// 主进程 86042 发消息给子进程 86048
// 主进程 86042 发消息给子进程 86049
// 主进程 86042 发消息给子进程 86050
// 主进程 86042 发消息给子进程 86051
// 主进程 86042 发消息给子进程 86052
// 主进程 86042 发消息给子进程 86053

// Worker 子进程 86046 启动
// Worker 子进程 86046 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86046"}' 来自 86046
// Worker 子进程 86046 收到消息 '{"msg":"来自主进程的消息 86042"}'

// Worker 子进程 86047 启动
// Worker 子进程 86047 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86047"}' 来自 86047
// Worker 子进程 86047 收到消息 '{"msg":"来自主进程的消息 86042"}'

// Worker 子进程 86050 启动
// Worker 子进程 86050 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86050"}' 来自 86050
// Worker 子进程 86050 收到消息 '{"msg":"来自主进程的消息 86042"}'

// Worker 子进程 86048 启动
// Worker 子进程 86048 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86048"}' 来自 86048
// Worker 子进程 86048 收到消息 '{"msg":"来自主进程的消息 86042"}'

// Worker 子进程 86049 启动
// Worker 子进程 86049 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86049"}' 来自 86049
// Worker 子进程 86049 收到消息 '{"msg":"来自主进程的消息 86042"}'

// Worker 子进程 86051 启动
// Worker 子进程 86051 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86051"}' 来自 86051
// Worker 子进程 86051 收到消息 '{"msg":"来自主进程的消息 86042"}'

// Worker 子进程 86052 启动
// Worker 子进程 86052 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86052"}' 来自 86052
// Worker 子进程 86052 收到消息 '{"msg":"来自主进程的消息 86042"}'

// Worker 子进程 86053 启动
// Worker 子进程 86053 发消息给主进程
// 主进程 86042 收到 '{"msg":"来自子进程的消息 86053"}' 来自 86053
// Worker 子进程 86053 收到消息 '{"msg":"来自主进程的消息 86042"}'



