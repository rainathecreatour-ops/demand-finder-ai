// Add this at the START of handleVerifyLicense function (around line 60)

const handleVerifyLicense = async () => {
  if (!licenseKey || !licenseKey.trim()) {
    alert('Please enter your license key');
    return;
  }

  // DEV BACKDOOR - Remove this after testing!
  if (licenseKey.trim() === 'DEV-ADMIN-2024') {
    const devToken = 'dev-session-' + Date.now();
    localStorage.setItem('sessionToken', devToken);
    setUserEmail('admin@nicheresearcher.com');
    setIsAuthenticated(true);
    alert('✅ Dev mode activated! You have full access.');
    return;
  }

  setAuthLoading(true);

  // Rest of your existing code...
