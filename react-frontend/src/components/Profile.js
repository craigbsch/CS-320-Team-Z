import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfile from './userdropdown/UserProfile';
import UserModal from './userdropdown/UserModal';
import '../styling/Profile.css';
import { Alert, Spinner } from 'react-bootstrap';
import axiosFASTAPI from "../api/common";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();


  // State management for showing the modal and storing user metadata
  const [showModal, setShowModal] = useState(false);
  const [height, setHeight] = useState(user.custom_metadata?.height || '');
  const [weight, setWeight] = useState(user.custom_metadata?.weight || '');
  const [age, setAge] = useState(user.custom_metadata?.age || '');
  const [gender, setGender] = useState(user.custom_metadata?.gender || 'prefer_not_to_say');
  const [errors, setErrors] = useState({});



  // State management for storing goals

  const [calories, setCalories] = useState(user.custom_metadata?.goals?.calories || '');
  const [carbohydrates, setCarbohydrates] = useState(user.custom_metadata?.goals?.carbohydrates || '');
  const [protein, setProtein] = useState(user.custom_metadata?.goals?.protein || '');
  const [fat, setFat] = useState(user.custom_metadata?.goals?.fat || '');


  // Event handlers for form inputs
  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleAgeChange = (e) => setAge(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);


  const handleCalorieChange = (e) => setCalories(e.target.value);
  const handleCarbohydrateChange = (e) => setCarbohydrates(e.target.value);
  const handleProteinChange = (e) => setProtein(e.target.value);
  const handleFatChange = (e) => setFat(e.target.value);



  const handleLogout = () => logout({ returnTo: window.location.origin });

  // ensure default values are user metadata
  const handleShowModal = () => {
    
    setHeight(user.custom_metadata?.height || '');
    setWeight(user.custom_metadata?.weight || '');
    setGender(user.custom_metadata?.gender || 'prefer_not_to_say');    
    setAge(user.custom_metadata?.age || '');

    

    setCalories(user.custom_metadata?.goals?.calories || '');
    setCarbohydrates(user.custom_metadata?.goals?.calories || '');
    setProtein(user.custom_metadata?.goals?.protein || '');
    setFat(user.custom_metadata?.goals?.fat || '');


    setShowModal(true);

  }


  

  // States for managing alert and loading status for submission
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null



  // Hide modal and reset values to their initial states
  const handleCloseModal = () => {
    setShowModal(false);
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

    if(isNaN(age) || age < 13 || age > 150){
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
    await axiosFASTAPI.post(
			"/metadata/api/update_goals",
			{
				calories,
        carbohydrates,
        protein,
        fat
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			}
		);
		const response = await axiosFASTAPI.post(
			"/metadata/api/update_user",
			{
				gender,
        height,
        age,
        weight
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
        age={age}
        gender={gender}
        errors={errors}
        onHeightChange={handleHeightChange}
        onWeightChange={handleWeightChange}
        onAgeChange={handleAgeChange}
        onGenderChange={handleGenderChange}


        calories={calories}
        protein={protein}
        fat={fat}
        carbohydrates={carbohydrates}
        
        onCaloriesChange={handleCalorieChange}
        onCarbohydratesChange={handleCarbohydrateChange}
        onProteinChange={handleProteinChange}
        onFatChange={handleFatChange}

        //
        
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
