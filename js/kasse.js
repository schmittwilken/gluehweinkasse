/**
 * 2025
 * Jörg Schmittwilken
 * 
 * post@schmittwilken.de
 */

let abrechnung = {
	gesamtsumme : 0,
	pfadausgabe : 0,
	pfandrueckgabe : 0
};

window.addEventListener("DOMContentLoaded", init)

/**
 * Fügt die EventListener zu den Eingabefeldern hinzu
 */
function init() {
	document.getElementById("reset").addEventListener("click", init);

	document.getElementById("preisliste").innerHTML = "";
	resetAbrechnung();
	updateRechnung();
	loadItems();
}

/**
 * Lädt die Preisliste und erzeugt die Bestellung
 * @returns 
 */
async function loadItems(){
	try {
			const response = await fetch('data/preisliste.json');

			if (!response.ok)
				throw new Error(`Serverfehler: ${response.status}`);
			const data = await response.json();

			data.forEach(eintrag => {
				addItem(eintrag);
			});
			
			return data;
		} catch (error) {
			console.error('Fehler beim Laden der Daten:', error);
		}
}

/**
 * Erzeugt je Artikel eine Zeile der Bestellung (Bezeichnung, Buttons, Menge)
 * @param {*} item 
 */
function addItem(item){
	root = document.getElementById("preisliste");

	// Outer Row
	let outer_row = document.createElement("div");
	outer_row.classList.add("form-group", "row");
	root.appendChild(outer_row);

	// Label
	let label = document.createElement("label");
	label.classList.add("col-sm-5", "col-form-label", "fs-5");
	label.innerText = item.titel + " (" + getEuroString(item.preis) + ")";
	outer_row.appendChild(label);
	
	// 2nd Col
	let outer_cols = document.createElement("div");
	outer_cols.classList.add("col-sm-7", "mb-4");
	outer_row.appendChild(outer_cols);
	
	// Inner Row
	let inner_row = document.createElement("div");
	inner_row.classList.add("row");
	outer_cols.appendChild(inner_row);
	
	// - Button
	let down_div = document.createElement("div");
	down_div.classList.add("col-sm-2");
	inner_row.appendChild(down_div);
	
	let down_button = document.createElement("button");
	down_button.id = item.id + "0";
	down_button.classList.add("btn-danger", "fs-3", "px-3");
	down_button.innerText = "-";
	down_div.appendChild(down_button);
	
	// Counter
	let count_div = document.createElement("div");
	count_div.classList.add("col-sm-3");
	inner_row.appendChild(count_div);
	
	let count = document.createElement("div");
	count.id = item.id;
	count.classList.add("px-2", "py-1", "fs-3", "border");
	count.innerText = "0";
	count_div.appendChild(count);
	
	// + Button
	let up_div = document.createElement("div");
	up_div.classList.add("col-sm-2");
	inner_row.appendChild(up_div);
	
	let up_button = document.createElement("button");
	up_button.id = item.id + "1";
	up_button.classList.add("btn-success", "fs-3", "px-3");
	up_button.innerText = "+";
	up_div.appendChild(up_button);


	// Event-Listener
	up_button.addEventListener("click", function(){
		let anzahl = parseInt(item.anzahl) + 1;
		count.innerText = anzahl;
		item.anzahl = anzahl;
		abrechnung.gesamtsumme += (item.preis + item.pfand);
		if(item.pfand > 0)
			abrechnung.pfadausgabe += item.pfand;
		else
			abrechnung.pfandrueckgabe += item.pfand;
		updateRechnung();
	});

	down_button.addEventListener("click", function(){
		let anzahl = parseInt(item.anzahl) - 1;

		// keine Negativen Werte zulassen!
		if(anzahl < 0){
			anzahl = 0;
			return;
		}

		count.innerText = anzahl;
		item.anzahl = anzahl;

		abrechnung.gesamtsumme -= (item.preis + item.pfand);
		if(item.pfand > 0)
			abrechnung.pfadausgabe -= item.pfand;
		else
			abrechnung.pfandrueckgabe -= item.pfand;
		updateRechnung();
		
	});
}

/**
 * Aktualisiert den Rechnungsbetrag
 */
function updateRechnung(){
	let rechnung = document.getElementById("rechnung");
	rechnung.innerText="";

	let summe = document.createElement("div");
	summe.classList.add("fs-1");
	summe.innerText = getEuroString(abrechnung.gesamtsumme);
	rechnung.appendChild(summe);

	let pfadausgabe = document.createElement("div");
	pfadausgabe.classList.add("fs-6");
	pfadausgabe.innerHTML = "incl. <strong>" + getEuroString(abrechnung.pfadausgabe) + "</strong> Pfandausgabe";
	rechnung.appendChild(pfadausgabe);

	let pfandrueckgabe = document.createElement("div");
	pfandrueckgabe.classList.add("fs-6");
	pfandrueckgabe.innerHTML = "incl. <strong>" + getEuroString(abrechnung.pfandrueckgabe) + "</strong> Pfandrücknahme";
	rechnung.appendChild(pfandrueckgabe);
}

/**
 * Wandelt eine Zahl in einen Eurobetrag mit 2 Nachkommastellen um
 * @param {*} text 
 * @returns 
 */
function getEuroString(text){
	return Number.parseFloat(text).toFixed(2) + " €";
}

/**
 * Setzt die Abrechnung zurück
 */
function resetAbrechnung(){
	for(let i in abrechnung)
		abrechnung[i] = 0;
}