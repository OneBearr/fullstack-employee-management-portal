const fetchPersonalFilesAPI = async (userID, token) => {
    const response = await fetch(`http://localhost:3000/api/files/${userID}`, {
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

const downloadPersonalFileAPI = async (accessURL, token) => {
    const response = await fetch(accessURL, {
        method: "GET",
        headers: {
            "x-auth-token": token,
        },
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = accessURL.split('/').pop(); 
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
};

const previewPersonalFileAPI = async (accessURL, token) => {
    try {
        const response = await fetch(accessURL, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const previewURL = URL.createObjectURL(blob);
        window.open(previewURL, '_blank');
    } catch (error) {
        console.error('Error:', error);
        alert('Preview failed.');
    }
};

export { fetchPersonalFilesAPI, downloadPersonalFileAPI, previewPersonalFileAPI };
