// #pragma strict

public var player : Transform;
public var FloatHeight : float;
public var CameraSmoothness : float;
public var CameraMovesWithPlayer : boolean;

function Start () {
	if (!player.gameObject.activeInHierarchy) {
		player = GameObject.Find("Snape").transform;
	}

}

function Update () {
	if (CameraMovesWithPlayer) {
		transform.position = Vector3(map(player.position.x, -20, 20, -17.5, 17.5), 20, -20);
	}
	// Debug.Log("new camera position: " + map(player.position.x, -20, 20, -18, 18));
	transform.LookAt(player);
	// camera.fieldOfView = map((player.transform.position - transform.position).magnitude, 20, 40, -50, -25);
	camera.fieldOfView = 70 - (player.transform.position - transform.position).magnitude;
	// Debug.Log((player.transform.position - transform.position).magnitude);
}

function map (input : float, min1, max1, min2, max2) {
	return (input * (max2 - min2)) / (max1 - min1);
}