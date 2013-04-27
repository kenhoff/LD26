// #pragma strict

public var MoveTorque : float;
public var IsSnape : boolean;
public var IsPlayer : boolean;
public var IsEnemy : boolean;

private var SnapeDirection : Vector2;
private var SnapeTimeRemaining : float;

private var snape : GameObject;

function Start () {
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
		if (SnapeTimeRemaining > 0) {
			move_towards_vector(SnapeDirection);
			SnapeTimeRemaining -= Time.deltaTime;
		}
		else {
			get_new_snape_direction();
		}
	}

	if (IsEnemy) {
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
		}
		// Debug.Log("collided with " + collisioninfo.gameObject);
	}
}

function move_towards_vector (input : Vector2) {
	// input = input.normalized;
	rigidbody.AddTorque(Vector3(input.x, 0, -input.y) * MoveTorque);
}

function get_new_snape_direction () {
	SnapeTimeRemaining = Random.Range(1, 3);
	SnapeDirection = Random.insideUnitCircle;
}

function find_snape () {
	var gos = GameObject.FindGameObjectsWithTag("Snape");
	for (var go in gos) {
		return go;
	}
}