const fetchEmployeeVisaStatusAPI = async (userID, token) => {
    const response = await fetch(`http://localhost:3000/api/visaStatus/${userID}`, {
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

export { fetchEmployeeVisaStatusAPI };
