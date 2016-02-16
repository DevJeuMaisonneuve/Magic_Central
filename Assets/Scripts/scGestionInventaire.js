#pragma strict
import UnityEngine.UI;

/*
 * Contient le nombre de clefs du personnage
 * @access public
 * @var nbClefs
 */
 public var nbClefs:int;
/*
 * Contient le nombre d'or du personnage
 * @access public
 * @var orInventaire
 */
 public var orInventaire:int;

 /*
 * Contient le nombre de potions de vie 
 * @access public
 * @var nbPotionsVie
 */

 public var nbPotionsVie:int;


 /*
 * Contient le nombre de potions de vie max
 * @access public
 * @var nbPotionsVieMax
 */

 public var nbPotionsVieMax:int=3;

  /*
 * Contient le nombre de potions de mana 
 * @access public
 * @var nbPotionsMana
 */

 public var nbPotionsMana:int;

  /*
 * Contient le nombre de potions de mana max
 * @access public
 * @var nbPotionsManaMax
 */

 public var nbPotionsManaMax:int=3;
  /*
 * Référence ArgentTexte
 * @access public
 * @var ArgentTexte
 */                 
               
public var ClefsTexte:Text;      
  /*
 * Référence ArgentTexte
 * @access public
 * @var ClefsTexte
 */    
                            
public var ArgentTexte:Text;      

   /*
 * Référence  PotionSant
 * @access public
 * @var  PotionSant
 */                               
public var PotionSanteTexte:Text;     

   /*
 * Référence PotionMana
 * @access public
 * @var PotionMana
 */                               
public var PotionManaTexte:Text;       
private var gestionMana:scDeplacementTirHero;
//private var scOuvrirPorte:scOuvrirPorte;
//public var Trigger:GameObject;

/*
 * Source des effets sonores 
 * @access public
 * @var sourceSonore
 */

 public var sourceSonore:AudioSource;

 /*
 * Effets sonores 
 * @access public
 * @var sonOr sonBoire
 */

public var sonOr:AudioClip;
public var sonBoire:AudioClip;
public var sonPotion:AudioClip;

function Start () {

	// Variable de test
	orInventaire = PlayerPrefs.GetInt('Or'); //va chercher le nb d'or
	nbPotionsVie =PlayerPrefs.GetInt('nbPotionsVie'); //va chercher le nb de Potions de Vie
	nbPotionsMana=  PlayerPrefs.GetInt('nbPotionsMana'); //va chercher le nb de Potions de Mana
	nbClefs=  PlayerPrefs.GetInt('Clefs'); //va chercher le nb de clefs
//	scOuvrirPorte = Trigger.GetComponent.<scOuvrirPorte>();
sourceSonore.volume= PlayerPrefs.GetFloat("Volume"); //Place le niveau du volume des playerprefs dans la variable du slider
}

function Awake ()
{
	gestionMana= GetComponent(scDeplacementTirHero);
}

function Update () {
	ArgentTexte.text = orInventaire.ToString();	
	PotionSanteTexte.text = nbPotionsVie.ToString();	
	PotionManaTexte.text = nbPotionsMana.ToString();
	ClefsTexte.text = nbClefs.ToString();	
	if(orInventaire<0){orInventaire=0;}
	if(nbPotionsVie<0){nbPotionsVie=0;}
	gestionMana.MettreAJourTotal(nbPotionsMana);
	gestionMana.MettreAJourTotalVie(nbPotionsVie);

}

function diminutionOrVie(prixPotionVie:int) 
{
	
	orInventaire = orInventaire-prixPotionVie;
	Debug.Log("Or :"+orInventaire);
	// On stocke l'or dans des players prefs quand le joueur va changer de scene
	PlayerPrefs.SetInt("Or", orInventaire);

}

function augmenterPotionVie(nbPotion:int) 
{
	
	nbPotionsVie = nbPotionsVie+nbPotion;
	Debug.Log("Potions de Vie :" +nbPotionsVie);
	// On stocke les potions de vie dans des players prefs quand le joueur va changer de scene
	PlayerPrefs.SetInt("nbPotionsVie", nbPotionsVie);
}

function diminutionOrMana(prixPotionMana:int) 
{
	
	orInventaire = orInventaire-prixPotionMana;
	Debug.Log("Or :"+orInventaire);
	// On stocke l'or dans des players prefs quand le joueur va changer de scene
	PlayerPrefs.SetInt("Or", orInventaire);

}

function augmenterPotionMana(nbPotion:int) 
{
	
	nbPotionsMana = nbPotionsMana+nbPotion;
	Debug.Log("Potions de mana :" + nbPotionsMana);
	// On stocke les potions de mana dans des players prefs quand le joueur va changer de scene
	PlayerPrefs.SetInt("nbPotionsMana", nbPotionsMana);
}

function augmenterOr(nbOr:int) 
{
	
	orInventaire += nbOr;
	Debug.Log("Or :" + orInventaire);
	// On stocke l'or dans des players prefs quand le joueur va changer de scene
	PlayerPrefs.SetInt("Or", orInventaire);
}

//function augmenterClefs(nbClefs:int) 
//{
//	
//	nbClefs += nbClefs;
//	Debug.Log("Clefs :" + nbClefs);
//	// On stocke les clefs dans des players prefs quand le joueur va changer de scene
//	PlayerPrefs.SetInt("Clefs", nbClefs);
//}

function OnTriggerEnter (autre : Collider) {
	if (autre.gameObject.tag == "tasOr") {
		sourceSonore.clip = sonOr;
		sourceSonore.Play();
		augmenterOr(25);
		Destroy(autre.gameObject);
	}

	if (autre.gameObject.tag == "Clef") {
		nbClefs ++;
		Destroy(autre.gameObject);
		PlayerPrefs.SetInt("Clefs", nbClefs);
//		scOuvrirPorte.SendMessageUpwards("augmenterClefs", nbClefs , SendMessageOptions.DontRequireReceiver);
	}

	if (autre.gameObject.tag == "potionVie") {
		if (nbPotionsVie <= nbPotionsVieMax){
			sourceSonore.clip = sonPotion;
			sourceSonore.Play();
			augmenterPotionVie(1);
			Destroy(autre.gameObject);
		}
	}
	if (autre.gameObject.tag == "potionMana") {
		if (nbPotionsMana <= nbPotionsManaMax){
			sourceSonore.clip = sonPotion;
			sourceSonore.Play();
			augmenterPotionMana(1);
			Destroy(autre.gameObject);
		}

	}

}