const registerUser = async (username, password, email, token) => {
    const response = await fetch(`http://localhost:3000/auth/register/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
};

export { registerUser };