const submitPersonalInfoAPI = async (personalInfoData, userID) => {
    const response = await fetch(`http://localhost:3000/api/applications/${userID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalInfoData),
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
};

const getPersonalInfoAPI = async (userID) => {
    const response = await fetch(`http://localhost:3000/api/applications/${userID}`);
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
};

const updatePersonalInfoAPI = async (personalInfoData, userID) => {
    const response = await fetch(`http://localhost:3000/api/applications/${userID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalInfoData),
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
};

export { submitPersonalInfoAPI, getPersonalInfoAPI, updatePersonalInfoAPI };