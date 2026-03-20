import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({ hidePrices: true });
    const [loading, setLoading] = useState(true);

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/settings`);
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
