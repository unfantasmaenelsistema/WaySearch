async function searchArchive() {
    const queryInput = document.getElementById('query').value.trim();
    const extension = document.getElementById('extension').value;
    const resultsDiv = document.getElementById('results');

    if (!queryInput) {
        alert("Por favor, introduce un término de búsqueda.");
        return;
    }

    resultsDiv.innerHTML = "<div class='loader'>Buscando tesoros digitales...</div>";

    // Lógica para cadenas de texto: 
    // Si el usuario usa comillas, se respeta. Si no, las añadimos para mayor precisión.
    const searchTerms = queryInput.includes('"') ? queryInput : `"${queryInput}"`;
    
    // Construcción de la Query
    let finalQuery = `(title:${searchTerms} OR description:${searchTerms})`;
    if (extension) {
        finalQuery += ` AND format:(${extension})`;
    }

    // URL de la API (limitado a 50 resultados para rapidez)
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(finalQuery)}&output=json&rows=50`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        render(data.response.docs);
    } catch (error) {
        resultsDiv.innerHTML = "<p>Error en la conexión. Inténtalo de nuevo.</p>";
    }
}

function render(docs) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (docs.length === 0) {
        resultsDiv.innerHTML = "<p>No se encontraron archivos con esos criterios.</p>";
        return;
    }

    docs.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        // Imagen por defecto si no tiene miniatura
        const thumb = `https://archive.org/services/img/${item.identifier}`;
        
        card.innerHTML = `
            <img src="${thumb}" alt="Portada" onerror="this.style.display='none'">
            <h3>${item.title}</h3>
            <p>📁 Formatos: ${item.format ? item.format.slice(0, 3).join(', ') : 'Varios'}</p>
            <div class="card-footer">
                <a class="btn-view" href="https://archive.org/details/${item.identifier}" target="_blank">Ver Detalles</a>
            </div>
        `;
        resultsDiv.appendChild(card);
    });
}