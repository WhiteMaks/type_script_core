class Attenuation {
	private constant: number;
	private linear: number;
	private quadratic: number;

	constructor(constant: number, linear: number, quadratic: number) {
		this.constant = constant;
		this.linear = linear;
		this.quadratic = quadratic;
	}

	public getConstant(): number {
		return this.constant;
	}

	public setConstant(constant: number): void {
		this.constant = constant;
	}

	public getLinear(): number {
		return this.linear;
	}

	public setLinear(linear: number): void {
		this.linear = linear;
	}

	public getQuadratic(): number {
		return this.quadratic;
	}

	public setQuadratic(quadratic: number): void {
		this.quadratic = quadratic;
	}
}

export default Attenuation;