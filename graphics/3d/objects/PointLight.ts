import Light from "./Light";
import Vector3 from "../../../math/Vector3";
import Attenuation from "../../../physics/Attenuation";

class PointLight extends Light {
	private readonly attenuation: Attenuation;

	public constructor(color: Vector3, position: Vector3, attenuation: Attenuation) {
		super(color, position);

		this.attenuation = attenuation;
	}

	public getAttenuation(): Attenuation {
		return this.attenuation;
	}
}

export default PointLight;