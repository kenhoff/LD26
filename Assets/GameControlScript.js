#pragma strict

public var OrangeScore : int;
public var BlueScore : int;

function Start () {
	OrangeScore = 0;
	BlueScore = 0;

}

function Update () {

}


function OnGUI () {
	var h = 25;
	var w = 75;
	// GUI.skin.label.fontSize = 20;
	// GUI.Label(Rect((Screen.width / 2) - w/2, (Screen.height / 2) - h/2, w, h), "SNAPE");

	GUI.Box(Rect(0, 0, w, h), "Orange: " + OrangeScore);
	GUI.Box(Rect(Screen.width - w, 0, w, h), "Blue: " + BlueScore);

}