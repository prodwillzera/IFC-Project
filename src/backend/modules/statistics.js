function generateGraphData(receptionData) {

  const result = [];

  const months = [
    "jan", "fev", "mar", "abr",
    "mai", "jun", "jul", "ago",
    "set", "out", "nov", "dez"
  ];

  receptionData.forEach(item => {

    if (!item.dia) {
      return;
    }

    const parts = item.dia.split("/");
    if (parts.length < 3) {
      return;
    }

    const monthNum = parseInt(parts[1], 10);
    const year = parts[2] ? parts[2].trim() : "";
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12 || !year) {
      return;
    }

    const monthName = months[monthNum - 1];
    const monthKey = `${year}-${String(monthNum).padStart(2, "0")}`; // e.g. "2025-07"
    const monthLabel = `${monthName}/${year.slice(-2)}`; // e.g. "jul/25"

    const sector = item.setor;
    const score = Number(item.avaliacao);

    let periodData = result.find(
      data => data.periodo === monthKey
    );

    if (!periodData) {
      periodData = {
        periodo: monthKey,
        ano: year,
        mes: monthName,
        mesNumero: String(monthNum).padStart(2, "0"),
        label: monthLabel
      };

      result.push(periodData);
    }

    if (!periodData[sector]) {
      periodData[sector] = {
        total: 0,
        count: 0
      };
    }

    periodData[sector].total += score;
    periodData[sector].count++;
  });

  // Pode escolher todos os anos ou ano por ano
  result.sort((a, b) => a.periodo.localeCompare(b.periodo));

  const nonSectorKeys = new Set(["periodo", "ano", "mes", "mesNumero", "label"]);

  result.forEach(period => {
    Object.keys(period).forEach(key => {
      if (!nonSectorKeys.has(key)) {
        const sector = period[key];
        period[key] = Number(
          (
            sector.total /
            sector.count
          ).toFixed(1)
        );
      }
    });
  });

  return result;
}

export {
  generateGraphData
};