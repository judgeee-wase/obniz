/**
 * @packageDocumentation
 * @module Parts.Grove_Collision_sensor
 */

// include部分
import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

// 黒線から黄色線までのピン配置(signalは2つあるが、signal_1のみ用いる)
interface Grove_CollisionOptionsA {
  gnd?: number;
  vcc?: number;
  signal: number;
}

interface Grove_CollisionOptionsB {
  grove: PeripheralGrove;
}

export type Grove_CollisionOptions = Grove_CollisionOptionsA | Grove_CollisionOptionsB;

export default class Grove_Collision implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_Collision_sensor",
    };
  } // 変数,その他宣言、設定

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public isCollided: boolean | null = null;
  public onchange: ((pressed: boolean) => void) | null = null;

  private io_vcc!: PeripheralIO;
  private io_signal!: PeripheralIO;
  private io_supply?: PeripheralIO;

  constructor() {
    this.keys = ["gnd", "vcc", "signal", "grove"];
    this.requiredKeys = [];
  }

  public onChangeForStateWait = (pressed: boolean) => {};

  // 接続
  public wired(obniz: Obniz) {
    // groveの時の接続方法
    if (this.params.grove) {
      const groveIOs = this.params.grove.getDigital("3v");
      this.io_signal = groveIOs.primary;
    } else {
      // groveじゃない時の接続方法
      this.io_signal = obniz.getIO(this.params.signal);
      obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
    }

    this.io_signal.pull("3v");

    this.io_signal.input((value: boolean) => {
      this.isCollided = value;
      if (this.onchange) {
        this.onchange(value);
      }
      this.onChangeForStateWait(value);
    });
  }

  public async isCollidedWait(): Promise<boolean> {
    return await this.io_signal.inputWait();
  }

  public stateWait(isCollided: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onChangeForStateWait = (pressed: any) => {
        if (isCollided === pressed) {
          this.onChangeForStateWait = () => {};
          resolve();
        }
      };
    });
  }
}