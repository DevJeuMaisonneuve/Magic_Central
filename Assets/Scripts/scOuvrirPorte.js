var Porte : GameObject;
var nbClefs:int;

public var panneauClefs:GameObject;



function Start() {

   if (PlayerPrefs.HasKey("Clefs")) 
   {

       nbClefs =  PlayerPrefs.GetInt('Clefs');
   }
   else 
   {
       nbClefs = 0;
   }
}


function OnTriggerEnter (Other : Collider) {

           if(Other.gameObject.tag == "Hero") 
           {
         
               if  (nbClefs == 4 ) 
               {
                 Porte.GetComponent.<Animation>().Play();
                 Debug.Log ("porte ouverte");
                 Destroy(this);
               }

               else {
               		panneauClefs.SetActive(true);
               }

           }

}

function OnTriggerExit (Other : Collider) {

	       if(Other.gameObject.tag == "Hero") 
           {
           		panneauClefs.SetActive(false);
           }
}