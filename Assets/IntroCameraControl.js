#pragma strict

public var SplashTexture : Texture;
private var LookAtSnape : boolean;
private var snape : GameObject;

function Start () {
	Time.timeScale = 1;
	LookAtSnape = false;
	snape = GameObject.Find("Snape");
}

function Update () {
	if (LookAtSnape) {
		transform.position = Vector3.Lerp(transform.position, Vector3.zero + (10 * Vector3.up), Time.deltaTime / 5);
		transform.LookAt(snape.transform.position);
	}
	else {
		transform.RotateAround (Vector3.zero, Vector3.up, 20 * Time.deltaTime);
		transform.LookAt(Vector3.zero);
	}
}

// JavaScript
function OnGUI () {
	var h = 500;
	var w = 500;
	// GUI.skin.label.fontSize = 20;
	// GUI.Label(Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2, w, h), "SNAPE");
	if (LookAtSnape == false) {
		GUI.DrawTexture(Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2, w, h), SplashTexture, ScaleMode.ScaleAndCrop);
		h = 25;
		w = 150;
		if (GUI.Button (Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2 + 150, w, h), "Tutorial")) {
			// Application.LoadLevel("scene1");
			LookAtSnape = true;
		}
		h = 25;
		w = 100;
		if (GUI.Button (Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2 + 150 + h, w, h), "Play")) {
			Application.LoadLevel("scene1");
		}
	}
	if (LookAtSnape == true) {
		h = 25;
		w = 100;
		if (GUI.Button (Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2 + 150 + h + 25, w, h), "Back")) {
			// Application.LoadLevel("scene1");
			transform.position = Vector3(0, 20, -20);

			LookAtSnape = false;
		}
		h = 25;
		w = 100;
		if (GUI.Button (Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2 + 150 + h, w, h), "Play")) {
			Application.LoadLevel("scene1");
		}
		var h2 = 75;
		var w2 = 350;
		GUI.Box(Rect((Screen.width / 2) - w2/2, (Screen.height / 2) - h2/2 + 50 + h2, w2, h2), "This is the Snape. \nWhen the snape turns your team's color, DEFEND it. \nWhen the snape turns the other team's color, THWACK it. \n10 points to win!");
	}
	
}