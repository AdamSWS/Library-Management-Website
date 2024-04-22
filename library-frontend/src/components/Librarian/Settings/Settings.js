import React, { useState } from 'react';
import PersonalSettingsForm from './PersonalSettingsForm';
import DocumentSettingsForm from './DocumentSettingsForm';

export default function Settings() {
    const [userSettings, setUserSettings] = useState({
        name: '',
        email: ''
    });

    const [docSettings, setDocSettings] = useState({
        defaultCopies: '',
        alertThreshold: ''
    });

    return (
        <div className="container mx-auto mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PersonalSettingsForm onSave={setUserSettings} settings={userSettings} />
                <DocumentSettingsForm onSave={setDocSettings} settings={docSettings} />
            </div>
        </div>
    );
}
