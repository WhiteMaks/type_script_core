import Vector4 from "../../math/Vector4";

class Material {
	private readonly diffuseColor: Vector4;
	private readonly emissionColor: Vector4;
	private readonly refraction: number;

	public constructor(
		diffuseColor: Vector4,
		emissionColor: Vector4,
		refraction: number
	) {
		this.diffuseColor = diffuseColor;
		this.emissionColor = emissionColor;
		this.refraction = refraction;
	}

	public getDiffuseColor(): Vector4 {
		return this.diffuseColor;
	}

	public getEmissionColor(): Vector4 {
		return this.emissionColor;
	}

	public getRefraction(): number {
		return this.refraction;
	}
}

export default Material;