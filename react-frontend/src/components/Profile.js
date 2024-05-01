import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfile from './userdropdown/UserProfile';
import UserModal from './userdropdown/UserModal';
import '../styling/Profile.css';
import { Alert, Spinner } from 'react-bootstrap';
import axios from "../api/common";

const Profile = () => {
  
  
  // State management for showing the modal and storing user metadata
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'prefer_not_to_say',
    calories: '',
    carbohydrates: '',
    protein: '',
    fat: ''
  });


  const [errors, setErrors] = useState({});

  // States for managing alert and loading status for submission
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

// Event handler for form inputs
  const handleChange = (field) => (e) => {
    setUserData({ ...userData, [field]: e.target.value });
  };

  const handleLogout = () => logout({ returnTo: window.location.origin });


  const handleShowModal = () => {
    setUserData({
      ...userData,
      height: user.custom_metadata?.height || '',  // Always fetch the latest info from user metadata
      weight: user.custom_metadata?.weight || '',
      age: user.custom_metadata?.age || '',
      gender: user.custom_metadata?.gender || 'prefer_not_to_say',
      calories: user.custom_metadata?.goals?.calories || '',
      carbohydrates: user.custom_metadata?.goals?.carbohydrates || '',
      protein: user.custom_metadata?.goals?.protein || '',
      fat: user.custom_metadata?.goals?.fat || ''
    });
    setShowModal(true);
  };



  // Validate user metadata before submitting
  const validateMetadata = () => {
    const fieldSpecifications = [
      { field: 'height', min: 0, max: 100, unit: 'Height' },
      { field: 'weight', min: 0, max: 500, unit: 'Weight' },
      { field: 'age', min: 13, max: 150, unit: 'Age' },
      { field: 'calories', min: 0, max: 10000, unit: 'Calories' },
      { field: 'carbohydrates', min: 0, max: 1000, unit: 'Carbohydrates' },
      { field: 'protein', min: 0, max: 500, unit: 'Protein' },
      { field: 'fat', min: 0, max: 300, unit: 'Fat' }
    ];
  
    let newErrors = {};
    fieldSpecifications.forEach(({ field, min, max, unit }) => {
      const value = userData[field];
      if (isNaN(value) || value === "" || value < min || value > max) {
        newErrors[field] = `${unit} must be a number between ${min} and ${max}.`;
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  // Handle submission of the modal form, send appropriate post request
  const handleSubmitModal = async () => {
    if (!validateMetadata()) {
      return;
    }
    setLoadingSubmit(true);
    setSubmitStatus(null);
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.post(
        "/metadata/api/update_user",
        {
          gender: userData.gender,
          height: userData.height,
          age: userData.age,
          weight: userData.weight
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await axios.post(
        "/metadata/api/update_goals",
        {
          calories: userData.calories,
          carbohydrates: userData.carbohydrates,
          protein: userData.protein,
          fat: userData.fat
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowModal(false);
      setSubmitStatus({ type: 'success', message: 'Submission Successful!' });
      setLoadingSubmit(false);

      setTimeout(() => setSubmitStatus(null), 3000);

       // Fetch a new access token when modal is closed (on update), update values
      await getAccessTokenSilently({ cacheMode: "off", grant: "refresh_token", detailedResponse: true})
    

    } catch (error) {
      console.error('Error submitting user metadata:', error);
      setSubmitStatus({ type: 'danger', message: 'Error submitting data!' });
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setLoadingSubmit(false);
    }
  };
  

  if (isLoading) {
    return <div>Loading...</div>; // Indicate loading status 
  }

  if (!isAuthenticated) {
    return null; // Do not render anything if the user is not authenticated
  }

  return (
    <>
      <UserProfile user={user} onShowModal={handleShowModal} onLogout={handleLogout} />
      <UserModal
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}    
        // Hide modal and reset values to their initial states
        userData={userData}
        errors={errors}
        onChange={handleChange}
        onSubmitModal={handleSubmitModal}
      />
      {isLoadingSubmit && (
      <div style={{
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        zIndex: 1060  // Ensure this is above the modal z-index
      }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )}
    {submitStatus && (
      <Alert 
      variant={submitStatus.type} 
      className={`custom-alert custom-alert-${submitStatus.type}`}
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10%',
        right: '10%',
        textAlign: 'center',
        zIndex: 1060
      }}
    >
      {submitStatus.message}
    </Alert>
    )}
  </>
);
};

export default Profile;