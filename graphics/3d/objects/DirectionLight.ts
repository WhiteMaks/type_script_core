import Light from "./Light";
import Vector3 from "../../../math/Vector3";

class DirectionLight extends Light {

	public constructor(color: Vector3, position: Vector3) {
		super(color, position);
	}

}

export default DirectionLight;