#pragma strict

public var player : Transform;
public var FloatHeight : float;
public var CameraSmoothness : float;
public var CameraMovesWithPlayer : boolean;

function Start () {

}

function Update () {
	if (CameraMovesWithPlayer) {
		transform.position = Vector3.Lerp(transform.position, player.position + Vector3(0, FloatHeight, 0), Time.deltaTime * CameraSmoothness);
	}
	transform.LookAt(player);
}