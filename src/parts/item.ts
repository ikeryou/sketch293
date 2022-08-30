import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { LineSegments } from 'three/src/objects/LineSegments';
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial';
import { Color } from 'three/src/math/Color';
import { Val } from '../libs/val';
import { Tween } from '../core/tween';
import { Util } from "../libs/util";
import { Scroller } from "../core/scroller";
import { DoubleSide } from 'three/src/constants';
import { Func } from "../core/func";
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
// import { Conf } from "../core/conf";
import { Object3D } from 'three/src/core/Object3D';
import { Point } from "../libs/point";

export class Item extends MyObject3D {

  private _id:number = 0;
  private _mesh:Mesh;
  private _line:LineSegments;
  private _shakeVal:Val = new Val();
  private _oldAng:number = -90;
  private _isScroll:boolean = false;
  private _con:Object3D;
  private _lineKey:Point = new Point();
  private _noise:number = Util.instance.random(0, 1)

  constructor(opt:any = {}) {
    super()

    this._id = opt.id;
    this._con = opt.con;
    this._isScroll = opt.isScroll;

    this._mesh = new Mesh(
      opt.geo,
      new MeshPhongMaterial({
        color:new Color(Util.instance.random(0, 1), Util.instance.random(0, 1), Util.instance.random(0, 1)),
        emissive: new Color(Util.instance.random(0, 1), Util.instance.random(0, 1), Util.instance.random(0, 1)),
        // depthTest:!this._isScroll,
        depthTest:true,
        side:DoubleSide,
      }),
    );
    this.add(this._mesh);

    this._line = new LineSegments(
      opt.edgeGeo,
      new LineBasicMaterial({
        color:0x000000,
        depthTest:true,
        side:DoubleSide,
      })
    )
    this.add(this._line);

    if(this._isScroll) {
    } else {
      this._mesh.position.z = 0.5;
      this._line.position.z = 0.5;
    }
  }


  public setScrollVal(v:number):void {
    let ang = Util.instance.clamp(v * Util.instance.mix(0.5, 1.2, this._noise) * -1, -90, 0) * 1;
    // if(this._lineKey.x % 2 == 0) ang *= -1;
    this.rotation.x = Util.instance.radian(ang);

    if(this._oldAng != ang && (Math.abs(ang) == 180 || ang == 0)) {
      this._shake();
    }

    this._oldAng = ang;
  }


  private _shake():void {

    Tween.instance.a(this._shakeVal, {
      val:[0, 1]
    }, 0.1, 0, null, null, () => {
      let range = 0.1;
      // this._mesh.position.x = Util.instance.range(range);
      this._mesh.position.y = Util.instance.range(range);
      this._mesh.position.z = 0.5 + Util.instance.range(range);

      // this.rotation.x = Util.instance.radian(-90 + Util.instance.range(10))

      range = 1;
      // this._con.position.x = Util.instance.range(range);
      // this._con.position.y = Util.instance.range(range);
      // this._con.position.z = Util.instance.range(range * 2);
    }, () => {
      this._mesh.position.x = 0;
      this._mesh.position.y = 0;
      this._mesh.position.z = 0.5;

      // this.rotation.x = Util.instance.radian(-90)

      this._con.position.x = this._con.position.y = this._con.position.z = 0;
    })
  }


  public setSize(w:number, h:number, d:number):void {
    this.scale.set(w - d, d * 1, h - d);
  }


  public setLineKey(x:number, y:number):void {
    this._lineKey.x = x;
    this._lineKey.y = y;
  }


  protected _update():void {
    super._update();

    const sw = Func.instance.sw();
    // const sh = Func.instance.sh();
    // const itemSize = (sh / Conf.instance.HIT_ITEM_NUM) * 0.5;

    if(this._isScroll) {
      const s = Scroller.instance.val.y;

      this.rotation.x = Util.instance.radian(s * 2 * (this._id % 2 != 0 ? -1 : 1));
      // this.rotation.y = Util.instance.radian(s * -0.78);
      // this.rotation.z = Util.instance.radian(s * 0.92);

      // this.position.z = itemSize * 5;

      const size = sw * Func.instance.val(0.05, 0.05)
      // this.scale.set(size, 50, sw * 0.1);
      this.scale.set(size, 20, size);
      // this.visible = false;
    } else {
      // this.scale.set(sw * 0.5, 20, itemSize - 10);
    }

    this._line.position.copy(this._mesh.position)
  }


  protected _resize(): void {
    super._resize();
  }
}