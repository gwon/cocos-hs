import { _decorator, Component, Enum, sp } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

export enum AnimationType {
    NONE = 0,
    TRIGGER,
    LANDING,
    LOOPING,
}

@ccclass("AnimationData")
export class AnimationData {
    constructor(type: AnimationType, name: string, speed: number) {
        this.type = type;
        this.name = name;
        this.speed = speed;
    }

    @property({ type: Enum(AnimationType) })
    type: AnimationType = AnimationType.NONE;

    @property
    name: string = "";

    @property
    speed: number = 1;
}

@ccclass("SymbolData")
@executeInEditMode(true)
export class SymbolData extends Component {
    @property({
        type: [AnimationData],
    })
    animationData: AnimationData[] = [];
    private animation: sp.Skeleton;

    @property({
        displayName: "Setup Animation By Type",
    })
    get setupAnimationByType() {
        return false;
    }
    set setupAnimationByType(value: boolean) {
        if (value) {
            this.animationData = [];
            const anis = this.animation.skeletonData.getAnimsEnum();
            for (const k of Object.keys(anis)) {
                let newType = AnimationType.NONE;
                if (k.toLocaleLowerCase().includes("trigger")) {
                    newType = AnimationType.TRIGGER;
                } else if (k.toLocaleLowerCase().includes("landing")) {
                    newType = AnimationType.LANDING;
                } else if (k.toLocaleLowerCase().includes("looping")) {
                    newType = AnimationType.LOOPING;
                }
                if (newType !== AnimationType.NONE) {
                    this.animationData.push(new AnimationData(newType, k, 1));
                }
            }
        }
    }

    @property({
        displayName: "Setup Animation By node name",
    })
    get setupAnimationByNodeName() {
        return false;
    }
    set setupAnimationByNodeName(value: boolean) {
        if (value) {
            this.animationData = [];
            const anis = this.animation.skeletonData.getAnimsEnum();
            const nodeName = this.node.name.toLowerCase();

            for (const k of Object.keys(anis)) {
                let newType = AnimationType.NONE;
                if (k.toLocaleLowerCase().includes(nodeName)) {
                    newType = AnimationType.TRIGGER;
                }
                if (newType !== AnimationType.NONE) {
                    this.animationData.push(new AnimationData(AnimationType.TRIGGER, k, 1));
                    break;
                }
            }
        }
    }

    private lastAnimationData: AnimationData = null;

    protected onLoad(): void {
        this.animation = this.node.getComponent(sp.Skeleton);
        // this.availableAnimations = Object.keys(this.animation.skeletonData.getAnimsEnum());
    }

    private populateAnimationsFromSkeleton() {
        console.log(this.animation.skeletonData.getAnimsEnum());
    }

    start() {}

    play(type: AnimationType, loop: boolean, speed: number | null = null) {
        console.log("play", this.node.name, ":", AnimationType[type]);
        const animationData = this.animationData.find((data) => data.type === type);
        if (animationData) {
            this.lastAnimationData = animationData;
            if (speed != null) {
                this.animation.timeScale = speed;
            } else {
                this.animation.timeScale = animationData.speed;
            }
            this.animation.setAnimation(0, animationData.name, loop);
        }
    }

    copyFrom(randomSymbol: SymbolData) {
        this.animation = randomSymbol.animation;
        this.animationData = randomSymbol.animationData;
    }

    findAnimationData(type: AnimationType) {
        return this.animationData.find((data) => data.type === type);
    }

    playLast1() {
        if (this.lastAnimationData) {
            this.play(this.lastAnimationData.type, false);
        }
    }

    continueStop() {
        console.log("continueStop", this.node.name);
        const trackEntry = this.animation.getCurrent(0);
        if (trackEntry) {
            trackEntry.loop = false;
            console.log(`Changed ${trackEntry.animation.name} from loop to non-loop`);
            return true;
        }
    }

    stop() {
        const animationData = this.findAnimationData(AnimationType.TRIGGER);
        if (animationData) {
            this.animation.setAnimation(0, animationData.name, false);
            this.animation.timeScale = 0;
        }
    }
}
