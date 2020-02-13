# Utils
obniz Boardをプログラムから使う上で便利な関数を用意しています。

## reset()
強制的にobniz Boardを電源を入れた時と同じ状態に出来ます。

```Javascript
// Example
obniz = new Obniz("1234-5678");
obniz.onconnect = function() {
  obniz.reset();
}
```

## repeat(callback[, ms])
obniz Boardがつながっている間に繰り返し実行したい関数を渡すと実行します。
切断時には呼ばれなくなります。
待つための関数を呼ばなくてもスレッドがフリーズすることはありません。
JavaScript言語から考えると、無限にループするよりはcallback関数を利用することをおすすめします。

"ms"はオプションパラメータで、ループインターバルの時間を指定します。デフォルトでは100で、100msインターバルのループを実行します。
```Javascript
// Javascript Example
obniz.ad0.start();
obniz.repeat(function(){
  if (obniz.ad0.value > 2.5) {
    obniz.io0.output(true);
  } else {
    obniz.io0.output(false);
  }
},100) 
```
## [await] wait(ms)
obniz Boardの動作をms(ミリ秒)で指定された値だけ停止します。
```Javascript
// Javascript Example
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
```
obniz Boardは停止しますが、しかし、JavaScriptはこのコマンドだけでは停止しません。
```Javascript
// Javascript Example
var time = new Date();
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // 0 or very few ms. not 1000ms.
```
await を利用することでその時間だけ実際にプログラムを停止させることが可能です。
```Javascript
// Javascript Example
var time = new Date();
led.on();
await obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // => about 1000
```

## keepWorkingAtOffline(working)
obniz BoardがWifiから切断した時に、ioの状態などをリセットするかどうかを設定できます。
通常はリセットするので、出力されている電圧などももとに戻り、pwmなども全て停止します。
この関数でtrueに設定するとそれを無効にし、リセットしないようにできます。
この設定はobniz Boardの電源が切れない限りはずっと保持されます。
```Javascript
// Example
obniz.keepWorkingAtOffline(true);
```

## util.createCanvasContext(width, height);
CanvasContextを作成します。
Canvas DOMをbodyに追加してcontextを返却します(htmlにおいて)

```Javascript
// Example
const ctx = obniz.util.createCanvasContext(128, 64);
ctx.font = "9px sans-serif";
ctx.fillText('Hello', 0, 7);
```