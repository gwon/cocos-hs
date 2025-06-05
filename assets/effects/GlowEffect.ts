import { _decorator, Component, Material, Sprite, Vec4, Color, EffectAsset, resources } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("GlowEffect")
@executeInEditMode
export class GlowEffect extends Component {
    @property({ type: EffectAsset, tooltip: "Glow Effect Asset" })
    public glowEffect: EffectAsset = null;

    @property({ tooltip: "สีของ glow" })
    public glowColor: Color = new Color(255, 255, 0, 255);

    @property({ range: [0, 20], tooltip: "ขนาดของ glow" })
    public glowSize: number = 5.0;

    @property({ range: [0, 5], tooltip: "ความแรงของ glow" })
    public glowIntensity: number = 2.0;

    @property({ range: [1, 10], tooltip: "จำนวน samples สำหรับ blur" })
    public blurSamples: number = 4;

    private _material: Material | null = null;
    private _sprite: Sprite | null = null;

    onLoad() {
        this._sprite = this.getComponent(Sprite);
        this.createGlowMaterial();
    }

    private createGlowMaterial() {
        if (!this.glowEffect) {
            console.error("Glow Effect Asset is not assigned!");
            return;
        }

        this._material = new Material();
        this._material.initialize({ effectAsset: this.glowEffect });

        if (this._sprite) {
            this._sprite.material = this._material;
        }

        this.updateShaderProperties();
    }

    private updateShaderProperties() {
        if (!this._material) return;

        this._material.setProperty(
            "glowColor",
            new Vec4(
                this.glowColor.r / 255,
                this.glowColor.g / 255,
                this.glowColor.b / 255,
                this.glowColor.a / 255
            )
        );

        this._material.setProperty("glowSize", this.glowSize);
        this._material.setProperty("glowIntensity", this.glowIntensity);
        this._material.setProperty("blurSamples", this.blurSamples);

        if (this._sprite && this._sprite.spriteFrame) {
            const texture = this._sprite.spriteFrame.texture;
            this._material.setProperty(
                "u_texSize",
                new Vec4(texture.width, texture.height, 1.0 / texture.width, 1.0 / texture.height)
            );
        }
    }

    public updateEffect() {
        this.updateShaderProperties();
    }

    public setGlowColor(color: Color) {
        this.glowColor = color;
        this.updateShaderProperties();
    }

    public setGlowSize(size: number) {
        this.glowSize = size;
        this.updateShaderProperties();
    }

    public setGlowEnabled(enabled: boolean) {
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
