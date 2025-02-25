export const printAllPages = (data: any[], filters: Record<string, string>) => {
  const fullTable = document.createElement('div');

  const filterText = Object.entries(filters)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.map((item) => JSON.stringify(item)).join(', ')}`;
      }
      return `${key}: ${value}`;
    })
    .join(', ');

  fullTable.innerHTML = `
    <html>
      <head>
        <title>Resultados</title>
        <style>
          @page {
            size: landscape;
            margin: 20mm;
          }
          body {
            font-family: Poppins, sans-serif;
            margin: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .status-icon {
            align-items: left;
            justify-content: left;
            gap: 4px;
          }
          .status-ok {
            color: #20878b;
          }
          .status-error {
            color: #f24f4f;
          }
          .status-warning {
            color: #f9a825;
          }
          .torque-angle-col {
            text-align: left;
            width: 60px;
          }
          .icon-svg {
            width: 24px;
            height: 24px;
          }
        </style>
      </head>
      <body>
      <h4>Resultados para ${filterText}</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Data</th>
              <th>Id</th>
              <th>Ferramenta</th>
              <th>Job</th>
              <th>Programa</th>
              <th>Fuso</th>
              <th style="width: 100px;">Status Geral</th>
              <th style="width: 100px;">Torque</th>
              <th style="width: 100px;">Ângulo</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row, index) => `
                  <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f5f5f5'};">
                    <td>${row.dateTime}</td>
                    <td>${row.tid}</td>
                    <td>${row.toolName}</td>
                    <td>${row.job}</td>
                    <td>${row.programName}</td>
                    <td>${row.fuso}</td>
                    <td class="status-icon">
                      <img src="../assets/icons/printtable/${
                        row.generalStatus === 'OK' ? 'check_circle.svg' : 'cancel.svg'
                      }" class="icon-svg ${
                        row.generalStatus === 'OK' ? 'status-ok' : 'status-error'
                      }" />                      
                      ${row.generalStatus}
                    </td>
                    <td class="torque-angle-col status-icon">
                      <img src="../assets/icons/printtable/${
                        row.torqueStatus === 0
                          ? 'check_circle.svg'
                          : row.torqueStatus === 2
                            ? 'arrow_downward.svg'
                            : 'arrow_upward.svg'
                      }
                      " class="icon-svg ${
                        row.torqueStatus === 0
                          ? 'status-ok'
                          : row.torqueStatus === 2
                            ? 'status-warning'
                            : 'status-error'
                      }" />
                      ${row.torque}                      
                    </td>
                    <td class="torque-angle-col status-icon">                      
                      <img src="../assets/icons/printtable/${
                        row.angleStatus === 0
                          ? 'check_circle.svg'
                          : row.torqueStatus === 2
                            ? 'arrow_downward.svg'
                            : 'arrow_upward.svg'
                      }
                      " class="icon-svg ${
                        row.angleStatus === 0
                          ? 'status-ok'
                          : row.torqueStatus === 2
                            ? 'status-warning'
                            : 'status-error'
                      }" />
                      ${row.angle}
                    </td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  setTimeout(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(fullTable.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  }, 1000);
};
