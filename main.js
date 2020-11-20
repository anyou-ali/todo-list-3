// Selecteurs 
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

// Noms classes
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH ="lineThrough";

// Variables
let LIST = [],
       id = 0;

// afficher les items du localStorage
let data = localStorage.getItem("TODO");

// checker si la variable data n'est pas vide
if(data){
    LIST = JSON.parse(data); 
    id = LIST.length; // définir l'id(index) sur le dernier de la liste
    loadList(LIST); // charger la liste dans l'interface utilisateur
}
else{
    // si data n'est pas vide
    LIST = [];
    id = 0;
}

// charger les items dans l'interface utilisateur
function loadList(array){
     array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
     });
}

// effacer le localStorage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

// Afficher la date du jour
const options = {
    weekday : "long",
    month : "short",
    day : "numeric"
};
const today = new Date(); 
dateElement.innerHTML = today.toLocaleDateString("fr-FR", options);

// Function ajouter todo
function addToDo(toDo, id, done, trash){
    // checker si l'item n'est pas dans le trash(corbeille)
    // si l'item est dans le trash(corbeille)
    if(trash){
        return;
    }
    
    // checker si todo n'est pas complétée
    // si c'est complétée on utilise la classe check si ce n'est pas complétée on utilise la classe uncheck
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="item">
                        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                        <p class="text ${LINE}">
                            ${toDo}
                        </p>
                        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                    </li>  
                 `;
    
    const position = "beforeend";
    list.insertAdjacentHTML(position,item);
}

// Ajouter un item à la liste lorsque l'utilisateur clique sur entrer
document.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        const toDo = input.value;

        // si l'input n'est pas vide
        if(toDo){
            addToDo(toDo, id, false, false);
            
            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false
            });

            // sauvegarder les items dans le localStorage (cette ligne de code doit être ajouté à chaque endroit où le tableau LIST est updaté)
            localStorage.setItem("TODO", JSON.stringify(LIST));
            
            id++;
        }
        input.value = "";
    }
})

// todo complétée
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

// suppression todo
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

// target les items créés dynamiquement 
list.addEventListener("click", function(event){
    const element = event.target; // renvoi l'élément cliqué à l'intérieur
    const elementJob = element.attributes.job.value; // complete or delete

    if(elementJob === "complete"){
        completeToDo(element);
    }
    else if(elementJob === "delete"){
        removeToDo(element);
    }

    // sauvegarder les items dans le localStorage (cette ligne de code doit être ajouté à chaque endroit où le tableau LIST est updaté)
    localStorage.setItem("TODO", JSON.stringify(LIST));
})