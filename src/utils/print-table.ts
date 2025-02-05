export const printAllPages = (data: any[]) => {
  const fullTable = document.createElement('div');

  fullTable.innerHTML = `
    <html>
      <head>
        <title>Resultados</title>
        <style>
          @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
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
            align-items: center;
            justify-content: center;
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
            text-align: center;
            width: 60px;
          }
        </style>
      </head>
      <body>
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
                      <span class="material-icons ${
                        row.generalStatus === 'OK' ? 'status-ok' : 'status-error'
                      }">
                        ${row.generalStatus === 'OK' ? 'check_circle' : 'cancel'}
                      </span>
                      ${row.generalStatus}
                    </td>
                  <td class="torque-angle-col status-icon">
                      ${row.torque}
                      <span class="material-icons ${
                        row.torqueStatus === 1 ? 'status-ok' : 'status-warning'
                      }">
                        ${row.torqueStatus === 1 ? 'check_circle' : 'arrow_downward'}
                      </span>
                    </td>
                    <td class="torque-angle-col status-icon">
                      ${row.angle}
                      <span class="material-icons ${
                        row.angleStatus === 1 ? 'status-ok' : 'status-warning'
                      }">
                        ${row.angleStatus === 1 ? 'check_circle' : 'arrow_downward'}
                      </span>
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

  // Cria a janela de impressão com os dados completos
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(fullTable.innerHTML);
    printWindow.document.close();
    printWindow.print();
  }
};
