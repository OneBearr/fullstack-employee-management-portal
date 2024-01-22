const submitOptReceiptAPI = async (documentFile, token) => {
    const formData = new FormData();
    formData.append('opt', documentFile);
    const response = await fetch(`http://localhost:3000/api/upload/opt`, {
        method: 'POST',
        headers: {
            "x-auth-token": token,
        },
        body: formData
    });

    const responseData = await response.json();
    if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
};

export { submitOptReceiptAPI };