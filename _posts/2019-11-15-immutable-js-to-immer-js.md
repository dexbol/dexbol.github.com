---
title: "从 immutable.js 到 immer.js"
thumb: "/ass/img/immutable-immer.png"
layout: post
tags:
    - javascript
---

由于 `immutablejs` 的假死状态，`immerjs` 进入了我的视野。它的作者对 `immutablejs`
一顿吐槽后介绍了 `immerjs` 的优势，跟之前 `immutable.js` 作者对 `Object.observe` 
吐槽后再引出 `immutablejs` 如出一辙。

## 为什么要换
最主要的原因是 `immutable.js` 已经一年多不发版了，一直停留在`v4.0.0-rc.12`。
在 Google 上搜索 "Is Immutable.js dead" 会发现不少人都有这个疑虑：

    "Immutable.js is now immutable" 😄 

虽然 `immutable.js` 依然健壮，
但个人感觉一个一年多都不发新版的**前端库**肯定不会是未来的趋势。

其次，`immutablejs` 提供了与普通 JS 对象不同的方法来获取/设置属性：`get` `set`
`getIn` `setIn` 等等。你不仅需要在 state 中使用他们，而且它们会散落到很多组建内，
除非频繁的使用 `toJS()` 方法，但这又会带来性能问题。也就是说越早切换，成本越低。

## immerjs 简介
immer.js 使用 `Proxy` 对象实现 copy-on-write 机制，保证资源的有效利用。
由于 [官方](https://immerjs.github.io/immer/docs/introduction)
上已经有了比较详细的用法和说明。这里只重点演示一下它的实现逻辑：

<script src="https://gist.github.com/dexbol/3295333eacc66419c5b5236a860f0d63.js"></script>

## 从 immutable.js 到 immer.js
目前代码库里涉及到一百多个文件需要修改。
原本打算用 codemod 批量处理，但由于能力有限，对 AST 了解不多，最终还是决定手动改。
这里记录一下修改时经常遗漏的几个地方：

- Map 的 size 属性，immutable 的 Map 有 size 属性，可以很方便获取属性个数，
  使用 immer 后，需要用 Object.keys().length 代替。

- Redux reducer 通常通过返回一个新对象来更新状态，但使用 immer 后最好直接在 draft
  对象上直接操作，并返回 `undefined` ，修改 draft 后依然返回对象，容易造成意想不到的错误。

- Immutable 的 getIn() 方法可以比较方便获取深层属性，但用普通对象后需要确定每一级属性都是对象。
  比如 x.getIn(['a', 'b']) , 如果 a 属性是 undefined 此表达式只会默默的返回 undefined
  而使用 x.a.b 会直接报错。 
