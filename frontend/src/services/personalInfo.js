const submitPersonalInfoAPI = async (personalInfoData, userID, token) => {
    const response = await fetch(`http://localhost:3000/api/applications/${userID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-auth-token": token,
        },
        body: JSON.stringify(personalInfoData),
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
};

const getPersonalInfoAPI = async (userID, token) => {
    const response = await fetch(`http://localhost:3000/api/applications/${userID}`, {
        method: 'GET',
        headers: {
            "x-auth-token": token,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
};

const updatePersonalInfoAPI = async (personalInfoData, userID, token) => {
    const response = await fetch(`http://localhost:3000/api/applications/${userID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "x-auth-token": token,
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