// #pragma strict

public var MoveTorque : float;
public var IsSnape : boolean;
public var IsPlayer : boolean;
public var IsCPU : boolean;

public var BallHitClip : AudioClip;
public var SnapeGreenNoHitClip : AudioClip;
public var SnapeGreenHitClip : AudioClip;
public var SnapeOrangeBlueClip : AudioClip;

private var SnapeDirection : Vector2;
private var SnapeMoveTimeRemaining : float;
private var SnapeColorTimeRemaining : float;
private var SnapeFlashTimeRemaining : float;
public var SnapeColor : String;
public var SnapeDampening : float;
private var LastSnapeColor : String;


private var CPUDirection : Vector2;
private var CPUMoveTimeRemaining : float;
private var CPUCurrentAction : String;
// private var CPUFlashTimeRemaining : float;
// public var CPUDifficulty : float = 1.0; // 0 is hardest, 1+ is easier

private var SnapeColors = ["Green", "Orange", "Blue"];

private var snape : GameObject;
private var ref : GameObject;

function Start () {
	if (IsSnape) {
		LastSnapeColor = "None";
		reset_snape();
	}
	if (IsCPU) {
		CPUCurrentAction = "Attack";
		CPUMoveTimeRemaining = Random.Range(3.0, 5.0);
	}
	ref = GameObject.Find("Referee");
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
		else if (SnapeColor == "Green") {
			get_new_snape_direction();
		}

		if ((SnapeColor == "Blue") || (SnapeColor == "Orange")) {
			rigidbody.angularVelocity = rigidbody.angularVelocity * Time.deltaTime * SnapeDampening;
		}

		if (SnapeColorTimeRemaining < 0) {
			// Debug.Log("Snape color is now " + SnapeColor);
			change_to_next_snape_color();
		}
		SnapeMoveTimeRemaining -= Time.deltaTime;
		SnapeColorTimeRemaining -= Time.deltaTime;
		// Debug.Log("Current Snape Time remaining: " + SnapeColorTimeRemaining);
	}

	if (IsCPU) {

		if (CPUMoveTimeRemaining < 0) {
			if (CPUCurrentAction == "Run") {
				CPUCurrentAction = "Attack";
				CPUMoveTimeRemaining = Random.Range(3.0, 5.0);
			}
			else {
				CPUCurrentAction = "Run";
				CPUMoveTimeRemaining = Random.Range(0.5, 2.0);
			}
		}

		var snape = find_snape();
		if (snape.GetComponent(BallControl).SnapeColor == gameObject.tag) {
			// Debug.Log("wrong way!");
			var enemy = get_nearest_enemy();
			var diff = enemy.transform.position - transform.position;

		}
		else {
			diff = snape.transform.position - transform.position;
		}
		var direction = Vector2(diff.z, diff.x);
		var difficulty = ref.GetComponent(GameControlScript).Difficulty;
		var random_direction = Random.insideUnitCircle.normalized;
		direction = (direction + (random_direction * difficulty)).normalized;
		if (CPUCurrentAction == "Run") {
			direction = -direction;
		}
		move_towards_vector(direction);
		CPUMoveTimeRemaining -= Time.deltaTime;
	}

}

function get_nearest_enemy () {
	var search_tag = "";
	if (gameObject.tag == "Orange") {
		search_tag = "Blue";
	}
	else search_tag = "Orange";
	var gos : GameObject[];
    gos = GameObject.FindGameObjectsWithTag(search_tag); 
    var closest : GameObject; 
    var distance = Mathf.Infinity; 
    var position = transform.position; 
    // Iterate through them and find the closest one
    for (var go : GameObject in gos)  { 
        var diff = (go.transform.position - position);
        var curDistance = diff.sqrMagnitude; 
        if (curDistance < distance) { 
            closest = go; 
            distance = curDistance; 
        } 
    } 
    return closest;
}

function OnCollisionEnter (collisioninfo : Collision) {
	// Debug.Log("collision!");
	
	if (collisioninfo.gameObject.layer == 8) {
		// if (collisioninfo.relativeVelocity.magnitude > 2) {
		// 	// audio.clip = BallHitClip;
		// 	// // audio.volume = .5;
		// 	// audio.Play();
		// 	// audio.volume = 1;
		// }
		if (IsSnape) {
			// Debug.Log("snape hit by ball!");
			if (collisioninfo.relativeVelocity.magnitude > 6) {
				
				if (SnapeColor == "Blue") {
					GameObject.Find("Referee").GetComponent(GameControlScript).Score("Orange");
					reset_snape();
					audio.clip = SnapeGreenHitClip;
					audio.Play();
				}
				if (SnapeColor == "Orange") {
					GameObject.Find("Referee").GetComponent(GameControlScript).Score("Blue");
					reset_snape();
					audio.clip = SnapeGreenHitClip;
					audio.Play();
				}
				
			}
			// Debug.Log(collisioninfo.relativeVelocity.magnitude);
		}
		// Debug.Log("collided with " + collisioninfo.gameObject);
	}
}

function move_towards_vector (input : Vector2) {
	input = input.normalized;
	rigidbody.AddTorque(Vector3(input.x, 0, -input.y) * MoveTorque);
}

function get_new_snape_direction () {
	SnapeMoveTimeRemaining = Random.Range(1.0, 3.0);
	var normalized_towards_center = -transform.position.normalized;
	var vec2_toward_center = Vector2(normalized_towards_center.z, normalized_towards_center.x).normalized;
	// Debug.Log("heading: " + vec2_toward_center.normalized);
	SnapeDirection = (Random.insideUnitCircle.normalized + vec2_toward_center.normalized).normalized; //Vector2
	// SnapeDirection = (Random.insideUnitCircle.normalized + (vec2_toward_center*2)).normalized; //Vector2
}

function find_snape () {
	return GameObject.Find("Snape");
}

function change_to_next_snape_color () {

	// if snape is currently green, change to orange/blue for 2-4 seconds

	if (SnapeColor == "Green") {
		SnapeColor = pick_orange_or_blue();
		if (SnapeColor == "Blue") {
			transform.renderer.material.color = Color.cyan;
			light.color = Color.cyan;
		}
		else {
			transform.renderer.material.color = Color(255.0/255, 81.0/255, 0/255, 255/255);
			light.color = Color(255.0/255, 81.0/255, 0/255, 255/255);
		}
		SnapeColorTimeRemaining = Random.Range(2.0, 4.0);
	}

	else {
		reset_snape();
	}

	if ((SnapeColor == "Blue") || (SnapeColor == "Orange")){
		audio.clip = SnapeOrangeBlueClip;
		audio.Play();
	}
	else {
		audio.clip = SnapeGreenNoHitClip;
		audio.Play();
	}
}

function reset_snape () {
	SnapeColor = "Green";
	transform.renderer.material.color = Color.green;
	light.color = Color.green;

	SnapeColorTimeRemaining = Random.Range(5, 10);

}

function pick_orange_or_blue () {

	if (LastSnapeColor == "None") {
		if (Random.Range(0, 1) == 0) {
			LastSnapeColor = "Blue";
			return "Blue";
		}
		else {
			LastSnapeColor = "Orange";
			return "Orange";
		}
	}

	if (LastSnapeColor == "Blue") {
		LastSnapeColor = "Orange";
		return "Orange";
	}
	else {
		LastSnapeColor = "Blue";
		return "Blue";
	}

	// orange_score = GameObject.Find("Referee").GetComponent(GameControlScript).OrangeScore;
	// blue_score = GameObject.Find("Referee").GetComponent(GameControlScript).BlueScore;
	// score_sum = orange_score + 1.0 + blue_score + 1.0; 

	// orange_chance = 1 - ((orange_score + 1) / score_sum);
	// if (Random.value > orange_chance) {
	// 	return "Orange";
	// }
	// else return "Blue";

	// if (Random.Range(0, 2) == 0) {
	// 	return "Orange";
	// } 
	// else return "Blue";
}