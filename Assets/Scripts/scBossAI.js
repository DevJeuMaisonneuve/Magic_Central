#pragma strict
/*
 * Énumeration des states de la FSM
 * @access private
 * @var aiState
 */   
enum aiState {Attente, Courrir, AttaqueBasique, AttaquePuissante, AttaqueInvisible}

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

public var vieBoss:int = 200;

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

public var attackDistance : float = 3.0;

/*
 * Temps entre les attaques
 * @access public
 * @var attaqueCooldown
 */

public var attaqueCooldown : float = 5f;

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

private var timer:float;

/*
 * agent du NavMesh
 * @access public
 * @var agent
 */      

public var agent:NavMeshAgent; 

/*
 * agent du NavMesh
 * @access public
 * @var agent
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


function Start () {

	 santeHero = hero.GetComponent.<scDeplacementTirHero>();
	 attaqueInvisiblePossible = true;
	 attaquePuissantePossible = true; 
}



function Update () {

	timer += Time.deltaTime;

	 gestionStates();
	 priseDecisions();
}



function gestionStates()
{
    var distanceToTarget = (cible.position - transform.position).sqrMagnitude;

    if ((distanceToTarget <= attackDistance*attackDistance)&&(timer > attaqueCooldown))
    {
        state = aiState.AttaqueBasique;
    }

    else if(distanceToTarget <= chaseDistance*chaseDistance) 
    {
        state = aiState.Courrir;
    }
    else
    {
        state = aiState.Attente;
    }

    if ((vieBoss <= 150)&&(attaqueInvisiblePossible==true)&&(timer > attaqueCooldown)) 
    {
    	state = aiState.AttaqueInvisible;
    }

    if ((vieBoss <= 100)&&(attaquePuissantePossible==true)&&(timer > attaqueCooldown)) 
    {
    	state = aiState.AttaquePuissante;
    }

    if (vieBoss <= 0) 
    {
    	Destroy(this.gameObject);
    	Application.LoadLevel(9);
    }
}

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

    }
}

function Attente() 
{
	//Mettre de Idle
}

function Courrir() 
{
	animateur.SetBool('run', true);
	agent.gameObject.transform.LookAt(cible.transform);
	agent.SetDestination(cible.transform.position);
}

function attaque() 
{
	timer= 0f;
	degatBoss =10;
	animateur.SetBool('punch', true);
	if(santeHero.Viedisponible>0)
	{
		santeHero.SendMessageUpwards("PrendDamage" , degatBoss, SendMessageOptions.DontRequireReceiver );

	}
}


function attaquePuissante() 
{
	timer= 0f;
	degatBoss = 35;
	animateur.SetBool('magicAttack', true);
	nouvelleAoe = Instantiate(aoeBoss, cible.transform.position, transform.rotation);

	if(santeHero.Viedisponible>0)
	{
		santeHero.SendMessageUpwards("PrendDamage" , degatBoss, SendMessageOptions.DontRequireReceiver );

	}
	attaquePuissantePossible = false;
}


function attaqueInvisible() 
{
	timer= 0f;
	degatBoss = 25;
	// On instantie de la fumée à l'endroit ou le boss va disparaître
	nouvelleFumee = Instantiate(fumee, agent.transform.position, transform.rotation);
	//On désactive le mesh renderer pour rendre le boss invisible
	bossMesh.GetComponent(SkinnedMeshRenderer).enabled = false;
	yield WaitForSeconds(1);
	//Déplacement du boss sur le hero après une seconde
	agent.transform.position = cible.transform.position;
	yield WaitForSeconds(1);
	// On instantie de la fumée à l'endroit ou le boss va apparaître
	nouvelleFumee = Instantiate(fumee, agent.transform.position, transform.rotation);
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

}
