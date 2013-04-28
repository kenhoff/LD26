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


private var CPUDirection : Vector2;
private var CPUMoveTimeRemaining : float;
private var CPUCurrentAction : String;
// private var CPUFlashTimeRemaining : float;

private var SnapeColors = ["Green", "Orange", "Blue"];

private var snape : GameObject;

function Start () {
	if (IsSnape) {
		reset_snape();
	}
	if (IsCPU) {
		CPUCurrentAction = "Attack";
		CPUMoveTimeRemaining = Random.Range(3.0, 5.0);
	}
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
			// Debug.Log("Snape color is now " + SnapeColor);
			change_snape_color_random();
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
			// Debug.Log("Snape color: " + snape.GetComponent(BallControl).SnapeColor);
			// Debug.Log("CPU color: " + gameObject.tag);
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
		if (collisioninfo.relativeVelocity.magnitude > 2) {
			audio.clip = BallHitClip;
			// audio.volume = .5;
			audio.Play();
			// audio.volume = 1;
		}
		if (IsSnape) {
			// Debug.Log("snape hit by ball!");
			if (collisioninfo.relativeVelocity.magnitude > 3) {
				
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
	SnapeMoveTimeRemaining = Random.Range(1, 3);
	SnapeDirection = Random.insideUnitCircle;
}

function find_snape () {
	return GameObject.Find("Snape");
}

function change_snape_color_random () {

	SnapeColor = SnapeColors[Mathf.Floor(Random.Range(0, SnapeColors.length))];



	if (SnapeColor == "Blue") {
		// Debug.Log("changing color to blue");
		transform.renderer.material.color = Color.cyan;
		SnapeColorTimeRemaining = Random.Range(2.0, 4.0);

	}
	if (SnapeColor == "Orange") {
		transform.renderer.material.color = Color(255.0/255, 81.0/255, 0/255, 255/255);
		SnapeColorTimeRemaining = Random.Range(2.0, 4.0);

	}
	if (SnapeColor == "Green") {
		transform.renderer.material.color = Color.green;
		SnapeColorTimeRemaining = Random.Range(3.0, 5.0);

	}

	SnapeColorTimeRemaining = Random.Range(3.0, 5.0);

	if ((SnapeColor == "Blue") || (SnapeColor == "Orange")){
		audio.clip = SnapeOrangeBlueClip;
		audio.Play();
	}
	else {
		audio.clip = SnapeGreenNoHitClip;
		audio.Play();
	}

	// Debug.Log("current color is: " + transform.renderer.material.color);
	// transform.renderer.material.color = Color(255.0/255, 81.0/255, 0/255, 255/255);
	// Debug.Log("current color is now: " + transform.renderer.material.color);
	
}

function reset_snape () {
	SnapeColor = "Green";
	transform.renderer.material.color = Color.green;
	SnapeColorTimeRemaining = Random.Range(5, 10);

}