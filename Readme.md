
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


### Error Handling

To handle uncaught exception use process.on("uncaughtException", callback);

### process.nextTick vs setTimeout vs setImmediate

- process.nextTrick will be placed at the end of the current cycle and it will run before the next cycle starts
- setTimeout is  placed to the next timer queue
- setImmediate is placed in the check queue of the next cycle of the event loop

### Small and quick references

#### Event loops

- All timers will run
- Run all IO operations
- Execution paused waiting for new events to happen
- Check if callbacks related to timers are ready to end
- Manage close events

##### Catch uncaught exception
```js
process.on("onUncaughtException",cb)
```

##### process.nextTick vs setTimeout vs setImmediate

- process.nextTick will run before the current cycle ends
- setTimeout will be on the next timer queue
- setImmediate will be on check queue of next cycle


#### React hooks cheatsheet

- useReducer is an alternative of useState, use for complex state management

```jsx

function reducer(state, action) {
 switch (action.type) {
 case 'increment':
 return {count: state.count + 1};
 case 'decrement':
 return {count: state.count - 1};
 default:
 throw new Error();
 }

function Counter({initialState}) {
 const [state, dispatch] = useReducer(reducer, initialState);
 return (
 <>
 Count: {state.count}
 <button onClick={() => dispatch({type: 'increment'})}>+</button>
 <button onClick={() => dispatch({type: 'decrement'})}>+</button>
 </>
 );
```
- useEffect is equal to componentDidMount ,componentDidUpdate and componentWillUnmount, if you 2nd argument is not passed then it will be called for each render and if 2nd argument is an empty array it will be called only once.

 useContext() 
```jsx

const data = [];

const DataContext = React.createContext(data)

const App = () => <DataContext.Provider value={data}>
<Child/>
</DataContext.Provider>


const Child = () => {

 const data = React.useContext(DataContext)
 
return (...)
};
````

- useMemo creates a memo component, optimization happens by the deps passed, if no deps are passed it will re-calc for each render. Dont use useEffect or any side effects

- useRef to create a ref

- useImperativeHandle customize the exposed interface of a component, allows you to call child exposed methods in the parent.

```jsx
function TextInput(props, ref) {
 const inputRef = useRef(null);
 const onBtnClick = () => inputRef.current.focus();
 useImperativeHandle(ref, () => ({
 focusInput: () => inputRef.current.focus();
 });
 return (
 <Fragment>
 <input ref={inputRef} />
 <button onClick={onBtnClick}>Focus the text input</button>
 </Fragment>
 )
}

const TextInputWithRef = React.forwardRef(TextInput);

function Parent() {
 const ref = useRef(null);
 useEffect(() => {
 ref.focusInput();
 }, []);
 return (
 <div>
 <TextInputWithRef ref={ref} />
 </div>
 );
}
````

- useLayoutEffect signature same as useEffect, difference is that it happens after DOM is ready. you can sync read / write dom

- useDebugValue is used to display a label in devtool


Hooks rules

- Dont call hooks in loop, condition or nested function
- Call hooks from React functions



