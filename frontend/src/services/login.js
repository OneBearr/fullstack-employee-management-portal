const fetchUserInfoAPI = async (value) => {
    const { username, password } = value;
    const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(
            responseData.message || `HTTP error! status: ${response.status}`
        );
    }

    return responseData;
};

export { fetchUserInfoAPI };
