/**
 * Live Browser Geolocation & Reverse Geocoding Utility
 * Detects user's real-time GPS coordinates and auto-resolves Indian city, state, street, and pincode.
 */

export const detectLiveLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser or device.'));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        let resolved = {
          street: '',
          landmark: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          formattedAddress: '',
        };

        try {
          // Attempt 1: BigDataCloud reverse geocode client API (fast, free, CORS-friendly)
          const bdcRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (bdcRes.ok) {
            const bdcData = await bdcRes.json();
            resolved.city = bdcData.city || bdcData.locality || '';
            resolved.state = bdcData.principalSubdivision || '';
            resolved.postalCode = bdcData.postcode || '';
            resolved.country = bdcData.countryName || 'India';
            resolved.street = bdcData.locality || bdcData.localityInfo?.administrative?.[3]?.name || '';
          }
        } catch (e) {
          console.warn('BigDataCloud geocode failed, falling back:', e);
        }

        // Attempt 2: OpenStreetMap Nominatim if street or pincode is missing
        if (!resolved.postalCode || !resolved.street) {
          try {
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            if (nomRes.ok) {
              const nomData = await nomRes.json();
              if (nomData && nomData.address) {
                const a = nomData.address;
                resolved.street =
                  resolved.street ||
                  [a.house_number, a.road || a.pedestrian || a.suburb || a.neighbourhood]
                    .filter(Boolean)
                    .join(', ') ||
                  a.residential ||
                  '';
                resolved.landmark = a.amenity || a.building || '';
                resolved.city = resolved.city || a.city || a.town || a.village || a.county || '';
                resolved.state = resolved.state || a.state || '';
                resolved.postalCode = resolved.postalCode || a.postcode || '';
                resolved.formattedAddress = nomData.display_name || '';
              }
            }
          } catch (e) {
            console.warn('Nominatim geocode failed:', e);
          }
        }

        resolve({
          success: true,
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          googleMapsUrl,
          address: resolved,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === 1) {
          msg = 'Location permission was denied. Please allow location access in your browser settings.';
        } else if (error.code === 2) {
          msg = 'Location unavailable. Please verify GPS or network signal.';
        } else if (error.code === 3) {
          msg = 'Location detection timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      }
    );
  });
};
