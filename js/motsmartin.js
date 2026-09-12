async function MotsMartin(cheminCSV, idTableau) {
    try{
        const r = await fetch (cheminCSV)
        if (!r.ok){
            throw new Error()
        }
        const texteCSV = await r.text()

        const resultat = Papa.parse(texteCSV, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';' // on force le point-virgule
        });

        const donnees = resultat.data;   // tableau d'objets {colonne1: valeur, colonne2: valeur...}
        const colonnes = resultat.meta.fields;

        afficherTableau(donnees, colonnes, idTableau)
        
    } catch(error){
        console.error(error)
    }
}

function afficherTableau(donnees, colonnes, idTableau) {
    const tableau = document.getElementById(idTableau);
    
    // Correspondance colonne -> classe CSS
    const classesParColonne = {
        Latin: 'colonne-latin',
        'Nature/genre' : 'colonne-nature',
        Français: 'colonne-francais'
        // ajoute ici autant de colonnes que nécessaire
    };

    // En-tête
    let html = '<thead><tr>'
    colonnes.forEach(col => {
        const classe = classesParColonne[col] || 'entete-colonne';
        html += `<th class="entete-colonne ${classe}">${col}</th>`;
    })
    html += '</tr></thead>'
    
    // Corps
    html += '<tbody>'
    donnees.forEach(ligne => {
        html += '<tr class="ligne-donnee">'
        colonnes.forEach(col => {
            const classe = classesParColonne[col] || 'cellule';
            html += `<td class="cellule ${classe}">${ligne[col]}</td>`;
        })
        html += '</tr>'
    })
    html += '</tbody>'
    
    tableau.innerHTML = html
}

MotsMartin('/data/motsmartin/10au17sept.csv', 'mots-martin-2')
