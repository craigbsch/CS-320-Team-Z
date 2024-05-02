import React, { useEffect, useContext, useState } from 'react';
import axiosFASTAPI from "../api/common";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
 } from 'chart.js';

 ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
 );

const PageWithGraph = () => {
   const [macro, setMacro] = useState('calories');
   const [chartData, setChartData] = useState({ labels: [], datasets: [] });
   const [yAxisLabel, setYAxisLabel] = useState('');

   const handleDropdownChange = (event) => {
    setMacro(event.target.value);
    };


   useEffect(() => {
       axiosFASTAPI
           .get('/nutrition/api/get_macronutrients', {
               params: {
                   nutrient_types: macro,
               },
           })
           .then((response) => {
            console.log(response.data);
            const data = response.data.nutrient_values;
            const nutrientType = response.data.nutrient_type;

            // Extracting labels and data for the chart
            const labels = data.map((entry) => entry.date);
            const totals = data.map((entry) => entry[nutrientType]);

               // Update chart data state
               setChartData({
                labels: labels,
                datasets: [
                    {
                        label: nutrientType.charAt(0).toUpperCase() + nutrientType.slice(1), // Capitalize first letter
                        data: totals,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }
                ]
              });

               // Custom y-axis label
               const nutrientLabelMap = {
                   calories: 'Calories (cal)',
                   protein: 'Protein (g)',
                   carbohydrates: 'Carbohydrates (g)',
                   fat: 'Fat (g)',
               };
               setYAxisLabel(nutrientLabelMap[macro]);
           })
           .catch((error) => {
               console.error('Error fetching meals:', error);
           });
   }, [macro]);

   const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Nutrient Data'
        }
    },
    scales: {
        y: {
            title: {
                display: true,
                text: yAxisLabel
            }
        }
    }
   };

   return (
    <div style={{ height: '300px' }} className="line-graph">
    <select onChange={handleDropdownChange} value={macro}>
        <option value="calories">Calories</option>
        <option value="protein">Protein</option>
        <option value="carbohydrates">Carbohydrates</option>
        <option value="fat">Fat</option>
    </select>
    <Line data={chartData} width={400} height={300} options={options} />
    </div>
   );
};

export default PageWithGraph;
