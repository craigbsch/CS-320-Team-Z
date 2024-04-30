return (
    <div className="nutrition-history-screen">
      <h2>Nutrition History</h2>
      
      {/* Add Button */}
      <button>Add Meal</button>

    <div className="best-meals-section">
        <h3>Best Meals</h3>
        {/* Display best meals here */}
        {/* Replace this with actual implementation */}
        <ol>
            <li>Meal 1</li>
            <li>Meal 2</li>
            <li>Meal 3</li>
        </ol>
    </div>

      {/* View Menu Button */}
      <Link to="/menu">
        <button>View Menu</button>
      </Link>

      {/* Calories Graph */}
      <div className="calories-graph">
        <h3>Calories Graph</h3>
        <LineChart width={600} height={300} data={caloriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="calories" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
