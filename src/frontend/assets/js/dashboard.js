import { validateData, validateID, validateHour } from './modules/validation.js';
import { applyMask } from './modules/mask.js';
import { checkAuth, getLoggedUser, logout } from './modules/auth.js';
import { Toast } from './modules/toast.js';

document.addEventListener("DOMContentLoaded", () => {

  checkAuth();

  const user = getLoggedUser();
  if (user) {
    const userDisplay = document.getElementById("user-display-name");
    const roleDisplay = document.getElementById("user-display-role");
    if (userDisplay) userDisplay.textContent = user.name;
    if (roleDisplay) roleDisplay.textContent = user.role;
  }

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    logout();
  });

  applyMask();
  setupEditInputMasks();

  let allVisits = [];
  let filteredVisits = [];
  let currentSortColumn = "dia";
  let currentSortDir = "desc";
  let currentPage = 1;
  const rowsPerPage = 10;

  const tableBody = document.getElementById("table-body");
  const searchInput = document.getElementById("table-search");
  const filterSector = document.getElementById("filter-sector");
  const filterScore = document.getElementById("filter-score");
  const paginationInfo = document.getElementById("pagination-info");
  const btnPrevPage = document.getElementById("btn-prev-page");
  const btnNextPage = document.getElementById("btn-next-page");
  const pageIndicator = document.getElementById("page-num");

  const form = document.getElementById("reception-form");
  
  const inputDay = document.getElementById("input-day");
  if (inputDay && !inputDay.value) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    inputDay.value = `${dd}/${mm}/${yyyy}`;
  }

  const inputEntry = document.getElementById("input-entry");
  if (inputEntry && !inputEntry.value) {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    inputEntry.value = `${hh}:${min}`;
  }

  async function fetchVisits() {
    try {
      const response = await fetch('/visitas');
      if (!response.ok) throw new Error("Erro ao buscar registros.");
      allVisits = await response.json();
      applyFiltersAndRender();
    } catch (err) {
      console.error(err);
      Toast.error("Não foi possível carregar os dados de recepção.");
      tableBody.innerHTML = `
        <tr class="empty-state">
          <td colspan="8" style="color: var(--danger)">Erro ao carregar dados do servidor.</td>
        </tr>
      `;
    }
  }

  function applyFiltersAndRender() {
    const query = searchInput?.value.toLowerCase().trim() || "";
    const sectorVal = filterSector?.value || "";
    const scoreVal = filterScore?.value || "";

    filteredVisits = allVisits.filter(item => {
      const matchesSearch = !query || 
        (item.nome?.toLowerCase().includes(query)) ||
        (item.cpf?.includes(query)) ||
        (item.motivo?.toLowerCase().includes(query)) ||
        (item.empresa?.toLowerCase().includes(query));

      const matchesSector = !sectorVal || item.setor === sectorVal;
      const matchesScore = !scoreVal || String(item.avaliacao) === scoreVal;

      return matchesSearch && matchesSector && matchesScore;
    });

    filteredVisits.sort((a, b) => {
      let valA = a[currentSortColumn] || "";
      let valB = b[currentSortColumn] || "";

      if (currentSortColumn === "dia") {
        valA = parseDateString(valA);
        valB = parseDateString(valB);
      } else if (currentSortColumn === "avaliacao") {
        valA = parseInt(valA) || 0;
        valB = parseInt(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return currentSortDir === "asc" ? -1 : 1;
      if (valA > valB) return currentSortDir === "asc" ? 1 : -1;
      return 0;
    });

    const totalPages = Math.ceil(filteredVisits.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }

    renderTablePage();
  }

  function renderTablePage() {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (filteredVisits.length === 0) {
      tableBody.innerHTML = `
        <tr class="empty-state">
          <td colspan="8">Nenhum registro correspondente encontrado.</td>
        </tr>
      `;
      paginationInfo.textContent = "Exibindo 0 de 0 registros";
      btnPrevPage.disabled = true;
      btnNextPage.disabled = true;
      pageIndicator.textContent = "Pág. 1";
      return;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredVisits.length);
    const pageVisits = filteredVisits.slice(startIndex, endIndex);

    pageVisits.forEach(item => {
      const tr = document.createElement("tr");
      tr.id = `row-${item.id}`;

      const rating = parseInt(item.avaliacao) || 5;
      const scoreBadge = `<span class="rating-badge rating-${rating}">${rating}</span>`;
      
      const nameDisp = item.nome.length > 25 ? item.nome.slice(0, 25) + "..." : item.nome;
      const whyDisp = item.motivo.length > 25 ? item.motivo.slice(0, 25) + "..." : item.motivo;

      const statusClass = item.status === "Ativo" 
        ? "background-color: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-weight:600; font-size:0.75rem;"
        : "background-color: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 20px; font-weight:500; font-size:0.75rem;";
      
      const statusHtml = `<span style="${statusClass}">${item.status || "Concluído"}</span>`;

      tr.innerHTML = `
        <td style="font-family: 'JetBrains Mono', monospace; font-weight:500;">${item.dia}</td>
        <td style="font-weight:600; color: var(--text-main);">${nameDisp}</td>
        <td style="font-family: 'JetBrains Mono', monospace;">${item.cpf}</td>
        <td><span style="font-weight:500; color: var(--primary); background-color: var(--primary-light); padding: 4px 8px; border-radius:4px;">${item.setor}</span></td>
        <td>${whyDisp}</td>
        <td>${statusHtml}</td>
        <td style="text-align: center;">${scoreBadge}</td>
        <td>
          <div class="table-cell-actions">
            <button class="btn-table-icon btn-view" title="Visualizar Detalhes" data-id="${item.id}">👁️</button>
            <button class="btn-table-icon btn-edit" title="Editar" data-id="${item.id}">✏️</button>
            <button class="btn-table-icon btn-delete" title="Excluir" data-id="${item.id}">🗑️</button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll(".btn-view").forEach(btn => {
      btn.addEventListener("click", () => handleViewDetails(btn.dataset.id));
    });
    tableBody.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", () => handleEdit(btn.dataset.id));
    });
    tableBody.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", () => handleDelete(btn.dataset.id));
    });

    paginationInfo.textContent = `Exibindo ${startIndex + 1}-${endIndex} de ${filteredVisits.length} registros`;
    pageIndicator.textContent = `Pág. ${currentPage}`;
    
    btnPrevPage.disabled = currentPage === 1;
    const totalPages = Math.ceil(filteredVisits.length / rowsPerPage);
    btnNextPage.disabled = currentPage >= totalPages;
  }

  function parseDateString(str) {
    if (!str) return 0;
    const parts = str.split('/');
    if (parts.length === 3) {
      return parseInt(parts[2] + parts[1] + parts[0]) || 0; // Return YYYYMMDD as number for simple sort
    }
    return 0;
  }

  async function handleViewDetails(id) {
    try {
      const response = await fetch(`/visitas/${id}`);
      if (!response.ok) throw new Error("Erro ao carregar detalhes.");
      const data = await response.json();

      document.getElementById("detail-id").textContent = data.id;
      document.getElementById("detail-date").textContent = data.dia;
      document.getElementById("detail-name").textContent = data.nome;
      document.getElementById("detail-cpf").textContent = data.cpf || "Não informado";
      document.getElementById("detail-phone").textContent = data.telefone || "Não informado";
      document.getElementById("detail-company").textContent = data.empresa || "Não informado";
      document.getElementById("detail-why").textContent = data.motivo;
      document.getElementById("detail-sector").textContent = data.setor;
      document.getElementById("detail-host").textContent = data.responsavel || "Não informado";
      document.getElementById("detail-doc").textContent = data.documento || "Não informado";
      document.getElementById("detail-entry").textContent = data.entrada;
      document.getElementById("detail-exit").textContent = data.saida;
      document.getElementById("detail-status").textContent = data.status || "Concluído";
      document.getElementById("detail-score").textContent = `${data.avaliacao} ★`;
      document.getElementById("detail-notes").textContent = data.observacoes || "Sem observações adicionais.";

      openModal("modal-view");
    } catch (err) {
      console.error(err);
      Toast.error("Não foi possível carregar os detalhes do registro.");
    }
  }

  async function handleEdit(id) {
    try {
      const response = await fetch(`/visitas/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar dados.");
      const data = await response.json();

      document.getElementById("edit-id").value = data.id;
      document.getElementById("edit-name").value = data.nome;
      document.getElementById("edit-day").value = data.dia;
      document.getElementById("edit-cpf").value = data.cpf;
      document.getElementById("edit-why").value = data.motivo;
      document.getElementById("edit-sector").value = data.setor;
      document.getElementById("edit-entry").value = data.entrada;
      document.getElementById("edit-exit").value = data.saida;
      document.getElementById("edit-score").value = data.avaliacao;
      document.getElementById("edit-status").value = data.status || "Concluído";
      document.getElementById("edit-phone").value = data.telefone || "";
      document.getElementById("edit-company").value = data.empresa || "";
      document.getElementById("edit-host").value = data.responsavel || "";
      document.getElementById("edit-doc").value = data.documento || "";
      document.getElementById("edit-notes").value = data.observacoes || "";

      openModal("modal-edit");
    } catch (err) {
      console.error(err);
      Toast.error("Erro ao carregar dados para edição.");
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/visitas/${id}`);
      if (!response.ok) throw new Error();
      const data = await response.json();

      document.getElementById("delete-record-name").textContent = data.nome;
      document.getElementById("delete-id").value = data.id;

      openModal("modal-delete");
    } catch (err) {
      Toast.error("Erro ao buscar registro para exclusão.");
    }
  }

  const editForm = document.getElementById("edit-form");
  editForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const dataInputs = {
      dia: document.getElementById("edit-day").value,
      nome: document.getElementById("edit-name").value,
      cpf: document.getElementById("edit-cpf").value,
      motivo: document.getElementById("edit-why").value,
      setor: document.getElementById("edit-sector").value,
      entrada: document.getElementById("edit-entry").value,
      saida: document.getElementById("edit-exit").value,
      avaliacao: document.getElementById("edit-score").value,
      telefone: document.getElementById("edit-phone").value,
      empresa: document.getElementById("edit-company").value,
      responsavel: document.getElementById("edit-host").value,
      documento: document.getElementById("edit-doc").value,
      status: document.getElementById("edit-status").value,
      observacoes: document.getElementById("edit-notes").value
    };

    if (!validateData(dataInputs.dia)) {
      Toast.error("Erro de validação: A data informada é inválida. Use o formato DD/MM/YYYY.");
      return;
    }

    if (!validateID(dataInputs.cpf)) {
      Toast.error("Erro de validação: O CPF informado é inválido. Por favor, verifique os números digitados.");
      return;
    }

    if (!validateHour(dataInputs.entrada)) {
      Toast.error("Erro de validação: O horário de entrada informado é inválido. Use o formato HH:MM.");
      return;
    }

    if (!validateHour(dataInputs.saida)) {
      Toast.error("Erro de validação: O horário de saída informado é inválido. Use o formato HH:MM.");
      return;
    }

    try {
      const response = await fetch(`/visitas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataInputs)
      });

      if (!response.ok) throw new Error();
      
      closeModal("modal-edit");
      Toast.success("Registro de visita atualizado com sucesso!");
      fetchVisits(); // Reload data
    } catch (err) {
      Toast.error("Erro ao atualizar o registro no banco de dados.");
    }
  });

  const btnConfirmDelete = document.getElementById("btn-confirm-delete");
  btnConfirmDelete?.addEventListener("click", async () => {
    const id = document.getElementById("delete-id").value;
    try {
      const response = await fetch(`/visitas/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();

      closeModal("modal-delete");
      Toast.success("Registro de visita excluído com sucesso!");
      fetchVisits();
    } catch (err) {
      Toast.error("Erro ao excluir o registro de visita.");
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dataInputs = {
      dia: document.getElementById("input-day").value,
      nome: document.getElementById("input-name").value,
      cpf: document.getElementById("input-id").value,
      motivo: document.getElementById("input-why").value,
      setor: document.getElementById("input-sector").value,
      entrada: document.getElementById("input-entry").value,
      saida: document.getElementById("input-exit").value,
      avaliacao: document.getElementById("input-score").value,
      // Optional fields
      telefone: document.getElementById("input-phone")?.value || "",
      empresa: document.getElementById("input-company")?.value || "",
      responsavel: document.getElementById("input-host")?.value || "",
      documento: document.getElementById("input-doc")?.value || "",
      status: document.getElementById("input-status")?.value || "Concluído",
      observacoes: document.getElementById("input-notes")?.value || ""
    };

    if (!validateData(dataInputs.dia)) {
      Toast.error("Dados inválidos! A data informada é inválida. Use o formato DD/MM/YYYY.");
      return;
    }

    if (!validateID(dataInputs.cpf)) {
      Toast.error("Dados inválidos! O CPF informado é inválido. Por favor, verifique os números digitados.");
      return;
    }

    if (!validateHour(dataInputs.entrada)) {
      Toast.error("Dados inválidos! O horário de entrada informado é inválido. Use o formato HH:MM.");
      return;
    }

    if (!validateHour(dataInputs.saida)) {
      Toast.error("Dados inválidos! O horário de saída informado é inválido. Use o formato HH:MM.");
      return;
    }

    try {
      const response = await fetch("/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataInputs)
      });

      if (!response.ok) throw new Error("Erro no servidor");

      const data = await response.json();
      Toast.success(data.message || "Registro cadastrado com sucesso!");

      // Clear input fields (except date/entry-hour to keep workflow fast)
      document.getElementById("input-name").value = "";
      document.getElementById("input-id").value = "";
      document.getElementById("input-why").value = "";
      document.getElementById("input-sector").value = "";
      if (document.getElementById("input-phone")) document.getElementById("input-phone").value = "";
      if (document.getElementById("input-company")) document.getElementById("input-company").value = "";
      if (document.getElementById("input-host")) document.getElementById("input-host").value = "";
      if (document.getElementById("input-doc")) document.getElementById("input-doc").value = "";
      if (document.getElementById("input-notes")) document.getElementById("input-notes").value = "";

      // Re-fetch database to populate in real-time
      fetchVisits();
    } catch (err) {
      console.error(err);
      Toast.error("Erro de conexão ao salvar a visita.");
    }
  });

  // 7. Interactive sorting, search, filter hooks
  searchInput?.addEventListener("input", () => {
    currentPage = 1;
    applyFiltersAndRender();
  });

  filterSector?.addEventListener("change", () => {
    currentPage = 1;
    applyFiltersAndRender();
  });

  filterScore?.addEventListener("change", () => {
    currentPage = 1;
    applyFiltersAndRender();
  });

  // Header Sorting Hook
  const headers = document.querySelectorAll("table.reception-table th[data-sort]");
  headers.forEach(th => {
    th.addEventListener("click", () => {
      const column = th.dataset.sort;
      if (currentSortColumn === column) {
        currentSortDir = currentSortDir === "asc" ? "desc" : "asc";
      } else {
        currentSortColumn = column;
        currentSortDir = "asc";
      }

      // Update header sort indications visually
      headers.forEach(h => {
        h.textContent = h.textContent.replace(" ▲", "").replace(" ▼", "").replace(" ⇅", "");
        if (h === th) {
          h.textContent += currentSortDir === "asc" ? " ▲" : " ▼";
        } else {
          h.textContent += " ⇅";
        }
      });

      applyFiltersAndRender();
    });
  });

  // Prev/Next page handlers
  btnPrevPage?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTablePage();
    }
  });

  btnNextPage?.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredVisits.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTablePage();
    }
  });

  // 8. Advanced Actions: CSV Export
  const btnExportCsv = document.getElementById("btn-export-csv");
  btnExportCsv?.addEventListener("click", () => {
    if (filteredVisits.length === 0) {
      Toast.warning("Não há dados correspondentes para exportar.");
      return;
    }

    try {
      // Assemble CSV Content
      const headers = ["ID", "Data", "Nome", "CPF", "Motivo", "Setor", "Entrada", "Saida", "Avaliacao", "Telefone", "Empresa", "Responsavel", "Documento", "Status", "Observacoes"];
      const csvRows = [headers.join(",")];

      filteredVisits.forEach(item => {
        const rowValues = [
          `"${item.id || ''}"`,
          `"${item.dia || ''}"`,
          `"${(item.nome || '').replace(/"/g, '""')}"`,
          `"${item.cpf || ''}"`,
          `"${(item.motivo || '').replace(/"/g, '""')}"`,
          `"${item.setor || ''}"`,
          `"${item.entrada || ''}"`,
          `"${item.saida || ''}"`,
          `"${item.avaliacao || ''}"`,
          `"${(item.telefone || '').replace(/"/g, '""')}"`,
          `"${(item.empresa || '').replace(/"/g, '""')}"`,
          `"${(item.responsavel || '').replace(/"/g, '""')}"`,
          `"${(item.documento || '').replace(/"/g, '""')}"`,
          `"${item.status || 'Concluído'}"`,
          `"${(item.observacoes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ];
        csvRows.push(rowValues.join(","));
      });

      const csvContent = "\uFEFF" + csvRows.join("\n"); // Add BOM for excel support
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `relatorio_recepcao_ifc_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Toast.success("Exportação CSV concluída!");
    } catch (err) {
      console.error(err);
      Toast.error("Erro ao gerar arquivo CSV.");
    }
  });

  // 9. Advanced Actions: Print Report
  const btnPrintReport = document.getElementById("btn-print-report");
  btnPrintReport?.addEventListener("click", () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      Toast.error("Permissão de pop-up negada pelo navegador.");
      return;
    }

    const todayDateStr = new Date().toLocaleDateString("pt-BR");

    let tableRowsHtml = "";
    filteredVisits.forEach(item => {
      tableRowsHtml += `
        <tr>
          <td>${item.dia}</td>
          <td><b>${item.nome}</b></td>
          <td>${item.cpf}</td>
          <td>${item.setor}</td>
          <td>${item.motivo}</td>
          <td>${item.entrada}</td>
          <td>${item.saida}</td>
          <td>${item.status || 'Concluído'}</td>
          <td style="text-align:center;">${item.avaliacao} ★</td>
        </tr>
      `;
    });

    printWindow.document.write(`
      <html>
      <head>
        <title>Relatório de Visitas IFC Campus Fraiburgo</title>
        <style>
          body { font-family: sans-serif; color: #1e293b; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0f7d3a; padding-bottom: 10px; }
          .header h1 { color: #0f7d3a; margin: 0; font-size: 24px; }
          .header p { color: #64748b; margin: 5px 0 0 0; font-size: 14px; }
          .info { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th { background-color: #f1f5f9; text-align: left; padding: 10px; border-bottom: 1px solid #cbd5e1; font-weight:600; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Instituto Federal Catarinense - Campus Fraiburgo</h1>
          <p>Relatório Consolidado de Recepção e Atendimentos</p>
        </div>
        <div class="info">
          <span>Gerado em: ${todayDateStr}</span>
          <span>Registros correspondentes: ${filteredVisits.length}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Visitante</th>
              <th>CPF</th>
              <th>Setor</th>
              <th>Motivo</th>
              <th>Entrada</th>
              <th>Saída</th>
              <th>Status</th>
              <th style="text-align:center;">Nota</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color:#0f7d3a; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Imprimir Página</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  });

  function setupEditInputMasks() {
    const editDay = document.getElementById("edit-day");
    const editCpf = document.getElementById("edit-cpf");
    const editEntry = document.getElementById("edit-entry");
    const editExit = document.getElementById("edit-exit");

    editDay?.addEventListener("input", () => {
      let v = editDay.value.replace(/\D/g, '');
      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
      if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5, 9);
      editDay.value = v;
    });

    editCpf?.addEventListener("input", () => {
      let v = editCpf.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})/, '$1-$2');
      editCpf.value = v;
    });

    function formatHour(input) {
      input?.addEventListener("input", () => {
        let v = input.value.replace(/\D/g, '');
        if (v.length > 2) v = v.slice(0, 2) + ':' + v.slice(2);
        input.value = v;
      });
    }
    formatHour(editEntry);
    formatHour(editExit);
  }

  let sequence = "";
  window.addEventListener("keypress", (e) => {
    sequence += e.key.toLowerCase();
    const codes = {
      cogu: () => console.log("%cCogumelo_Seco mestre do xanascript", "color: #0f7d3a; font-weight: bold; font-size: 14px;"),
      guto: () => console.log("%cVocê citou o nome proibido, agora morra", "color: #dc2626; font-weight: bold; font-size: 14px;"),
      tuki: () => console.log("%cMultiprofissional e usuario de brave +100 aura", "color: #d97706; font-weight: bold; font-size: 14px;"),
      biruta: () => console.log("%cRei do frontend, leao da GC", "color: #2563eb; font-weight: bold; font-size: 14px;")
    };
    for (let code in codes) {
      if (sequence.includes(code)) {
        codes[code]();
        sequence = "";
      }
    }
    sequence = sequence.slice(-20);
  });

  fetchVisits();
});
