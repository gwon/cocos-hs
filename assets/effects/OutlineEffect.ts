import { _decorator, Component, Material, Sprite, Vec4, Color, EffectAsset, resources } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("OutlineEffect")
@executeInEditMode
export class OutlineEffect extends Component {
    @property({ type: EffectAsset, tooltip: "Outline Effect Asset" })
    public outlineEffect: EffectAsset = null;

    @property({ tooltip: "สีของ outline" })
    public outlineColor: Color = new Color(255, 255, 255, 255);

    @property({ range: [0, 10], tooltip: "ความกว้างของ outline" })
    public outlineWidth: number = 2.0;

    @property({ range: [0, 1], tooltip: "ความแรงของ outline" })
    public outlineStrength: number = 1.0;

    private _material: Material | null = null;
    private _sprite: Sprite | null = null;

    onLoad() {
        this._sprite = this.getComponent(Sprite);
        if (!this._sprite) {
            console.error("No Sprite component found!");
            return;
        } else {
            console.log("Sprite component found!");
        }
        this.createOutlineMaterial();
    }

    start() {
        this.updateShaderProperties();
    }

    private createOutlineMaterial() {
        if (!this.outlineEffect) {
            console.error("Outline Effect Asset is not assigned!");
            return;
        }

        this._material = new Material();
        this._material.initialize({ effectAsset: this.outlineEffect });

        if (this._sprite) {
            this._sprite.material = this._material;
        }

        this.updateShaderProperties();
    }

    private updateShaderProperties() {
        if (!this._material) {
            console.log("Material is null!");
            return;
        }

        console.log("Updating shader properties:", {
            color: this.outlineColor,
            width: this.outlineWidth,
            strength: this.outlineStrength,
        });

        // ส่งค่าไปยัง shader
        this._material.setProperty(
            "outlineColor",
            new Vec4(
                this.outlineColor.r / 255,
                this.outlineColor.g / 255,
                this.outlineColor.b / 255,
                this.outlineColor.a / 255
            )
        );

        this._material.setProperty("outlineWidth", this.outlineWidth);
        this._material.setProperty("outlineStrength", this.outlineStrength);

        // อัพเดท texture size สำหรับการคำนวณ offset
        if (this._sprite && this._sprite.spriteFrame) {
            const texture = this._sprite.spriteFrame.texture;
            this._material.setProperty(
                "u_texSize",
                new Vec4(texture.width, texture.height, 1.0 / texture.width, 1.0 / texture.height)
            );
        }
    }

    // เรียกใช้เมื่อมีการเปลี่ยนแปลงใน Inspector
    public updateEffect() {
        this.updateShaderProperties();
    }

    // สำหรับเปลี่ยนสีแบบ runtime
    public setOutlineColor(color: Color) {
        this.outlineColor = color;
        this.updateShaderProperties();
    }

    // สำหรับเปลี่ยนความกว้างแบบ runtime
    public setOutlineWidth(width: number) {
        this.outlineWidth = width;
        this.updateShaderProperties();
    }

    // เปิด/ปิด outline effect
    public setOutlineEnabled(enabled: boolean) {
        if (this._sprite) {
            if (enabled && this._material) {
                this._sprite.material = this._material;
            } else {
                this._sprite.material = null;
            }
        }
    }

    onDestroy() {
        if (this._material) {
            this._material.destroy();
        }
    }
}
