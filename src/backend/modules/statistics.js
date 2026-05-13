function generateGraphData ( receptionData ) {

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

        const parts =
            item.dia.split("/");

        const month =
            months[
                parseInt(parts[1]) - 1
            ];

        const sector = item.setor;

        const score =
            Number(item.avaliacao);


        let monthData =
            result.find(
                data => data.mes === month
            );


        if (!monthData) {

            monthData = {
                mes: month
            };

            result.push(monthData);
        }


        if (!monthData[sector]) {

            monthData[sector] = {
                total: 0,
                count: 0
            };
        }


        monthData[sector].total += score;

        monthData[sector].count++;
    });
    
    result.forEach(month => {

        Object.keys(month).forEach(key => {

            if (key !== "mes") {

                const sector = month[key];

                month[key] = Number(
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

module.exports = {
    generateGraphData
};