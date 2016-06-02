#pragma strict

/*
 * Référence au heros
 * @access public
 * @var heros
 */ 
public var heros:GameObject;

private var rigidBodyHeros:Rigidbody;

function Start () {
	rigidBodyHeros = heros.GetComponent.<Rigidbody>();
}

function Update () {

}

/* fonction pour faire une rotation du personnage en X lorsqu'il traverse le pont final au niveau 4 */

function OnTriggerEnter(heros:Collider) {
	if (heros.tag == "Hero") {
		rigidBodyHeros.drag = 1;
	}
}

function OnTriggerExit(heros:Collider) {
	if (heros.tag == "Hero") {
		rigidBodyHeros.drag = 1000000;
	}
}