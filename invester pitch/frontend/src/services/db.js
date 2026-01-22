// Local storage wrapper - mainly for messages/contacts now
const KEYS = {
    STARTUPS: 'vf_startups',
    PORTFOLIO: 'vf_portfolio',
    MESSAGES: 'vf_messages',
    CONTACTS: 'vf_contacts'
};

export const db = {
    init: () => {
        // No-op: Real DB used for core data.
        // Local storage reserved for temporary message caching if needed.
    },

    getStartups: () => [], // Deprecated

    getPortfolio: () => [], // Deprecated

    getMessages: (userId) => {
        const key = userId ? `${KEYS.MESSAGES}_${userId}` : KEYS.MESSAGES;
        const stored = localStorage.getItem(key);
        if (!stored && userId) {
            return [];
        }
        return JSON.parse(stored || '[]');
    },

    addMessage: (userId, msg) => {
        const key = userId ? `${KEYS.MESSAGES}_${userId}` : KEYS.MESSAGES;
        const msgs = db.getMessages(userId);

        // Prevent duplicates
        if (!msgs.find(m => m.id === msg.id)) {
            msgs.push(msg);
            localStorage.setItem(key, JSON.stringify(msgs));
        }
        return msgs;
    },

    getContacts: (userId) => {
        const key = userId ? `${KEYS.CONTACTS}_${userId}` : KEYS.CONTACTS;
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    addContact: (userId, contact) => {
        const key = userId ? `${KEYS.CONTACTS}_${userId}` : KEYS.CONTACTS;
        const contacts = db.getContacts(userId);
        const exists = contacts.find(c => c.id === contact.id || c.name === contact.name);
        if (!exists) {
            contacts.unshift(contact); // Add to top
            localStorage.setItem(key, JSON.stringify(contacts));
        }
        return contacts;
    },

    updateStartup: (updated) => {
        // No-op
    }
};
