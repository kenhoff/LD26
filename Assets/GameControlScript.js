#pragma strict

public var OrangeScore : int;
public var BlueScore : int;

public var PointsToWin : int;

private var ScoreDisplayTime : float;
private var OrangePointDisplay : boolean;
private var BluePointDisplay : boolean;
private var GameOver : boolean;

function Start () {
	OrangeScore = 0;
	BlueScore = 0;

}

function Update () {
	if (Input.GetKeyDown(KeyCode.Escape)) {
		Application.LoadLevel("intro_scene");
	}

	if ((OrangeScore >= PointsToWin) || (BlueScore >= PointsToWin)) {
		end_game();
	}
	if (ScoreDisplayTime < 0) {
		OrangePointDisplay = false;
		BluePointDisplay = false;
	}
	else {
		ScoreDisplayTime -= Time.deltaTime;
	}
}

function Score(team : String) {
	if (team == "Orange") {
		OrangeScore++;
		BluePointDisplay = false;
		OrangePointDisplay = true;
	}
	else {
		BlueScore++;
		OrangePointDisplay = false;
		BluePointDisplay = true;
	}
	ScoreDisplayTime = 2.0;
}


function OnGUI () {
	var h = 25;
	var w = 75;

	GUI.Box(Rect(0, 0, w, h), "Orange: " + OrangeScore);
	GUI.Box(Rect(Screen.width - w, 0, w, h), "Blue: " + BlueScore);

	var h2 = 25;
	var w2 = 150;

	if (ScoreDisplayTime > 0) {
		var text = "";
		if (OrangePointDisplay) {
			text = "Orange scored!";
		}
		else text = "Blue scored!";
		GUI.Box(Rect(Screen.width/2 - w2/2, Screen.height/2 - h2/2 - 200, w2, h2), text);
	}
	if (GameOver) {
		text = "";
		if (OrangeScore > BlueScore) {
			text = "Orange wins!";
		}
		else text = "Blue wins!";
		GUI.Box(Rect(Screen.width/2 - w2/2, Screen.height/2 - h2/2 - 150, w2, h2), text);
		if (GUI.Button(Rect(Screen.width/2 - w2/2, Screen.height - 300, w2, h2), "Exit")) {
			Application.LoadLevel("intro_scene");
		}
	}
}

function end_game () {
	GameOver = true;
	Time.timeScale = 0;
}