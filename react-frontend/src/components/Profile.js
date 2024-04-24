import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfile from './userdropdown/UserProfile';
import UserModal from './userdropdown/UserModal';
import axios from 'axios';
import '../styling/Profile.css';

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();


  // State management for showing the modal and storing user metadata
  const [showModal, setShowModal] = useState(false);
  const [height, setHeight] = useState(user.custom_metadata?.height || '');
  const [weight, setWeight] = useState(user.custom_metadata?.weight || '');
  const [gender, setGender] = useState(user.custom_metadata?.gender || 'prefer_not_to_say');
  const [errors, setErrors] = useState({});


  // Event handlers for form inputs
  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);
  const handleLogout = () => logout({ returnTo: window.location.origin });
  const handleShowModal = () => setShowModal(true);



  // Hide modal and reset values to their initial states
  const handleCloseModal = () => {
    setShowModal(false);
    setHeight(user.custom_metadata?.height || '');
    setWeight(user.custom_metadata?.weight || '');
    setGender(user.custom_metadata?.gender || 'prefer_not_to_say');
  }


  // Validate user metadata before submitting
  const validateMetadata = () => {
    let newErrors = {};
    if (isNaN(height) || height < 0 || height > 100) {
      newErrors.height = 'Height must be a number between 0 and 100.';
    }
    if (isNaN(weight) || weight < 0 || weight > 500) {
      newErrors.weight = 'Weight must be a number between 0 and 500.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Handle submission of the modal form, send appropriate post request
  const handleSubmitModal = async () => {
    if (!validateMetadata()) {
      return;
    }
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.post('https://dininginfobackend.azurewebsites.net/metadata/api/update_user', {
        height, weight, gender
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setShowModal(false);  
      window.location.reload();
    } catch (error) {
      console.error('Error submitting user metadata:', error);
    }
  };


  // Fetch a new access token when modal is closed (on update)
  useEffect(() => {
    if (!showModal) {
      const printNewAccessToken = async () => {
        try {
          const newAccessToken = await getAccessTokenSilently({ ignoreCache: true });
          console.log('New Access Token:', newAccessToken);
          console.log('User:', user);
        } catch (error) {
          console.error('Error generating new access token:', error);
        }
      };
      printNewAccessToken();
    }
  }, [showModal, getAccessTokenSilently, user]);

  if (isLoading) {
    return <div>Loading ...</div>; // Indicate loading status 
  }

  if (!isAuthenticated) {
    return null; // Do not render anything if the user is not authenticated
  }

  return (
    <>
      <UserProfile user={user} onShowModal={handleShowModal} onLogout={handleLogout} />
      <UserModal
        showModal={showModal}
        onCloseModal={handleCloseModal}
        height={height}
        weight={weight}
        gender={gender}
        errors={errors}
        onHeightChange={handleHeightChange}
        onWeightChange={handleWeightChange}
        onGenderChange={handleGenderChange}
        onSubmitModal={handleSubmitModal}
      />
    </>
  );
};

export default Profile;
