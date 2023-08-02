async function start() {
    // await getPokemonOverview(offset);
    // await getPokemonSpeciesOverview(offset);
    if (window.innerWidth >= 1024) {
        cardsOnPage = setCardsOnPage(3);
    } else {
        cardsOnPage = setCardsOnPage(3);
    }
    await renderPokemonCards();
    await renderMorePokemons();
}

async function page() {
    await renderPokemonCards();
    await renderMorePokemons();
}

// async function getPokemonOverview() {
//     let url = `https://pokeapi.co/api/v2/pokemon/?limit=${cardsOnPage}&offset=${offset}`;
//     let [responsePokemon, err] = await resolve(fetch(url));
//     pokemonUrlsOfPage = [];
//     for (let i = 0; i < responsePokemon['results'].length; i++) {
//         pokemonUrlsOfPage.push(responsePokemon['results'][i]['url']);
//     }
// }

// async function getPokemonSpeciesOverview() {
//     let url = `https://pokeapi.co/api/v2/pokemon-species/?limit=${cardsOnPage}&offset=${offset}`;
//     pokemonSpeciesUrlsOfPage = [];
//     let [responsePokemonSpecies, err] = await resolve(fetch(url));
//     for (let i = 0; i < responsePokemonSpecies['results'].length; i++) {
//         pokemonSpeciesUrlsOfPage.push(responsePokemonSpecies['results'][i]['url']);
//     }
// }

// async function getPokemonFrontImages(index) {
//     let url = pokemonUrlsOfPage[index];
//     let [response, err] = await resolve(fetch(url));
//     let front_default = response['sprites']['front_default'];
//     let front_shiny = response['sprites']['front_shiny'];
//     let artwork_default = response['sprites']['other']['official-artwork']['front_default'];
//     let artwork_shiny = response['sprites']['other']['official-artwork']['front_shiny'];
//     return [front_default, front_shiny, artwork_default, artwork_shiny];
// }

async function renderPokemonCards() {
    let render = '';
    let images = [];
    let typeOneColors = [];
    let typeTwoColors = [];
    for (let i = 0; i < cardsOnPage; i++) {
        if (i + offset > 1010) { break; }
        [render, images, typeOneColors, typeTwoColors] = await renderPokemonCardOne(i, render, images, typeOneColors, typeTwoColors);
        document.getElementById('card_container').innerHTML = render;
        await renderPokemonCardTwo(i, images, typeOneColors, typeTwoColors);
    }
    render = '';
    images = [];
    typeOneColors = [];
    typeTwoColors = [];
}

async function renderPokemonCardOne(i, render, images, typeOneColors, typeTwoColors) {
    let germanPokemon = germanPokemonNames[i + offset - 1];
    let [typeOne, typeTwo, typeOneColor, typeTwoColor, imageurl] = await getPokemon(i + offset);
    let typeOneGerman = translateType[typeOne];
    let typeTwoGerman = translateType[typeTwo];
    images.push(imageurl);
    typeOneColors.push(typeOneColor);
    typeTwoColors.push(typeTwoColor);
    if (typeTwo == '') { typeTwoGerman = ''; }
    if (imageurl != '') {
        render += `<div class="pokemon_card" id="card_${i}" onclick="openPokemon(${i + offset})">
                    <div class="card_layout">
                        <div class="type_1" id="typeOne_${i}"><div class="rotate">${typeOneGerman}</div></div>
                        <div class="type_2" id="typeTwo_${i}"><div class="rotate">${typeTwoGerman}</div></div>
                    </div>
                    <div class="card_layout mt-120">
                        <div class="pokeimg" id="img_${i}"></div>
                        <div class="pokename">${germanPokemon}</div>
                    </div>
                </div>`;
    }
    return [render, images, typeOneColors, typeTwoColors];
}

async function renderPokemonCardTwo(i, images, typeOneColors, typeTwoColors) {
    for (let j = 0; j <= i; j++) {
        if (typeTwoColors[j] == null) { typeTwoColors[j] = typeOneColors[j]; }
        document.getElementById(`card_${j}`).style.backgroundColor = typeOneColors[j];
        document.getElementById(`typeOne_${j}`).style.backgroundColor = typeOneColors[j];
        document.getElementById(`typeTwo_${j}`).style.backgroundColor = typeTwoColors[j];
        document.getElementById(`img_${j}`).style.backgroundImage = `url(${images[j]})`;
    }
}

async function getPokemon(index) {
    let [typ1, typ2, typeOneColor, typeTwoColor, imageurl, response, err, url] = '';
    if (index > 0 && index < 1011) {
        url = `https://pokeapi.co/api/v2/pokemon/${index}/`;
        [response, err] = await resolve(fetch(url));
    }
    if (response != null) {
        imageurl = response['sprites']['other']['official-artwork']['front_default']; // response['sprites']['front_default'];
        typ1 = response['types'][0]['type']['name'];
        typ2 = '';
        if (response['types'][1] != undefined) { typ2 = response['types'][1]['type']['name'] }
        [typeOneColor, typeTwoColor] = await getPokemonTypeColors(typ1, typ2);
    }
    return [typ1, typ2, typeOneColor, typeTwoColor, imageurl];
}

async function getPokemonZoom(index) {
    let [typeOne, typeTwo, imageUrl, response, err, url, typeOneGerman, typeTwoGerman] = '';
    url = `https://pokeapi.co/api/v2/pokemon/${index}/`;
    [response, err] = await resolve(fetch(url));
    imageUrl = response['sprites']['other']['official-artwork']['front_default'];
    typeOne = response['types'][0]['type']['name'];
    if (response['types'][1] != undefined) { typeTwo = response['types'][1]['type']['name']; } else { typeTwo = null; }
    typeOneGerman = translateType[typeOne];
    if (typeTwo == null) { typeTwoGerman = ''; } else { typeTwoGerman = translateType[typeTwo] };
    if (response['types'][1] != undefined) { typeTwo = response['types'][1]['type']['name'] }
    let [typeOneColor, typeTwoColor] = await getPokemonTypeColors(typeOne, typeTwo);
    let germanName = germanPokemonNames[index - 1];
    return [germanName, typeOneGerman, typeTwoGerman, typeOneColor, typeTwoColor, imageUrl];
}

async function getPokemonTypeColors(typeOne, typeTwo) {
    let typeOneColor = typeColors[typeOne];
    let typeTwoColor = null;
    if (typeTwo != null) {
        typeTwoColor = typeColors[typeTwo];
    } else {
        typeTwoColor = typeOneColor;
    }
    return [typeOneColor, typeTwoColor];
}

async function renderMorePokemons() {
    let next = `<div class="next" onclick="nextPage()">Weiter<img class="img_nav" src="img/circle-right-solid.svg" alt=""></div>`;
    let previous = `<div class="previous" onclick="previousPage()"><img class="img_nav" src="img/circle-left-solid.svg" alt="">Zurück</div>`;
    let render = '<div class="nav" id="nav">';
    if (offset <= 1) {
        render += next;
    }
    else if (offset > 1 && offset < 1010 - cardsOnPage) {
        render += previous;
        render += next;
    }
    else {
        render += previous;
    }
    render += '</div>';
    document.getElementById('footer').innerHTML = render;
    document.getElementById('nav').classList.remove('hide');
}

function previousPage() {
    document.getElementById('nav').classList.add('hide');
    offset -= cardsOnPage;
    page();
}

function nextPage() {
    document.getElementById('nav').classList.add('hide');
    offset += cardsOnPage;
    page();
}

async function resolve(p) {
    try {
        let response = await p;
        let responseAsJson = await response.json();
        return [responseAsJson, null];
    } catch (e) {
        return [null, e];
    }
}

async function openPokemon(pokemon) {
    activePokemon = pokemon;
    let [germanName, typeOneGerman, typeTwoGerman, typeOneColor, typeTwoColor, imageUrl] = await getPokemonZoom(pokemon);
    let base = await getBasePoints(pokemon);
    document.getElementById('card_zoom_top').style.backgroundImage = `url(${imageUrl}`;
    document.getElementById('card_zoom_top').innerHTML = `<div class="zoom_type">${typeOneGerman}</div>`;
    document.getElementById('card_zoom_top').style.backgroundColor = typeOneColor;
    document.getElementById('card_zoom_middle').style.backgroundColor = typeTwoColor;
    document.getElementById('card_zoom_middle').innerHTML = `<div class="zoom_type">${typeTwoGerman}</div><div class="zoom_name">${germanName}</div>`;
    await returnMenu(base, pokemon);
    if (pokemon > 1) { document.getElementById('card_zoom_previous').classList.remove('hide'); } else { document.getElementById('card_zoom_previous').classList.add('hide'); }
    if (pokemon < 1010) { document.getElementById('card_zoom_next').classList.remove('hide'); } else { document.getElementById('card_zoom_next').classList.add('hide'); }
    document.getElementById('card_zoom_bg').classList.remove('hide');
    document.getElementById('card_zoom_layout').classList.remove('hide');
}

async function returnMenu(base, pokemon) {
    let render = `<div class="tab">
    <div class="tablinks active" onclick="openTab(event, 'basis')">Statistik</div>
    <div class="tablinks" onclick="openTab(event, 'evolution')">Evolutionen</div>
  </div>
  <div id="basis" class="tabcontent show">
    <div class="base_stats_outer"><canvas id="base_stats"></canvas></div>
  </div>
  <div id="evolution" class="tabcontent">
  </div>
  `;
    document.getElementById('card_zoom_bottom').innerHTML = render;
    await renderBaseStats(base);
    await renderEvolutions(pokemon);

}

async function closePokemon() {
    document.getElementById('card_zoom_bg').classList.add('hide');
    document.getElementById('card_zoom_layout').classList.add('hide');
    document.getElementById('card_zoom_previous').classList.add('hide');
    document.getElementById('card_zoom_next').classList.add('hide');
}

async function zoomPrevious() {
    let pokemon = activePokemon + 1;
    document.getElementById('card_zoom_previous').classList.add('hide');
    document.getElementById('card_zoom_next').classList.add('hide');
    await openPokemon(pokemon);
}

async function zoomNext() {
    let pokemon = activePokemon - 1;
    document.getElementById('card_zoom_previous').classList.add('hide');
    document.getElementById('card_zoom_next').classList.add('hide');
    await openPokemon(pokemon);
}

async function getBasePoints(pokemon) {
    let [response, err, url] = '';
    url = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;
    [response, err] = await resolve(fetch(url));
    let KP = response['stats'][0]['base_stat'];
    let Angriff = response['stats'][1]['base_stat'];
    let Verteidigung = response['stats'][2]['base_stat'];
    let Spezialangriff = response['stats'][3]['base_stat'];
    let Spezialverteidigung = response['stats'][4]['base_stat'];
    let Initiative = response['stats'][5]['base_stat'];
    return [KP, Angriff, Verteidigung, Spezialangriff, Spezialverteidigung, Initiative];
}

function renderBaseStats(base) {
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#000';
    Chart.defaults.font.weight = 'bold';
    const ctx = document.getElementById('base_stats');
    const labels = ['KP', 'Angriff', 'Verteidigung', 'Spezialangriff', 'Spezialverteidigung', 'Initiative'];
    const data = {
        labels: labels,
        datasets: [{
            axis: 'y',
            label: 'Punkte',
            data: base,
            fill: false,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(201, 203, 207, 1)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };
    const config = {
        type: 'bar',
        data,

        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
            animations: {
                animation: {
                    duration: 200,
                    easing: 'easeInQuart',
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                        color: '#ffffff',
                    }
                },
                y: {
                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                        color: '#ffffff',
                    }
                }
            },
        }
    };
    new Chart(ctx, config);
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

async function getEvolutions(pokemon) {
    let [response, err, url] = '';
    url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`;
    [response, err] = await resolve(fetch(url));
    let evolutionChain = response['evolution_chain']['url'];
    [response, err] = await resolve(fetch(evolutionChain));
    let [imgOne, outputUrlOne, germanNameOne, imgTwo, outputUrlTwo, germanNameTwo, imgThree, outputUrlThree, germanNameThree] = '';
    if (response['chain'] != undefined) { evolutionOne = response['chain']['species']['name'];[imgOne, outputUrlOne, germanNameOne] = await getEvolution(evolutionOne); };
    if (response['chain'] != undefined) { if (response['chain']['evolves_to'][0] != undefined) { evolutionTwo = response['chain']['evolves_to'][0]['species']['name'];[imgTwo, outputUrlTwo, germanNameTwo] = await getEvolution(evolutionTwo); } }
    if (response['chain'] != undefined) { if (response['chain']['evolves_to'][0] != undefined) { if (response['chain']['evolves_to'][0]['evolves_to'][0] != undefined) { evolutionThree = response['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];[imgThree, outputUrlThree, germanNameThree] = await getEvolution(evolutionThree); } } }
    return [imgOne, outputUrlOne, germanNameOne, imgTwo, outputUrlTwo, germanNameTwo, imgThree, outputUrlThree, germanNameThree];
}

async function getEvolution(pokemonname) {
    let [response, err, url] = '';
    url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonname}`;
    [response, err] = await resolve(fetch(url));
    let idZero = response['id'];
    urlZero = `https://pokeapi.co/api/v2/pokemon/${idZero}/`;
    [response, err] = await resolve(fetch(urlZero));
    let img = response['sprites']['other']['official-artwork']['front_default'];
    let id = response['id'];
    let germanName = germanPokemonNames[id - 1];
    return [img, id, germanName];
}

async function renderEvolutions(pokemon) {
    let [imgOne, outputUrlOne, germanNameOne, imgTwo, outputUrlTwo, germanNameTwo, imgThree, outputUrlThree, germanNameThree] = await getEvolutions(pokemon);
    let render = `<div class="evo_outer"><div class="evo" onclick="openPokemon(${outputUrlOne})"><img class="evo_img" src="${imgOne}" alt="">${germanNameOne}</div>`;
    if (imgTwo != undefined) { render += `<div class="evo" onclick="openPokemon(${outputUrlTwo})"><img  class="evo_img" src="${imgTwo}" alt="">${germanNameTwo}</div>`; }
    if (imgThree != undefined) { render += `<div class="evo" onclick="openPokemon(${outputUrlThree})"><img  class="evo_img" src="${imgThree}" alt="">${germanNameThree}</div>`; }
    render += `</div>`;
    document.getElementById('evolution').innerHTML = render;
}

function setCardsOnPage(rows) {
    let screenwidth = window.innerWidth;
    let picsinrow = Math.floor(screenwidth / 170);
    let picnumber = picsinrow * rows;
    return picnumber;
}

async function executeSearch() {
    let images = [];
    let typeOneColors = [];
    let typeTwoColors = [];
    let searchword = document.getElementById('searchfield').value;
    if (searchword == "") {
        await renderPokemonCards();
        await renderMorePokemons();
    } else {
        searchword = searchword.toLowerCase();
        let searcharray = await getSearchIndex(searchword);
        await renderSearch(searcharray);
        images = [];
        typeOneColors = [];
        typeTwoColors = [];
    }
}

async function getSearchIndex(searchword) {
    let searcharray = [];
    for (let i = 0; i < germanPokemonNames.length; i++) {
        let name = germanPokemonNames[i];
        name = name.toLowerCase();
        if (name.includes(searchword)) {
            searcharray.push(i + 1);
        }
    }
    return searcharray;
}

async function renderSearch(searcharray) {
    let render = '';
    let images = [];
    let typeOneColors = [];
    let typeTwoColors = [];
    for (let i = 0; i < searcharray.length; i++) {
        [render, images, typeOneColors, typeTwoColors] = await renderPokemonSearchOne(i, searcharray, render, images, typeOneColors, typeTwoColors);
        document.getElementById('card_container').innerHTML = render;
        await renderPokemonSearchTwo(i, searcharray, images, typeOneColors, typeTwoColors);
    }

}

async function renderPokemonSearchOne(i, searcharray, render, images, typeOneColors, typeTwoColors) {
    let germanPokemon = germanPokemonNames[searcharray[i] - 1];
    let [typeOne, typeTwo, typeOneColor, typeTwoColor, imageurl] = await getPokemon(searcharray[i]);
    let typeOneGerman = translateType[typeOne];
    let typeTwoGerman = translateType[typeTwo];
    images.push(imageurl);
    typeOneColors.push(typeOneColor);
    typeTwoColors.push(typeTwoColor);
    if (typeTwo == '') { typeTwoGerman = ''; }
    if (imageurl != '') {
        render += `<div class="pokemon_card" id="card_${i}" onclick="openPokemon(${searcharray[i]})">
                    <div class="card_layout">
                        <div class="type_1" id="typeOne_${i}"><div class="rotate">${typeOneGerman}</div></div>
                        <div class="type_2" id="typeTwo_${i}"><div class="rotate">${typeTwoGerman}</div></div>
                    </div>
                    <div class="card_layout mt-120">
                        <div class="pokeimg" id="img_${i}"></div>
                        <div class="pokename">${germanPokemon}</div>
                    </div>
                </div>`;
    }
    return [render, images, typeOneColors, typeTwoColors];
}

async function renderPokemonSearchTwo(i, searcharray, images, typeOneColors, typeTwoColors) {
    for (let j = 0; j <= i; j++) {
        if (typeTwoColors[j] == null) { typeTwoColors[j] = typeOneColors[j]; }
        document.getElementById(`card_${j}`).style.backgroundColor = typeOneColors[j];
        document.getElementById(`typeOne_${j}`).style.backgroundColor = typeOneColors[j];
        document.getElementById(`typeTwo_${j}`).style.backgroundColor = typeTwoColors[j];
        document.getElementById(`img_${j}`).style.backgroundImage = `url(${images[j]})`;
        document.getElementById('nav').classList.add('hide');
    }
}
