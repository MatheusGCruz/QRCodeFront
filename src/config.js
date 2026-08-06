/**
 * Central application configuration.
 *
 * Values can be overridden per environment via the REACT_APP_* variables
 * (see .env.example). Fallbacks are provided so the app works out of the box.
 */

const API_BASE_URL = process.env.REACT_APP_TANUKI_API || 'https://api.antares.ninja/Tanuki/';
const BASE_URL = process.env.REACT_APP_TANUKI_BASE_URL || 'https://tanuki.click/';

export { API_BASE_URL, BASE_URL };
