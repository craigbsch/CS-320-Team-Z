import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "../api/common";
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

const NutritionGraph = () => {
    const [macro, setMacro] = useState('calories');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [yAxisLabel, setYAxisLabel] = useState('');

    const { getAccessTokenSilently } = useAuth0();
   
    const handleDropdownChange = (event) => {
        setMacro(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const response = await axios.get('/nutrition/api/get_macronutrients', {
                    params: { nutrient_type: macro },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = response.data.nutrient_values;
                const nutrientType = response.data.nutrient_type;

                // Extracting labels and data for the chart
                const labels = data.map(entry => entry.date);
                const totals = data.map(entry => entry[macro]);  // Access dynamic key based on macro

                // Update chart data state
                setChartData({
                    labels: labels,
                    datasets: [{
                        label: nutrientType.charAt(0).toUpperCase() + nutrientType.slice(1),
                        data: totals,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                });

                // Custom y-axis label
                const nutrientLabelMap = {
                    calories: 'Calories (cal)',
                    protein: 'Protein (g)',
                    carbohydrates: 'Carbohydrates (g)',
                    fat: 'Fat (g)',
                };
                setYAxisLabel(nutrientLabelMap[macro]);
            } catch (error) {
                console.error('Error fetching nutrient data:', error);
            }
        };

        fetchData();
    }, [macro, getAccessTokenSilently]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Nutrient Data Over Time'
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
        <div style={{ height: '500px' }} className="line-graph">
            <select onChange={handleDropdownChange} value={macro}>
                <option value="calories">Calories</option>
                <option value="protein">Protein</option>
                <option value="carbohydrates">Carbohydrates</option>
                <option value="fat">Fat</option>
            </select>
            <Line data={chartData} width={700} height={500} options={options} />
        </div>
    );
};

export default NutritionGraph;
