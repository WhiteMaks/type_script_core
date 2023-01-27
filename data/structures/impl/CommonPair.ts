/**
 * Create on 15/11/2022
 *
 * @author WhiteMaks
 */
import Pair from "../Pair";

class CommonPair<Left, Right> implements Pair<Left, Right> {
    private readonly left: Left;
    private readonly right: Right;

    public constructor(left: Left, right: Right) {
        this.left = left;
        this.right = right;
    }

    public getLeft(): Left {
        return this.left;
    }

    public getRight(): Right {
        return this.right;
    }

}

export default CommonPair;