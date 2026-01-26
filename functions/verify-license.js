// REPLACE your entire handleVerifyLicense function with THIS:

const handleVerifyLicense = async () => {
  if (!licenseKey || !licenseKey.trim()) {
    alert('Please enter your license key');
    return;
  }

  const key = licenseKey.trim();

  // Simple license check - no API calls
  // Valid keys: DEV-ADMIN-2024 or any Gumroad key you manually approve
  const validKeys = [
    'DEV-ADMIN-2024',
    // Add more keys here as needed
  ];

  if (validKeys.includes(key)) {
    const sessionToken = 'session-' + Date.now();
    localStorage.setItem('sessionToken', sessionToken);
    setUserEmail('user@nicheresearcher.com');
    setIsAuthenticated(true);
    alert('✅ License activated! Welcome to Niche Researcher Tool!');
    return;
  }

  // If not a valid key, show error
  alert('❌ Invalid license key. Please check your key and try again.');
};
