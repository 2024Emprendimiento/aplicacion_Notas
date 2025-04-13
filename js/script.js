let notas = JSON.parse(localStorage.getItem("notas")) || [];

function guardarNotas() {
  localStorage.setItem("notas", JSON.stringify(notas));
}

function mostrarNotas() {
  const contenedor = document.getElementById("contenedorNotas");
  contenedor.innerHTML = "";

  const categorias = ["Trabajo", "Personal", "Estudio"];
  categorias.forEach((cat) => {
    const notasFiltradas = notas.filter((n) => n.categoria === cat);
    if (notasFiltradas.length > 0) {
      const tituloCat = document.createElement("h5");
      tituloCat.textContent = cat;
      contenedor.appendChild(tituloCat);

      notasFiltradas.forEach((nota, index) => {
        const card = document.createElement("div");
        card.className = "card p-3 mb-2";

        card.innerHTML = `
              <strong>${nota.titulo}</strong>
              <p>${nota.descripcion}</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-success btn-sm" onclick="editarNota(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarNota(${index})">Eliminar</button>
              </div>
            `;
        contenedor.appendChild(card);
      });
    }
  });
}

function agregarNota() {
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!titulo || !descripcion) {
    Swal.fire(
      "Completa los campos",
      "El título y descripción son obligatorios",
      "warning"
    );
    return;
  }

  notas.push({ titulo, descripcion, categoria });
  guardarNotas();
  mostrarNotas();
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("categoria").value = "Trabajo";
}

function eliminarNota(index) {
  Swal.fire({
    title: "¿Eliminar esta nota?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      notas.splice(index, 1);
      guardarNotas();
      mostrarNotas();
    }
  });
}

function editarNota(index) {
  const nota = notas[index];
  Swal.fire({
    title: "Editar Nota",
    html: `
          <input id="tituloEdit" class="swal2-input" value="${nota.titulo}">
          <textarea id="descEdit" class="swal2-textarea">${
            nota.descripcion
          }</textarea>
          <select id="catEdit" class="swal2-select">
            <option value="Trabajo" ${
              nota.categoria === "Trabajo" ? "selected" : ""
            }>Trabajo</option>

            <option value="Personal" ${
              nota.categoria === "Personal" ? "selected" : ""
            }>Personal</option>
            <option value="Estudio" ${
              nota.categoria === "Estudio" ? "selected" : ""
            }>Estudio</option>
          </select>
        `,
    focusConfirm: false,
    preConfirm: () => {
      const nuevoTitulo = document.getElementById("tituloEdit").value.trim();
      const nuevaDesc = document.getElementById("descEdit").value.trim();
      const nuevaCat = document.getElementById("catEdit").value;

      if (!nuevoTitulo || !nuevaDesc) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }
    },
  });
}

// Tabla de Notas

const tablaNotas = document.getElementById("tablaNotas");

function agregarNota() {
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const categoria = document.getElementById("categoria").value.trim();

  if (!titulo || !descripcion || !categoria) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  const fecha = new Date().toLocaleDateString();

  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${titulo}</td>
    <td>${descripcion}</td>
    <td>${categoria}</td>
    <td>${fecha}</td>
    <td>
      <button class="btn btn-success btn-sm me-1" onclick="editarNota(this)">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="eliminarNota(this)">Eliminar</button>
    </td>
  `;

  tablaNotas.appendChild(fila);

  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("categoria").value = "";

  Swal.fire({
    icon: "success",
    title: "Nota agregada",
    showConfirmButton: false,
    timer: 1500,
  });
}

function eliminarNota(boton) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta nota se eliminará permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const fila = boton.closest("tr");
      fila.remove();
      Swal.fire({
        icon: "success",
        title: "Nota eliminada",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  });
}

function editarNota(boton) {
  const fila = boton.closest("tr");
  const celdas = fila.getElementsByTagName("td");

  const tituloActual = celdas[0].innerText;
  const descripcionActual = celdas[1].innerText;
  const categoriaActual = celdas[2].innerText;

  Swal.fire({
    title: "Editar Nota",
    html: `
    <input id="editTitulo" class="swal2-input" placeholder="Título" value="${tituloActual}">
    <textarea id="editDescripcion" class="swal2-textarea" placeholder="Descripción">${descripcionActual}</textarea>
    <select id="editCategoria" class="swal2-select">
      <option value="Trabajo" ${
        categoriaActual === "Trabajo" ? "selected" : ""
      }>Trabajo</option>
      <option value="Personal" ${
        categoriaActual === "Personal" ? "selected" : ""
      }>Personal</option>
      <option value="Estudio" ${
        categoriaActual === "Estudio" ? "selected" : ""
      }>Estudio</option>
    </select>
  `,
    confirmButtonText: "Guardar",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nuevoTitulo = document.getElementById("editTitulo").value.trim();
      const nuevaDescripcion = document
        .getElementById("editDescripcion")
        .value.trim();
      const nuevaCategoria = document
        .getElementById("editCategoria")
        .value.trim();

      if (!nuevoTitulo || !nuevaDescripcion || !nuevaCategoria) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }
      return { nuevoTitulo, nuevaDescripcion, nuevaCategoria };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { nuevoTitulo, nuevaDescripcion, nuevaCategoria } = result.value;
      celdas[0].innerText = nuevoTitulo;
      celdas[1].innerText = nuevaDescripcion;
      celdas[2].innerText = nuevaCategoria;

      Swal.fire({
        icon: "success",
        title: "Nota actualizada",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  });
}

function eliminarTodasLasNotas() {
  Swal.fire({
    title: "¿Deseas eliminar todas las notas?",
    text: "Esta acción eliminará todas las notas de forma permanente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar todo",
    cancelButtonText: "No",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      // Borra todo el contenido de la tabla
      tablaNotas.innerHTML = "";

      // Borra las notas guardadas en localStorage
      localStorage.removeItem("notas");

      Swal.fire({
        icon: "success",
        title: "Todas las notas han sido eliminadas",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function nextPage() {
    if (currentPage * notesPerPage < notes.length) {
      currentPage++;
      renderNotes();
    }
  }

function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderNotes();
    }
}


window.onload = mostrarNotas;
