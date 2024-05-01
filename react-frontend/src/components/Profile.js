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
    let newErrors = {};
    if (isNaN(userData.height) || userData.height === "" || userData.height < 0 || userData.height > 100) {
      newErrors.height = 'Height must be a number between 0 and 100.';
    }
    if (isNaN(userData.weight) || userData.weight < 0 || userData.weight > 500) {
      newErrors.weight = 'Weight must be a number between 0 and 500.';
    }
    if (isNaN(userData.age) || userData.age < 13 || userData.age > 150) {
      newErrors.age = 'Age must be a number between 13 and 150.';
    }
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

      const response = await axios.post(
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

      console.log(response.data);
      console.log("Old Access Token:", accessToken);
      setShowModal(false);
      setSubmitStatus({ type: 'success', message: 'Submission Successful!' });
      setLoadingSubmit(false);

      setTimeout(() => setSubmitStatus(null), 3000);

      const refreshToken = await getAccessTokenSilently({
        cacheMode: "off",
        grant: "refresh_token",
        detailedResponse: true,
    })
     // Fetch a new access token when modal is closed (on update), update values
      console.log('New Access Token:', refreshToken);

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