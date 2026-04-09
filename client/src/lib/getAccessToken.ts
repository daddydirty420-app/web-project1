function getAccessTokenFromCookie() {
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access-token="));
    return match ? match.split("=")[1] : null;
};