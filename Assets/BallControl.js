// #pragma strict

public var MoveTorque : float;
public var IsSnape : boolean;
public var IsPlayer : boolean;
public var IsCPU : boolean;

private var SnapeDirection : Vector2;
private var SnapeMoveTimeRemaining : float;
private var SnapeColorTimeRemaining : float;
private var SnapeFlashTimeRemaining : float;
public var SnapeColor : String;

private var SnapeColors = ["Green", "Orange", "Blue"];

private var snape : GameObject;

function Start () {
	SnapeColor = "Green";
}

function FixedUpdate () {
	if (IsPlayer) {
		var horiz_input = Input.GetAxis("Horizontal") * Time.deltaTime;
		var vert_input = Input.GetAxis("Vertical") * Time.deltaTime;
		// rigidbody.AddTorque(Vector3(vert_input, 0, -horiz_input) * MoveTorque);
		move_towards_vector(Vector2(vert_input, horiz_input));
	}
	// rigidbody.AddForce(Vector3(horiz_input, 0, vert_input) * MoveTorque);

	// Debug.Log("ball speed: " + rigidbody.velocity.magnitude);

	if (IsSnape) {
		if ((SnapeMoveTimeRemaining > 0) && (SnapeColor == "Green")) {
			move_towards_vector(SnapeDirection);
		}
		else {
			get_new_snape_direction();
		}
		if (SnapeColorTimeRemaining < 0) {
			SnapeColor = SnapeColors[Mathf.Floor(Random.Range(0, SnapeColors.length))];
			Debug.Log("Snape color is now " + SnapeColor);

			SnapeColorTimeRemaining = Random.Range(5, 10);
		}
		SnapeMoveTimeRemaining -= Time.deltaTime;
		SnapeColorTimeRemaining -= Time.deltaTime;
	}

	if (IsCPU) {
		var snape = find_snape();
		var diff = snape.transform.position - transform.position;
		move_towards_vector(Vector2(diff.z, diff.x));
	}

}

function OnCollisionEnter (collisioninfo : Collision) {
	// Debug.Log("collision!");
	if (IsSnape) {
		if (collisioninfo.gameObject.layer == 8) {
			Debug.Log("snape hit by ball!");
			if (SnapeColor == "Blue") {
				GameObject.Find("Referee").GetComponent(GameControlScript).OrangeScore++;
			}
			if (SnapeColor == "Orange") {
				GameObject.Find("Referee").GetComponent(GameControlScript).BlueScore++;
			}

		}
		// Debug.Log("collided with " + collisioninfo.gameObject);
	}
}

function move_towards_vector (input : Vector2) {
	// input = input.normalized;
	rigidbody.AddTorque(Vector3(input.x, 0, -input.y) * MoveTorque);
}

function get_new_snape_direction () {
	SnapeMoveTimeRemaining = Random.Range(1, 3);
	SnapeDirection = Random.insideUnitCircle;
}

function find_snape () {
	return GameObject.Find("Snape");
}

function change_snape_color () {
	
}