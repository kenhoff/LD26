#pragma strict

public var SplashTexture : Texture;

function Start () {

}

function Update () {
	transform.RotateAround (Vector3.zero, Vector3.up, 20 * Time.deltaTime);
	transform.LookAt(Vector3.zero);
}

// JavaScript
function OnGUI () {
	var h = 200;
	var w = 200;
	// GUI.skin.label.fontSize = 20;
	// GUI.Label(Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2, w, h), "SNAPE");
	GUI.DrawTexture(Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2, w, h), SplashTexture, ScaleMode.ScaleAndCrop);
	h = 25;
	w = 100;
	if (GUI.Button (Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2 + 150, w, h), "PLAY")) {
		Application.LoadLevel("scene1");
	}
}