/**
 * Create on 28.08.2022
 *
 * @author WhiteMaks
 */

import MouseEventType from "../enums/MouseEventType";
import Mouse from "../Mouse";
import MousePosition from "../support/MousePosition";

/**
 * Класс для описания событий мышки
 */
class MouseEvent {
    /**
     * Тип события
     * @private
     */
    private readonly type: MouseEventType;
    private readonly position: MousePosition;

    private readonly leftKeyIsPressed: boolean;
    private readonly rightKeyIsPressed: boolean;

    public constructor(type: MouseEventType, parent: Mouse) {
        this.type = type;

        this.leftKeyIsPressed = parent.isLeftKeyIsPressed();
        this.rightKeyIsPressed = parent.isRightKeyIsPressed();

        this.position = parent.getPosition();
    }

    public isValid(): boolean {
        return this.type !== MouseEventType.INVALID;
    }

    public getPosition(): MousePosition {
        return this.position;
    }

    public getType(): MouseEventType {
        return this.type;
    }

    public isLeftKeyIsPressed(): boolean {
        return this.leftKeyIsPressed;
    }

    public isRightKeyIsPressed(): boolean {
        return this.rightKeyIsPressed;
    }

}

export default MouseEvent;