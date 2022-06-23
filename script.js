const template = document.querySelector("[data-user-template]")
const domCards = document.querySelector("[data-pokemon-cards-container]")
const inputBox = document.querySelector("[data-search]")
const searchWrapper = document.querySelector(".search-input")
const suggBox = document.querySelector(".autocom-box")
const pokeNameSugg = document.querySelector(".suggestions")
const hintWrapper = document.querySelector(".hint-wrapper")

let currentPokemon = {};
let pokeItems = [];
let searchResult = [];
let liList = [];


//suggestion button


pokeNameSugg.addEventListener("click", () => {
    fetch('https://pokeapi.co/api/v2/pokemon/')
        .then(res => res.json())
        .then(data => {
            pokeItems = data.results;

            const pokeNames = pokeItems.map(data => {
                return data.name;
            })

            const hintText = document.querySelector(".hint")
            cleanUpHint();
            if (!hintText) {
                const paragraph = document.createElement("p");
                paragraph.innerText = pokeNames;
                paragraph.classList.add("hint");
                hintWrapper.append(paragraph);
            }

        })
})

inputBox.addEventListener("input", (e) => {
    const search = e.target.value;

    if (search) {
        fetch('https://pokeapi.co/api/v2/pokemon/')
            .then(res => res.json())
            .then(data => {
                pokeItems = data.results;
                const searchRes = pokeItems.filter(poke => poke.name.startsWith(search))
                searchResult = searchRes;

                const pokeNames = searchResult.map(data => {
                    return data.name;
                });

                liList = pokeNames.map(list => {
                    return '<li>' + list + '</li>';
                });
                // inputBox.textContent = liList;
                suggBox.innerHTML = liList;


                showSuggestion(liList);

                searchWrapper.classList.add("active"); //show auto complete Box

                let allList = suggBox.querySelectorAll("li");
                allList.forEach(el => {
                    el.addEventListener("click", select)
                })

            })

            .catch(err => {
                console.error(err)
            })
    }
    else {
        searchWrapper.classList.remove("active"); //hide auto complete Box
    }
});

// clicking on suggested pokemon
function select(e) {
    cleanUpCard();
    const selectedName = e.target.textContent;
    const selectedPokemon = searchResult.find(data => data.name === selectedName)

    const link = selectedPokemon.url;
    readPokemonsProps(link);
    inputBox.value = selectedName;
}


function showSuggestion(list) {
    let listData;
    listData = list.join('');
    suggBox.innerHTML = listData;
}

//reading selected Pokemon
function readPokemonsProps(url) {

    fetch(url)
        .then(results => results.json())
        .then(infos => {
            const personlyHeight = infos.height;
            const personlyWeight = infos.weight;
            const personlyName = infos.name;
            const personlyAbility = infos.abilities;
            const personlyType = infos.types;

            const image = infos.sprites.back_default;

            let pokesType = [];
            pokesType = personlyType.map(el => {
                return pokesType.push = el.type.name;
            });


            let pokesAbility = [];
            pokesAbility = personlyAbility.map(el => {
                return pokesAbility.push = el.ability.name;
            });


            currentPokemon = { personlyHeight, personlyWeight, personlyName, pokesAbility, pokesType, image };
            appendPokemonsCard(currentPokemon);
        })
        .catch(err => {
            console.error(err)
        })
}


// reading main link
function appendPokemonsCard(currentPokemon) {
    const card = template.content.cloneNode(true).children[0];
    const header = card.querySelector("[data-header]");
    const img = card.querySelector("[data-img]");
    const type = card.querySelector("[data-type-body]");
    const height = card.querySelector("[data-height]");
    const weight = card.querySelector("[data-weight]");
    const abilities = card.querySelector("[data-abilities]");

    header.textContent = currentPokemon.personlyName;
    height.textContent = 'height: ' + currentPokemon.personlyHeight;
    weight.textContent = 'weight: ' + currentPokemon.personlyWeight;
    type.textContent = [...currentPokemon.pokesType];
    abilities.textContent = 'abilities: ' + [...currentPokemon.pokesAbility]
    img.src = currentPokemon.image;

    card.classList.add("show");
    domCards.append(card);

    closeButton();
}

function cleanUpCard() {
    const allCards = document.querySelectorAll(".pokemon-cards")
    if (allCards.length != 0) {
        allCards.forEach(element => {
            element.remove();
        })
    }
}

function closeButton() {
    const xButton = document.getElementById("close");
    xButton.addEventListener("click", cleanUpCard)
}
function cleanUpHint() {    
    const hintText = document.querySelector(".hint")
    if (hintText) {
        hintText.classList.toggle("active")
    }
}

