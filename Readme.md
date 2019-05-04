
# Event loop

It is very important to understand the event loop in node js. I am going to write a fake program and try to model an event loop.


```javascript
// node myFile.js
const pendingTimers = [];
const pendingOsOperations = [];
const pendingLongRunningOperations = [];


function shouldContinue() {
  // 1. Any pending setTimeout,setIntervals, setIntermediate
  // 2. Any pending oS tasks such as Remote resource request / network ops etc
  // 3. Any long running operations such as fs modules

  return pendingTimers.length ||
  pendingOsOperations.length ||
  pendingLongRunningOperations.length;
}

//1, Ready contents of myFile.js
// Node scan timers , intervals , os operations and long running operations and add them into their respective arrays 
myFile.readyContents();

//2. Entire body executes in one tick
while(shouldContinue()) {
 // 1. Node looks into pendingTimers and if completed then calls relevant call backs
 //2. Node looks into pendingOsTasks and pendingLongRunningTasks if completed then calls the relevant callbacks.

 //3. Node will pause, Continue when
 // a. when new pendingOSTask is done
 //b. when new pendingLongRunningTask is done
 //c. when a timer is about to complete

 //4. look for pendingTimers, call any setImmediate
 //5. handle any 'close' events. 
}


// terminal
```

```javascript 
process.env.UV_THREADPOOL_SIZE 
```
Node js tries to run code in async where it is possible but some operations are executed sync. such as all fs operations other than file watcher runs sync. above variable is an indication for libuv's threadpool to size threads

## Cluster

You can use the cluster option provided by node.

Once code has been updated to create worker process and cluster manager you can do a benchmark test on mac os by running this command.
This is using apache benchmark
```sh
  ab -c 50 -n 500 http://localhost:8000/
```

The whole concept of cluster falls out if you reduce the thread size to 1 by 
```js 
process.env.UV_THREADPOOL_SIZE = 1
```

after that command run a ab benchmark test and you will see the difference. The overall request serve time will poor.

## PM2
We don't want to invent the wheel. So a fantastic open sourced project is out there. 
[PM2](http://pm2.keymetrics.io/)

- Install pm2 as a global module by ```js npm i pm2 -g ```
- Run : ```js pm2 start . -i 0  ```
- Delete : ```js pm2 delete . ```
- History / Summary: ```js pm2 list ```
- Get detail of application: ```js pm2 show . ```
- Dashboard: ```js pm2 monit ```

Usually pm2 is used in production env.

to kill all nodejs in mac use ```sh killall node```

## Web worker thread

This is an experimental feature. The package can be installed by ```js npm i webworker-threads --s ```


