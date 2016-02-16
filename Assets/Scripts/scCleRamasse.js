#pragma strict

/*
 * GameObject des clefs
 * @access public
 * @var cle
 */   

public var cle: GameObject;

/*
 * reference au script du minion
 * @access private
 * @var scMinion
 */   

private var scMinion: scMinion;

function Start () {
	scMinion = this.gameObject.GetComponent.<scMinion>();
}

function Update () {
	//si le minion meurt...
	if (scMinion.vieMinion == 0) {
		InstancierCle();
	}
}

function InstancierCle () {
		//...instancier la clé
		Instantiate(this.cle, transform.position, transform.rotation);

}
