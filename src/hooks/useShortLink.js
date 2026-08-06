import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import qrPlaceholder from '../img/qr-placeholder.jpeg';

/**
 * Encapsulates the "shorten a link + generate a QR code" business logic.
 * Keeps UI concerns out of App state and makes the flow unit-testable.
 */
const useShortLink = () => {
  const [originalLink, setOriginalLink] = useState('https://antares.ninja/');
  const [shortLink, setShortLink] = useState('https://tanuki.click/z8HSYsk');
  const [qrImage, setQrImage] = useState(qrPlaceholder);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLink = useCallback(async (desiredUrl) => {
    setError('');
    setIsGenerating(true);

    try {
      const response = await axios.post(`${API_BASE_URL}generateQrCode`, desiredUrl, {
        headers: { 'Content-Type': 'text/plain' },
      });

      if (response.status === 200 && response.data.desiredUrl) {
        setOriginalLink(response.data.desiredUrl);
        setShortLink(response.data.pinCode);
        setQrImage(`data:image/png;base64,${response.data.base64}`);
      } else {
        setError('Could not generate the link. Please try again.');
      }
    } catch (err) {
      console.error('Error generating link:', err);
      setError('Something went wrong while generating the link. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { originalLink, shortLink, qrImage, error, isGenerating, generateLink };
};

export default useShortLink;
