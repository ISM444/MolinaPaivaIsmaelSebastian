// Constantes
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/'
// existen 1026 pokemon, pero limito a 931 porque el resto no tienen gif, 
// para poder poner todos los pokemon se tiene que cambiar "showdown" a "official-artwork" (fila 29)
const maxPokeID = 931
const tamañoTeam = 3
// DOOM
const team1Pokemon = document.getElementById('team1Pokemon')
const team1Stats = document.getElementById('team1Stats')
const team2Pokemon = document.getElementById('team2Pokemon')
const team2Stats = document.getElementById('team2Stats')
const resultadoCombat = document.getElementById('resultadoCombat')
// Array para los equipos 1 y 2
let team1Data = []
let team2Data = []
// randomPokeId, genera un ID aleatorio
function randomPokeId(){
    return Math.floor(Math.random()*maxPokeID)+1
}
// dataPokemon, busca los datos del pokemon segun la ID generada antes
function dataPokemon(id){
    return fetch(`${apiUrl}${id}`)
        .then(response => response.json())
        .then(data => {
            const attackStat = data.stats.find(stat => stat.stat.name === 'attack')
            const defenseStat = data.stats.find(stat => stat.stat.name === 'defense') 
            return {
                name: data.name,
                sprite: data.sprites.other['showdown'].front_default,
                attack: attackStat ? attackStat.base_stat : 0,
                defense: defenseStat ? defenseStat.base_stat : 0,
            }
        })
}
// crearTeam, arma el equipo de 3 pokemons unicos
function crearTeam(mostrar){
    const team = []
    const idPokemon = new Set()
    let cantPoke = 0
        while (idPokemon.size < tamañoTeam) {
            idPokemon.add(randomPokeId())
        }
        idPokemon.forEach(id => {
            dataPokemon(id).then(pokemon => {
                if (pokemon) {
                    team.push(pokemon)
                }
                cantPoke++
                if (cantPoke === tamañoTeam) {
                    mostrar(team)
                }
            })
        })
}
// mostrarTeam, resibe todos los datos, los ordena y los muestra
function mostrarTeam(team, teamBox, statsBox) {
    teamBox.innerHTML = ''
    let totalAttack = 0
    let totalDefense = 0
    team.forEach(pokemon => {
        totalAttack += pokemon.attack
        totalDefense += pokemon.defense
        const pokemonMostarDatos = `
            <div class='mostrarDatosPokemon'>
                <img src="${pokemon.sprite}" alt="Imagen de ${pokemon.name}">
                <p class="name">${pokemon.name}</p>
                <p class="statAttack">Ataque: ${pokemon.attack}</p>
                <p class="statDefense">Defensa: ${pokemon.defense}</p>
            </div>`
        teamBox.innerHTML += pokemonMostarDatos
    })
    statsBox.innerHTML = `
        <p class="tutulo">Estadisticas totales</p>
        <p><span class="TotalstatAttack">Ataque total:</span> ${totalAttack}</p>
        <p><span class="TotalstatDefense">Defensa total:</span> ${totalDefense}</p>`
}
// mostrarEquiposCreados, resive los datos para crear 2 quipos
function mostrarEquiposCreados() {
    crearTeam(localTeam1 => {
        team1Data = localTeam1
        crearTeam(localTeam2 => {
            team2Data = localTeam2
                if (team1Data.length > 0 && team2Data.length > 0) {
                    mostrarTeam(team1Data, team1Pokemon, team1Stats)
                    mostrarTeam(team2Data, team2Pokemon, team2Stats)
                }
            })
    })
}
// inicia el programa para poder mostrarce en la pantalla
mostrarEquiposCreados()
//botonCombat, se actiba con el boton, "¡Iniciar batalla Pokemon!", calcula la diferencia de daño y detecta un ganador
function botonCombat() {
    let stats1 = {attack: 0, defense: 0}
    let stats2 = {attack: 0, defense: 0}
        team1Data.forEach(p => {
            stats1.attack += p.attack
            stats1.defense += p.defense
        });
        team2Data.forEach(p => {
            stats2.attack += p.attack
            stats2.defense += p.defense
        });
    const difference1 = stats1.attack - stats2.defense
    const difference2 = stats2.attack - stats1.defense
    let winnerMessage
        if (difference1 > difference2) {
            winnerMessage = `<h3>¡El Equipo 1 es el Ganador!</h3>`
        } else if (difference2 > difference1) {
            winnerMessage = `<h3>¡El Equipo 2 es el Ganador!</h3>`
        } else {
            winnerMessage = `<h3>¡Es un Empate!</h3>`
        }
    resultadoCombat.innerHTML = `
        ${winnerMessage}
        <div class="result-grid">
            <div class="resultadoTeam1">
                <h4>Resumen Equipo 1</h4>
                <p>Ataque Total: ${stats1.attack}</p>
                <p>Defensa Total: ${stats1.defense}</p>
                <p class="diferencia">Diferencia (vs Defensa 2): <span>${difference1}</span></p>
            </div>
            <div class="resultadoTeam2">
                <h4>Resumen Equipo 2</h4>
                <p>Ataque Total: ${stats2.attack}</p>
                <p>Defensa Total: ${stats2.defense}</p>
                <p class="diferencia">Diferencia (vs Defensa 1): <span>${difference2}</span></p>
            </div>
        </div>
    `
    resultadoCombat.classList.remove('hidden')
}