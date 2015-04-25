//Parametres par défaut:
   //Scores
var gainDefaut = 1 // Nombre de points marqués lorqu'un ennemi est tué
var penaliteDefaut = 0 //Nombre de points perdus si un ennemi survi
var penaliteTir = 0 //Nombre de points perdus si un tir n'abouti pas
   // Déplacements
var pasDefaut = 8 // Déplacement du vaisseau et des tirs
var pasEnnemiDefaut = 10 //Déplacement des soucoupes ennemies
  // Vitesse
var intervalEnnemiDefaut = 1800 //Temps entre la possible appartion d'un ennemi
var intervalDefaut = 100 //Temps entre chaque mise à jour de l'affichage
   // Taille du vaisseau
var wVaisseau = 60;
var hVaisseau = 40;
   // Taille des tirs
var hTirs = 8;
var wTirs = 32;
   // Taille des soucoupes ennemies
var hEnnemi = 40;
var wEnnemi = 60;
   // Nombre d'ennemi
var nbEnnemiDefaut = 5 ;



//Variables globales
var canvas;
var context;
var hCanvas; //hauteur du canevas
var wCanvas; //largeur du canvevas
var vaisseau; //image du vaisseau
var xVaisseau; // absisse du vaisseau
var yVaisseau; //ordonée du vaisseau
var tirs;  // image d'un tir
var listeTir; // coordonnées de l'ensemble des tirs
var ennemi;  // image d'un ennemi
var listeEnnemi;  // coordonéesde l'ensemble des ennemis
var boutonEnnemi; //Bouton ajoutant un ennemi
var boutonEnnemis; //Bouton ajoutant aléatoirement un vaiseau par seconde
var score; // score du joueur
var explosion; //image de l'explosion d'un ennemi



var initVar = function()
// Initialise l'ensemble des variables après le chargement de la page
{
  canvas = document.getElementById("jeu");
  context = canvas.getContext("2d");
  hCanvas = parseInt((window.getComputedStyle(canvas)).height);
  wCanvas = parseInt((window.getComputedStyle(canvas)).width);
  vaisseau = new Image();
  xVaisseau = 0;
  yVaisseau = hCanvas / 2;
  vaisseau.src='images/laser2.png';
  tirs = new Image();
  tirs.src='images/tir.png';
  listeTir= [];
  ennemi = new Image();
  ennemi.src='images/meteorite.png';
  listeEnnemi=[];
  score=0
  explosion = new Image()
  explosion.src='images/explosion.png'
}


//Déplacements du vaisseau

var deplacementHaut = function()
{ //Calcule les nouvelles coordonnés du vaisseau pour un déplacement vers le haut
  if (yVaisseau > pasDefaut){
    yVaisseau=yVaisseau-pasDefaut
  }  
}

var deplacementBas = function()
{ //Calcule les nouvelles coordonnés du vaisseau pour un déplacement vers le bas
  if (yVaisseau < hCanvas-pasDefaut-50){
    yVaisseau=yVaisseau+pasDefaut
  }
}


var deplacement = function(event)
//Calcule les nouvelles coordonnées du vaisseau en fonction des fléches sur le quel le joueur appuye
{
  if (event.keyCode == 38){
    deplacementHaut()
  }
  else{
    if (event.keyCode == 40){
      deplacementBas()
    }
  }
}


// Tir du vaisseau

var nouveauTir = function()
// Crée et ajoute les coordonnés d'un nouveau tir à la listeTir
{
  var l = listeTir.length
  listeTir[l]= new Array(2);
  listeTir[l][0] = 30;
  listeTir[l][1] = yVaisseau + 20;
}


var tirer = function(event)
//Génére la création d'un tir si le joueur appuye sur la bare espace
{
  if (event.keyCode == 32){
        nouveauTir()
      }
}


//Vaisseau ennemis

var nouvelEnnemi = function()
// Génére les coordonées d'une nouvelle soucoupe ennemie
{
  var l = listeEnnemi.length
  listeEnnemi[l]=new Array(2);
  listeEnnemi[l][0]= wCanvas
  listeEnnemi[l][1]= Math.floor(Math.random()*(hCanvas-60))+20
  this.blur();
}

var nbEnnemis = function()
{ 
  interval= window.setInterval(function(){if(listeEnnemi.length<nbEnnemiDefaut) {if(Math.floor(Math.random()*5)<4){
    nouvelEnnemi()}}},intervalEnnemiDefaut)
}



//Collision


var toucheEnnemi = function()
// Teste pour chacun des tirs s'il rentre en collission avec une soucoupe ennemi et si c'est le cas supprime le tir et la soucoupe et ajoute 200 points au score
{
  for (var i=0; i<listeTir.length;i++){
    for (var j=0;j<listeEnnemi.length;j++){
      if (listeTir[i]!= undefined && listeEnnemi[j]!=undefined && ((listeTir[i][0]+wTirs)>listeEnnemi[j][0]) && (listeTir[i][0]>(listeEnnemi[j][0])) && (listeTir[i][1]>listeEnnemi[j][1])&&(listeTir[i][1]<listeEnnemi[j][1]+hEnnemi)){
        context.drawImage(explosion,(listeTir[i][0]+wTirs),(listeTir[i][1]-15))
        delete listeTir[i]
        delete listeEnnemi[j]
        score+= gainDefaut
      }
    }
  }
}

//Affichage


var dessineVaisseau = function()
{ //Dessine le vaisseau piloté par le joueur
  context.drawImage(vaisseau,xVaisseau,yVaisseau,wVaisseau,hVaisseau);
}

var dessineTirs = function()
//Dessine l'ensemble des tirs visibles à l'écran et efface ceux qui ne sont plus à l'écran
{
  for(var i = 0 ;i<listeTir.length ; i++){
    if (listeTir[i]!= undefined ){
      context.drawImage(tirs,listeTir[i][0],listeTir[i][1],wTirs,hTirs)
      listeTir[i][0]+= pasDefaut;
      if (listeTir[i][0]>wCanvas){
        listeTir[i]= undefined;
      }
    }
  }
}

var dessineEnnemis = function()
// Dessine l'ensemble des ennemis visibles à l'écran et efface ceux qui sont sortis en faisant perdre 1000 points au joueur
{
  var echec = false
  for(var i = 0; i<listeEnnemi.length ; i++){
    if (listeEnnemi[i]!=undefined){
      context.drawImage(ennemi,listeEnnemi[i][0],listeEnnemi[i][1],wEnnemi,hEnnemi);
      listeEnnemi[i][0]= listeEnnemi[i][0] - pasEnnemiDefaut;
      if (listeEnnemi[i][0]< 50)
        echec = true
        
      }
    }
 if (echec === true){
   initVar()
  }
}
     



var afficheScore = function()
// Affiche le score du joueur en ayant pris en compte les modifications depuis la dernièer mise à jour
{
  context.font ="30px Arial"
  context.fillText( score +"/"+ nbEnnemiDefaut,20,30);
  
}


var dessineImage = function()
{ //Dessine l'ensemble des élements du canevas après l'avoir effacé
  context.clearRect(0,0,wCanvas,hCanvas)
  dessineTirs()
  dessineVaisseau()
  dessineEnnemis()
  toucheEnnemi()
  afficheScore()
  if (score == nbEnnemiDefaut){
    window.alert("You win.")
  }
}


//Lancement du jeu

var setup = function()
//Lance l'ensemble des fonctions nécessaires pour joueur au jeu
{
  initVar()
  window.setInterval(dessineImage,intervalDefaut)
  window.addEventListener("keydown",deplacement)
  window.addEventListener("keydown",tirer)
  nbEnnemis()
}

window.addEventListener("load",setup)// Lance le jeu après le chargement de la page
