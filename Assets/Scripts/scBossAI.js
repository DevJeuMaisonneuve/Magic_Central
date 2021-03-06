﻿#pragma strict
/*
 * Énumeration des states de la FSM
 * @access private
 * @var aiState
 */   
enum aiState {Attente, Courrir, AttaqueBasique, AttaquePuissante, AttaqueInvisible, Mourir}

/*
 * variable state
 * @access public
 * @var state
 */   

var state : aiState;
/*
 * vie du boss
 * @access public
 * @var vieBoss
 */   

public var vieBoss:int = 800;

/*
 * Dégats du boss
 * @access private
 * @var degatMinion
 */   

public var degatBoss:int;


/*
 * Cible du boss
 * @access public
 * @var cible
 */  
  
public var cible : Transform;
/*
 * Référence au script de gestion du hero
 * @access private
 * @var santeHero
 */   

private var santeHero:scDeplacementTirHero;

/*
 * GameObject Hero
 * @access public
 * @var hero
 */   

public var hero: GameObject;


/*
 * Distance à laquelle le boss commence a courir 
 * @access public
 * @var chaseDistance
 */   

public var chaseDistance : float = 10.0;

/*
 * Vitesse du boss
 * @access public
 * @var chaseSpeed
 */   

public var chaseSpeed : float = 3.0;

/*
 * Distance d'attaque basique
 * @access public
 * @var attackDistance
 */

public var attackDistance : float = 2;

/*
 * Temps entre les attaques
 * @access public
 * @var attaqueCooldown
 */

public var attaqueCooldown : float = 5f;

/*
 * Temps entre les attaques corps a corps
 * @access public
 * @var attaqueCooldown
 */

public var attaqueCooldownCorpsACorps : float =1f;

/*
 * Bool pour attaque invisible
 * @access private
 * @var attaqueInvisiblePossible
 */

private var attaqueInvisiblePossible : boolean; 

/*
 * Bool pour attaque puissante
 * @access private
 * @var attaquePuissantePossible
 */

private var attaquePuissantePossible : boolean; 



/*
 * Timer
 * @access private
 * @var timer
 */   

private var timerAttaque:float;


/*
 * Timer
 * @access private
 * @var timer2
 */   

private var timerAttaque2:float;



/*
 * Mesh du boss
 * @access public
 * @var bossMesh
 */      

public var bossMesh:GameObject; 


 /*
 * Projectile (attaque magique du personnage)
 * @access public
 * @var projectile
 */

public var fumee:GameObject;

 /*
 * Projectile (attaque magique du personnage)
 * @access public
 * @var nouveauProjectile
 */

private var nouvelleFumee:GameObject;

 /*
 * Projectile AOE (attaque magique du personnage)
 * @access public
 * @var nouveauProjectile
 */

public var aoeBoss:GameObject;
 
 /*
 * AOE (attaque magique du personnage)
 * @access public
 * @var nouveauProjectile
 */

private var nouvelleAoe:GameObject;

 /*
 * Animateur
 * @access public
 * @var animateur
 */   
public var animateur:Animator;


/*
 * Distance où l'ennemi stoppe
 * @access public
 * @var stop
 */   

 public var distanceMin = 2;

  /*
 * gameObject hit 
 * @access private
 * @var hit
 */

public var hit : GameObject;


 /*
 * gameObject hit 
 * @access private
 * @var hit
 */

private var nouveauHit : GameObject;


function Start () {
	 //agent = GetComponent.<NavMeshAgent>();
	 santeHero = hero.GetComponent.<scDeplacementTirHero>();
	 attaqueInvisiblePossible = true;
	 attaquePuissantePossible = true; 
}



function Update () {

	timerAttaque += Time.deltaTime;
	timerAttaque2 += Time.deltaTime;

	 gestionStates();
	 priseDecisions();
}


// Function qui gere les states qui sont ensuite utilisés par la fonction priseDecisions

function gestionStates()
{
    var distanceToTarget = (cible.position - transform.position).sqrMagnitude;


    if(distanceToTarget <= chaseDistance*chaseDistance) 
    {
        state = aiState.Courrir;
    }


    if ((distanceToTarget <= attackDistance)&&(timerAttaque > attaqueCooldownCorpsACorps))
    {
        state = aiState.AttaqueBasique;
    }
  
    if ((vieBoss <= 400)&&(attaqueInvisiblePossible==true)&&(timerAttaque2 > attaqueCooldown)) 
    {
    	state = aiState.AttaqueInvisible;
    }

    if ((vieBoss <= 250)&&(attaquePuissantePossible==true)&&(timerAttaque2 > attaqueCooldown)) 
    {
    	state = aiState.AttaquePuissante;
    }

    if (vieBoss <= 0) 
    {
    	state = aiState.Mourir;
    }
}

// Function qui prends les decisions concernant l'appel des fonctions de l'AI

function priseDecisions () {
    switch (state) {
        case aiState.Attente :
            Attente();
            break;
        case aiState.Courrir :
            Courrir();
            break;
        case aiState.AttaqueBasique :
            attaque();
            break;
        case aiState.AttaquePuissante :
            attaquePuissante();
            break;
        case aiState.AttaqueInvisible :
            attaqueInvisible();
            break;
        case aiState.Mourir :
            mourir();
            break;


    }
}

function Attente() 
{

}

function Courrir() 
{
	animateur.SetBool('run', true);
	transform.LookAt(cible.position);
	if(Vector3.Distance(transform.position, cible.position)>=distanceMin)
	{
		transform.position+=transform.forward*chaseSpeed*Time.deltaTime;
	}
}

function attaque() 
{
	animateur.SetBool('punch', true);
	timerAttaque= 0f;
	degatBoss =15;
	if(santeHero.Viedisponible>0)
	{
		santeHero.SendMessageUpwards("PrendDamage" , degatBoss, SendMessageOptions.DontRequireReceiver );

	}
	animateur.SetBool('run', true);

}


function attaquePuissante() 
{
	timerAttaque2= 0f;
	degatBoss = 90;
	animateur.SetBool('magicAttack', true);
	yield WaitForSeconds(2);
	nouvelleAoe = Instantiate(aoeBoss, hero.transform.position, transform.rotation);
	animateur.SetBool('magicAttack', false);
	attaquePuissantePossible = false;

	if(santeHero.Viedisponible>0)
	{
		santeHero.SendMessageUpwards("PrendDamage" , degatBoss, SendMessageOptions.DontRequireReceiver );

	}

}


function attaqueInvisible() 
{
	timerAttaque2= 0f;
	degatBoss = 55;
	// On instantie de la fumée à l'endroit ou le boss va disparaître
	nouvelleFumee = Instantiate(fumee, transform.position, transform.rotation);
	//On désactive le mesh renderer pour rendre le boss invisible
	bossMesh.GetComponent(SkinnedMeshRenderer).enabled = false;
	yield WaitForSeconds(1);
	//Déplacement du boss sur le hero après une seconde
	transform.position = cible.position;
	yield WaitForSeconds(1);
	// On instantie de la fumée à l'endroit ou le boss va apparaître
	nouvelleFumee = Instantiate(fumee, transform.position, transform.rotation);
	//On reactive le mesh renderer pour rendre le boss visible
	bossMesh.GetComponent(SkinnedMeshRenderer).enabled = true;
	animateur.SetBool('punch', true);


	if(santeHero.Viedisponible>0)
	{
		// Envoie le message pour diminuer la santée du hero
		santeHero.SendMessageUpwards("PrendDamage" , degatBoss, SendMessageOptions.DontRequireReceiver );

	}
	attaqueInvisiblePossible = false;
}


function diminuerVieBoss (nbDegat:int) {

	vieBoss-=nbDegat;
	nouveauHit = Instantiate(hit, transform.position, transform.rotation);

}


function mourir () 
{
	    Destroy(this.gameObject);
    	Application.LoadLevel(10);
}