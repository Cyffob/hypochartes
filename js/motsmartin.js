async function MotsMartin(cheminCSV, idTableau, idInput, idBoutonReset) {
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

        // État partagé entre recherche et tri
        const etat = {
            recherche: '',
            colonneTri: null,
            ordreCroissant: true
        }

        function mettreAJourTableau() {
            let donneesAffichees = [...donnees];
            
            // 1. Filtrage
            if (etat.recherche) {
                donneesAffichees = donneesAffichees.filter(ligne => {
                    return colonnes.some(col => 
                        (ligne[col] || '').toString().toLowerCase().includes(etat.recherche)
                    );
                });
            }
            
            // 2. Tri
            if (etat.colonneTri) {
                donneesAffichees.sort((a, b) => {
                    const valA = (a[etat.colonneTri] || '').toString().toLowerCase();
                    const valB = (b[etat.colonneTri] || '').toString().toLowerCase();
                    if (valA < valB) return etat.ordreCroissant ? -1 : 1;
                    if (valA > valB) return etat.ordreCroissant ? 1 : -1;
                    return 0;
                });
            }
            
            // 3. Affichage
            afficherTableau(donneesAffichees, colonnes, idTableau);
            attacherEvenementsTri();
        }
        
        function attacherEvenementsTri() {
            const tableau = document.getElementById(idTableau);
            const entetes = tableau.querySelectorAll('th');
            
            entetes.forEach(th => {
                th.style.cursor = 'pointer';
                th.addEventListener('click', function() {
                    const colonne = th.dataset.colonne;
                    if (colonne === etat.colonneTri) {
                        etat.ordreCroissant = !etat.ordreCroissant;
                    } else {
                        etat.colonneTri = colonne;
                        etat.ordreCroissant = true;
                    }
                    mettreAJourTableau();
                });
            });
        }
        
        // Recherche
        const input = document.getElementById(idInput);
        input.addEventListener('input', function() {
            etat.recherche = input.value.toLowerCase();
            mettreAJourTableau();
        });

        // Réinitialisation
        const boutonReset = document.getElementById(idBoutonReset);
        boutonReset.addEventListener('click', function() {
            etat.recherche = '';
            etat.colonneTri = null;
            etat.ordreCroissant = true;
            input.value = '';
            mettreAJourTableau();
        });
        
        // Affichage initial
        mettreAJourTableau()

        /*
        afficherTableau(donnees, colonnes, idTableau)
        activerTri(donnees, colonnes, idTableau);
        */
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
        html += `<th class="entete-colonne ${classe}" data-colonne="${col}">${col}</th>`;
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

MotsMartin('../data/motsmartin/10au17sept.csv', 'mots-martin-2', 'recherche-mots', 'reinitialiser-mots')
//activerRecherche('recherche-mots', 'mots-martin-2')
