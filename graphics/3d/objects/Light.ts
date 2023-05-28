import Vector3 from "../../../math/Vector3";

abstract class Light {
	private readonly position: Vector3;
	private readonly color: Vector3;

	protected constructor(color: Vector3, position: Vector3) {
		this.color = color;
		this.position = position;
	}

	public getPosition(): Vector3 {
		return this.position;
	}

	public getColor(): Vector3 {
		return this.color;
	}
}

export default Light;