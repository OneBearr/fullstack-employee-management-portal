export const hr_GetPersonalInfoAPI = async (userID, token) => {
    const response = await fetch(`http://localhost:3000/api/hrApplications/${userID}`, {
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

export const hr_GetPersonalFilesAPI = async (userID, token) => {
    const response = await fetch(`http://localhost:3000/api/hrFiles/${userID}`, {
        method: "GET",
        headers: {
            "x-auth-token": token,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${response.status}`
        );
    }

    return responseData;
};

export const hr_GetVisaStatusAPI = async (token) => {
    const response = await fetch(`http://localhost:3000/api/hrVisaStatus/`, {
        method: "GET",
        headers: {
            "x-auth-token": token,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${response.status}`
        );
    }

    return responseData;
};

export const hr_SendNotification = async (user, subject, text, token) => {
    const response = await fetch(`http://localhost:3000/api/notification/${user}`, {
        method: "POST",
        headers: {
            "x-auth-token": token,
        },
        body: JSON.stringify({subject:subject, text: text}),
    });
    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${response.status}`
        );
    }

    return responseData;
};