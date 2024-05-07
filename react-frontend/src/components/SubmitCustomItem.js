import React, { useState } from "react";
import SubmitMeals from "./SubmitMeals";

const SubmitCustomItem = () => {
  const [customItems, setCustomItems] = useState([]);

  // Function to handle the submission of a custom item
  const handleSubmitCustomItem = (customItem) => {
    // Add the custom item to the array of custom items
    setCustomItems([...customItems, customItem]);
  };

  // Pass the array of custom items to the SubmitMeals component
  return <SubmitMeals selectedItems={customItems} />;
};

export default SubmitCustomItem;