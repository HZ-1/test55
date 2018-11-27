@[TOC](react-redux 源码解读之connect的selector布局)

# selector

select是指从state中获取所需数据的函数。它与mapStateToProps、mapDispitchToProps最密切。
它是redux的三驾马车之一：action、reducer、selector；
有些人说如何设计selector，其实说的是如何设计mapStateToProps、mapDispitchToProps。
在connect源码中，最核心的部分都是围绕着selector来进行的。
理解了selector这块基本上可以解决工作开发中关于redux百分之80的疑惑。
因为太难更深的，几乎不会用到。
熟悉了connect关于selector这块，你会懂得：
```
1、redux被执行时，是否触发mapStateToProps执行；
2、mapStateToProps执行，是否会触发render；
3、组件是否render是依赖mapStateToProps返回的的state状态判断，还是整个store 状态判断。
4、组件状态数据更新的过程。
5、reducer为什么default时返回的是state，其他type返回的是{...state}
```

## connect其实就是Connect组件

我们通常写组件最后都是这样：connect(mapStateToProps,mapDispatchToProps)(App)。
 以上经过源码转换后，最后就是connectAdvanced.js 中的Connect组件。
 把connect(mapStateToProps,mapDispatchToProps)(App) 看成 Connect组件来分析就很好办了。
### 初始化selector
只在Connect组件装载时初始化selector
 ```
  //Connect组件
   constructor(props, context) {
        super(props, context)
        this.initSelector() //初始化selector
      }
```
接着看initSelector
```
 initSelector() {
        const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
        this.selector = makeSelectorStateful(sourceSelector, this.store)
        this.selector.run(this.props)
      }
```
### initSelector函数第一行代码讲解
```
//this.store.dispatch 不用解释了
//selectorFactoryOptions 把它当作是mapStateToProps与mapDispatchToProps等的集合
//selector做的事情其实就是围绕mapStateToProps与mapDispatchToProps展开当然要传这俩参数
const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
```
这行代码非常妙，sourceSelector是一个闭包函数。闭包一般不轻易用，如果用了肯定有目的，肯定是要让执行上下文不消失，可以保存变量值。
通过一个闭包的方式创建sourceSelector这个闭包函数，它的目的其实就是为了以后每次执行sourceSelector函数时，sourceSelector所用到的上下文都不被销毁，能够被保存。
以后的每次监听或者需要比较状态是否改动都会执行sourceSelector，这以后再讲。

我们看下 闭包母函数selectorFactory准备储存哪些变量给闭包函数sourceSelector。
selectorFactory其实就是selectorFactory.js的finalPropsSelectorFactory方法经过转化后其实就是pureFinalPropsSelectorFactory方法。
```
selectorFactory  约等于 pureFinalPropsSelectorFactory函数
```
来看下pureFinalPropsSelectorFactory函数部分源码：

```
//selectorFactory.js
export function pureFinalPropsSelectorFactory() {
  let state //其实就是this.context.store.getState() ---整个store中的状态state
  let ownProps
  let stateProps  //其实就是mapStateToProps(state, ownProps)---当前组件通过mapStateToProps实际使用的state
  let dispatchProps //其实就是mapDispatchToProps(dispatch, ownProps)
  ·····
  //这种函数内返回执行的函数很妙，其实就是外层等于内层函数，不过这种写法可以增加判断，到底使用哪个函数
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return handleFirstCall(nextState, nextOwnProps)
  }
  }
```
为什么要储存以上参数，是因为selector其实至始至终都是围绕以上四个参数，进行比较和生成新的props (ownProps+stateProps +dispatchPropsprops)，当然这是后话。

再回到上面的闭包函数sourceSelector，
sourceSelector其实就是pureFinalPropsSelector，经过转化，可以把它看成是handleSubsequentCalls：
```
闭包函数sourceSelector 约等于 handleSubsequentCalls
//以下讲解时，请将sourceSelector认为是handleSubsequentCalls可便于理解
```
看下handleSubsequentCalls的源码：
```
//selectorFactory.js
 function handleSubsequentCalls(nextState, nextOwnProps) {
 //areOwnPropsEqual比较是否相等的函数
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps)
    //比较this.context.store.getState()的当前与上一个是否相等
    const stateChanged = !areStatesEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps
    
    if (propsChanged && stateChanged) return handleNewPropsAndNewState()
    if (propsChanged) return handleNewProps()
    if (stateChanged) return handleNewState()
    return mergedProps
  }
```
为了先简单理解整个过程，我们只讨论getState()改变的情况，以上代码可以简化为(为了便于理解handleNewState()方法放入其中)：
```
//selectorFactory.js
 function handleSubsequentCalls(nextState, nextOwnProps) {
              //areOwnPropsEqual比较是否相等的函数
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps)
              //比较this.context.store.getState()的当前与上一个是否相等
    const stateChanged = !areStatesEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps
    
    if (stateChanged){
               //为了便于理解handleNewState()方法直接到这里来
        const nextStateProps = mapStateToProps(state, ownProps)
        const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps)
              //储存最新的 stateProps（因为handleSubsequentCalls是闭包函数sourceSelector，所以能储存）
        stateProps = nextStateProps
       if (statePropsChanged)
           	mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    }
    return mergedProps
  }
```
以上代码意思：当全局的store.getState()没有变动时，不做任何改动，返回原来的mergedProps，如果有变动，就执行mapStateToProps(state, ownProps)来获取当前组件实际使用store上的哪些数据，通过比较前后实际使用mapStateToProps(state, ownProps)数据是否变动，若变动则更新新的mergedProps，若不变动，则不变。

废了一大堆口舌，终于理清楚了，initSelector函数第一行代码做的事情：创建一个sourceSelector闭包函数，以备后面使用。
闭包函数sourceSelector是干吗的呢？
```
闭包函数sourceSelector作用：
1、它就是handleSubsequentCalls函数，接受两个参数nextState, nextOwnProps。
2、此函数执行后，可返回最新的mergedProps ：stateProps+dispatchProps+ownProps，而一个组件的props就是由以上三部分组成的，mergedProps就是props。
```
### initSelector函数第二行代码讲解
终极大boss：  this.selector终于出来了。
sourceSelector就是上小节讲的闭包函数。
```
 this.selector = makeSelectorStateful(sourceSelector, this.store)
```
makeSelectorStateful方法源码如下，它的作用是返回一个带有run方法的selector。
```
//connectAdvanced.js
function makeSelectorStateful(sourceSelector, store) {
  const selector = {
    run: function runComponentSelector(props) {
    //上一小节讲到过sourceSelector返回最新的mergedProps ：stateProps, dispatchProps, ownProps，，也就是组件的最新的props，简称nextProps
    //直接通过是否是同一个对象的引用就可以判断是否状态有改变，是不是很爽。
      const nextProps = sourceSelector(store.getState(), props)
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true
          selector.props = nextProps
          selector.error = null
        }
    }
  }
  return selector
}
```
```
以上代码容易混淆地方解释：
selector.props 才是Connect组件下的子组件的props；
this.props是Connect组件自己的props，相当于子组件的ownProps；
代码：
//Connect组件 源码：
 render() {
        const selector = this.selector
        selector.shouldComponentUpdate = false

        if (selector.error) {
          throw selector.error
        } else {
        //子组件WrappedComponent的props就是selector.props
          return createElement(WrappedComponent, this.addExtraProps(selector.props))
        }
      }

```
makeSelectorStateful的作用是返回一个带有run方法的selector。我们可以看到selector其实就是
```
 selector.run
 selector.shouldComponentUpdate
 selector.props
```
是的，connect折腾了这么多，在操作数据上，无非就是通过this.selector获取，最终无非就是获取以上两个数据，前者判断是否更新，后者返回组件最新的props。
另外提供了函数this.selector.run 方法， 这个方法了不得，以后组件的各种更新都跟它有关，由上面代码看出
```
this.selector.run 的作用：
 1、更新selector.shouldComponentUpdate
 2、更新selector.props
```
注意
1、this.selector.run不改变 Connect的props，只改变selector.props，而selector.props就是Connect下的子组件WrappedComponent的props；
2、this.selector.run用来给更新子组件WrappedComponent的props做准备的
3、WrappedComponent的props === selector.props === Connect的props + stateProps+dispatchProps；
selector.props 还有另外一种写法：
selector.props === ownProps+stateProps+dispatchProps
因此ownProps指的就是Connect的props.
```
this.selector.run 的作用（详细版）：
 1、更新selector.shouldComponentUpdate
 2、更新selector.props ---为子组件WrappedComponent提供更新的props
```

### initSelector函数第三行代码讲解
```
this.selector.run(this.props)
```
Connect组件装载时，run一次，做了三件事情：
1、更新selector.shouldComponentUpdate值；
*因为装载的时候，无论如何都会执行render，所以这次的selector.shouldComponentUpdate基本上无用，因为在render中始终执行selector.shouldComponentUpdate = false;(不过以后执行run，更新得到的shouldComponentUpdate是很重要的，这都是后话)*

2、更新selector.props值；
这点很重要，为了下一步render中提供子组件WrappedComponent的更新props。

3、闭包handleSubsequentCalls一个初始值；

> 另外注意的是，在装载完成时，componentDidMount中也会执行一次this.selector.run(this.props)，这一次应该为了兼容异常情况，进行了一次多余的执行。所以我们正常运行组件时可以无视componentDidMount中的执行this.selector.run(this.props)。

至此整个Connect组件装载过程的selector设计（布局）已经讲解清楚。

## Connect组件的selector设计

1、装载时：
在组件装载过程中，通过构造函数constructor中执行 this.initSelector()，创建this.selector:
```
 selector.run  //用来给组件装载后使用，更新selector.shouldComponentUpdate和selector.props
 selector.shouldComponentUpdate
 selector.props //装载时执行一次，为更新子组件提供更新的props
```
在执行以上代码时， selectorFactory会将组件中定义的外层定义到connect的mapStateToProps和mapDispatchToProps和ownprops 合并到selector.props中，然后通过render，每次合并到子组件WrappedComponent的props中。

2、更新时
完了后，redux通过监听，
当redux的state发生变化时，会执行selector.run，
获取selector.shouldComponentUpdate和最新的selector.props，
如果为true，将setState，
从而触发执行render，
然后将使用最新的selector.props 在render中每次都更新子组件的props。

注意：从上可以看出每次redux的state发生变化时都会执行外层定义到connect的mapStateToProps和mapDispatchToProps函数，但不一定会render；

## Connect组件状态监听更新


这块比较简单，直接上代码说明：
```
 constructor(props, context) {
        super(props, context)
        this.initSubscription()
      }
      
 initSubscription() {
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this))
      }

 onStateChange() {
        this.selector.run(this.props)
        if (!this.selector.shouldComponentUpdate) {
         //
        } else {
          this.setState({})
        }
      }
```
在装载的Connect组件是，订阅监听，如果this.context.store.state（整个app）有变化，就是执行方法onStateChange，onStateChange通过this.selector.run(this.props)计算比较得到selector.shouldComponentUpdate、selector.props，然后再决定是否setState，因为只需触发render即可，所以this.setSate一个空对象{}或者其他值都无所谓。

关于Subscription的讲解，以后会讲到。

至此Connect组件一整套，装载、数据监听更新的过程都过了一遍。
其实有很多细节么有讲，就是为了一次性将整个过程过下来，大家有一个整体脉络，便于理解。
下面讲解一下以上的细节。

## 关于selector部分细节补充
```
//selectorFactory.js
export default function finalPropsSelectorFactory() {
//options.pure这个值默认情况是true，其实就是export default //connect(mapStateToProps,mapDispatchToProps,mergeProps,{pure:true})中的第四个参数
  const selectorFactory = options.pure
    ? pureFinalPropsSelectorFactory
    : impureFinalPropsSelectorFactory
```
```
//selectorFactory.js
//第一次执行时用的是这个this.selector.run(this.props)是在initSelector()上，
//在装载时，此时走的是handleFirstCall，然后在此方法中设置hasRunAtLeastOnce为true，以后每次都是走handleSubsequentCalls。
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps)
  }
```
```
   //hoistStatics(Connect, WrappedComponent) 等于以下两句代码：
    //  Connect.abc = new WrappedComponent().abc;
    //  Connect.aee = new WrappedComponent().aee;
    //  ......
    //  return Connect
    //  hoistStatics 作用在于构造高阶组件HOC时，复制组件的非react静态方法。
    return hoistStatics(Connect, WrappedComponent)
```



 [1]: http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference
 [2]: https://mermaidjs.github.io/
 [3]: https://mermaidjs.github.io/
 [4]: http://adrai.github.io/flowchart.js/