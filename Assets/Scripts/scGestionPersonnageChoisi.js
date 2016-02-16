/*
 * GameObject + Controller correspondant au hero choisi
 * @access public
 * @var Nakiya
 */   

public var Nakiya: GameObject;
public var controllerNakiya:Animator;
/*
 *  GameObject + Controlle correspondant au hero choisi
 * @access public
 * @var Kaseem
 */   

public var Kaseem: GameObject;
public var controllerKaseem:Animator;
/*
 *  GameObject + Controlle correspondant au hero choisi
 * @access public
 * @var Kayden
 */   

public var Kayden: GameObject;
public var controllerKayden:Animator;

/*
 *  Controller du héros choisi
 * @access private
 * @var controllerChoisi
 */   

 private var controllerChoisi:Animator;

var heroEnregistrer : int; // si le joueur ne sélectionne personne il à par defaut le héros 1
function Start () {

}

function Awake () {
heroEnregistrer = PlayerPrefs.GetInt('heroChoisi'); //va cherhcer le héros choisi dans le menu


	if (heroEnregistrer == 1){
		controllerChoisi = controllerNakiya;
		Destroy(Kaseem); // détruit les héros inutile dans le gameobject pour optimiser le jeu
		Destroy(Kayden);
	}

	if (heroEnregistrer == 2){
		controllerChoisi = controllerKaseem;
		Destroy(Nakiya);
		Destroy(Kayden);


	}

	if (heroEnregistrer == 3){
		controllerChoisi = controllerKayden;
		Destroy(Nakiya);
		Destroy(Kaseem);
	}
}