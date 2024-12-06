import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import Card from "@mui/material/Card";

import CardHeader from '@mui/material/CardHeader';

export function AnalyticsChartBar() {
  const tableData = {
    1: { name: "Cockpit", value: 93, color: "green" },
    2: { name: "Coluna de direção", value: 90, color: "red" },
    3: { name: "Modulo do Air Bag", value: 86, color: "yellow" },
    4: { name: "Tanque de combustível", value: 87, color: "red" },
    5: { name: "Amortecedor", value: 77, color: "green" },
  };
  const namesArray = Object.values(tableData).map((item) => item.name);
  const valuesArray = Object.values(tableData).map((item) => item.value);
  const barColors = Object.values(tableData).map((item) => item.color);
  // make array of bar colors, highlighting max/min
  // const minVal = Math.min(...valuesArray);
  // const maxVal = Math.max(...valuesArray);  
  // const barColors = valuesArray.map((val) => {
  //   if (val === minVal) {
  //     return "red";
  //   } else if (val === maxVal) {
  //     return "green";
  //   } else {
  //     return null; // non-max and non-min values take default color of series
  //   }
  // });

  return (
    <Box>
      <Card >
      <CardHeader title='TOP 5 NOK' subheader='por operação' />
        <BarChart
          width={500}
          height={300}
          series={[{ data: valuesArray, id: "cId" }]}
          xAxis={[
            {
              data: namesArray,
              scaleType: "band",
              colorMap: {
                type: "ordinal",
                values: namesArray,
                colors: barColors,
              },
              
            },
          ]}
        />
      </Card>
    </Box>
  );
}

export default AnalyticsChartBar;